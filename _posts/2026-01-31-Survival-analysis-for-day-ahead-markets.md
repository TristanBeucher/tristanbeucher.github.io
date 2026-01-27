This article is indeed one more piece about negative prices in day-ahead markets — but my real motivation behind this post lies in the method, not the topic itself. Allow me a quick autobiographical detour (it’s my blog, so I grant myself the permission).

In 2019, still a student, I joined a consulting firm specialised in the insurance sector as an apprentice: Seabird where I eventually worked for four years (three of them under a permanent contract after my one-year apprenticeship). This same year 2019–2020 was also my final year in engineering school. My major was data science, but I decided to take additional actuarial science courses to stay consistent with my new role. That is how I ended up spending several hours wrestling with survival analysis models. Survival analysis focuses on durations and is traditionally associated with medical studies (“how long until a patient relapses or dies?”) or insurance (“how long until a claim occurs?”).

Seven years later, after switching to the energy sector, I am still strongly convinced that survival analysis methods are extremely useful, simple (yet robust), intuitive, and clearly under-exploited in energy markets. I had been looking for a way to reuse them in my current position, and studying the persistence of negative prices quickly appeared as the most obvious use case.

That said, I was initially unconvinced. Another article on negative prices did not feel particularly necessary.

Then I started digging a bit deeper and found several related use cases in the literature (lifetime of power transformers (see Martin, 2018) or estimation of remaining useful life of hydropower units (see Barbosa de Santis, 2023)). What ultimately tipped the balance was an innovative paper by Zamundio Lopez and Zareipour (2025), applying the Kaplan–Meier estimator (a non-parametric survival analysis tool introduced almost seventy years ago by MM Kaplan & Meier) to price spikes. That work validated my intuition: if you simply flip the threshold used to define a price spike, replace it with zero, you can reproduce a very similar analysis for negative prices.

This is essentially what I propose to do here, with two differences:
- the focus is on European day-ahead markets, and
- I would like to go slightly further than a pure Kaplan–Meier analysis.

To sum up, the main objective of this article is to introduce survival analysis through a concrete energy-market application by answering a simple question : how long do negative prices actually last? I'll do two articles on this  topic. This one, the first part, focuses on the Kaplan–Meier estimator and hazard rates. A second part may go further — probably using a Cox proportional hazards model (see Cox, 1972) or even tree-based survival methods to explain why negative prices persist. But that part is not written yet. Let's take one thing at a time.

This article is organized as follow : using the pretext of studying negative prices (for France, Germany, the Netherlands and Spain), the first three sections introduce the kaplan-meier estimator to demonstrate its complementarity with traditionnal tools like histograms. Then the last section deepens the analysis by introducing new variables or yearly distinctions. 

In this article, I'll use day-ahead prices and wind and solar load forecasts from ENTSO-E Transparency Platform
for several Western Europe countries. I'll focus on the 2021-2025 period and use hourly prices (quarterly prices after october 2025 are aggregated to ensure consistency over the period).

## 1. What we analyze : The duration of an event

Survival analysis focuses on a random variable $$T$$, representing the time until an event ends (or occurs). It's the heart of everything.

In our context:
- the event is a negative price spell, which starts when a price is strictly below zero and ends when the price goes back over zero again.
- $$T$$ is the duration of that spell (measured in hours). The duration is always positive.

Day-ahead auctions take place for the next days then, in theory, a negative spell can be right-censored meaning that if the spell is still ongoing at the end of the observed period, we can't know its true duration. Even if it remains very unlikely for negative prices, being able to deal with right-censorship is a huge advantage of survival analysis.

## 2. The limits of histograms and averages

Before going further on survival analysis, it is worth clarifying *why* more traditional tools, such as histograms and averages (or median), fail to fully adress the question we are interested in. Of course, it doesn't mean they are not useful or complementary. In fact histograms already reveal several important structural facts about negative price spells in European day-ahead markets.

![Histogram](images/survival analysis/histogram base.png)


Across all four countries, spell durations are heavily right-skewed. The majority of spells are short-lived with a modal duration of 1–2 hours. However a long tail of persistent events exists in every market.

This shape immediately rules out Gaussian assumptions and already hints that averages will be misleading.

Even if the mean duration is the same, A market with many short spells and a few very long ones does not behave like a market with moderately persistent negative prices. The dashed vertical lines show the median spell duration. At first glance, this suggests a simple ranking: Spain resolves negative prices faster, France and the Netherlands more slowly.

What really differentiates markets is the tail behaviour:
- Spain has very few spells beyond 6–7 hours.
- Germany exhibits a longer tail, with non-negligible mass up to ~10 hours.
- France and the Netherlands show the heaviest tails, with rare but very persistent events extending well beyond 10 hours.


### Histograms ignore time ordering

A histogram of negative price spell durations treats each spell as an **independent observation**, disconnected from time.

This means that:
- a spell lasting 1 hour and one lasting 10 hours are simply counted as two observations,
- the histogram does not tell us *when* spells tend to end,
- nor how the probability of termination evolves as time passes.

In other words, histograms answer the question:

> *“How many spells have a given duration?”*

but completely ignore the question:

> **“Given that a spell has already lasted 3 hours, how likely is it to end now?”**


---


### Histograms and averages fail to handle censoring properly

I already wrote that censoring occurs whenever the full duration of a spell is **not observed**.

In practice, this happens when a negative price spell is still ongoing at the end of the dataset, or when data availability changes due to market design or resolution. 

Histograms and averages handle such observations poorly and that introduce bias:
- censored spells are either dropped (persistence is underestimated),
- or treated as if they had ended exactly at the observation cutoff (true duration is misrepresented).


## 3. The Kaplan-Meier Estimator and hazard rates

These histograms are useful but only descriptively to show skewness, heterogeneity across countries, and the existence of long tails.

What they cannot show is:
- how persistence decays over time,
- how conditional risk evolves hour by hour,
- or how to compare markets dynamically rather than statically.

To answer these questions, we now shift from frequency-based descriptions to time-conditional probabilities, using the Kaplan–Meier estimator. Let's define it formally.

### The survival function 

The central object in survival analysis is the **survival function**, defined as:

$$
S(t) = \mathbb{P}(T > t)
$$

In plain language:

> $$ S(t) $$ is the probability that a negative price spell lasts **longer than** $$ t $$.

This interpretation is extremely intuitive:

- $$ S(0.25) = 0.6 $$  
  → 60% of negative price spells last more than 15 minutes

- $$ S(2) = 0.1 $$  
  → only 10% last more than 2 hours

Unlike a simple average duration, the survival function tells us **how persistence decays over time**.

---

### The Kaplan–Meier estimator

The **Kaplan–Meier (KM) estimator** is a non-parametric estimator of the survival function. It makes **no assumption** about the underlying distribution of durations (and this property is very desirable in electricity markets).

Formally, it is defined as:

$$
\hat{S}(t) =
\prod_{t_i \le t}
\left( 1 - \frac{d_i}{n_i} \right)
$$

Where:

- $$ t_i $$ are the observed event times,
- $$ d_i $$ is the number of spells ending **exactly** at time $$ t_i $$,
- $$ n_i $$ is the number of spells still ongoing **just before** $$ t_i $$.

Although survival analysis is often introduced in continuous time, the Kaplan–Meier estimator works perfectly well in **discrete time**, fortunately for us. 

---

### Kaplan–Meier: the step-by-step intuition

The KM estimator works as follows:

1. Start with all negative price spells “alive”
2. Move forward in time
3. Each time some spells end, the survival probability drops
4. The drop is proportional to:
   - how many spells end,
   - relative to how many were still alive

Note that this estimator explicitly accounts for censoring:
- censored spells contribute information *up to the time they are observed*,
- without artificially assuming when they end.

This is a key reason why survival methods are widely used in fields where observation windows are finite, such as medicine, where right-censoring due to loss to follow-up is frequent.

This produces the characteristic **step-shaped curve**:

![KMestimator](images/survival analysis/Km estimator base.png)


Each curve represents how negative spell behave in a different country. All four curves drop sharply during the first hours. This confirms a key stylised fact already hinted at by the histograms: most negative price spells are short-lived.

However, the speed of decay differs markedly across countries:
- Spain (ES) exhibits the steepest early drop: negative prices resolve quickly once they appear (after ~2 hours, survival is well below 50%).
- Germany (DE) follows a similar but slightly slower pattern (after ~2 hours, survival is around 55–60%).
- France (FR) and especially the Netherlands (NL) display much higher early survival probabilities (after ~2 hours, survival is closer to 65–70%).


Beyond 8–10 hours, survival probabilities are low in all countries but they are not zero. Notably:
- NL and FR maintain non-negligible survival mass further into the tail,
- ES almost completely disappears beyond ~8 hours.

Tail behaviour differs more strongly than central tendency.

An important feature of the figure is that the curves do not cross and remain ordered over most of the duration range. This suggests that persistence differences are systematic, not driven by a few extreme events. If negative prices were governed by the same underlying dynamics across markets, we would expect the curves to overlap more or cross frequently. 

You remember that France and the Netherland exhibited the same median duration ? Well, we see on the previous plot that once a negative price spell starts, it is initially more persistent in NL than in FR (until 4h, the NL curve is above the FR curve). Then, conditional on having already lasted several hours (around 5-6h), the remaining lifetime of negative price spells is similar in France and the Netherlands.

The stepwise nature of the curves also hints at preferred termination times. This motivates the next layer of analysis:
- hazard rates to identify when spells are most likely to end,
- and, later, covariate-based models (e.g. Cox) to explain why persistence differs across markets.

---


### Hazard rate: when do spells tend to end?

Closely related to the survival function is the **hazard rate**, defined as:

$$
h(t) = \mathbb{P}(T = t \mid T \ge t)
$$

In words:

> The probability that a negative price spell ends at time $$ t $$,  
> **given that it has lasted until $$ t $$**.

In discrete form, this can be estimated as:

$$
h(t) = \frac{d_t}{n_t}
$$

Where:

- $$ d_t $$ is the number of spells ending at time $$ t $$,
- $$ n_t $$ is the number of spells still ongoing at time $$ t $$.

The hazard rate is particularly useful to identify **preferred termination times**, for instance when negative prices tend to resolve after one or two hours due to market or operational constraints.

I computed the hazard rates for the four countries of this study. The first raw version of a plot I made to summarize the results was unreadable so I decided to smooth the rates and only display those for times with more than 30 spells ongoing. This is what is represented on the left plot below. On the right, you can observe cumulative hazard which is basically the sum of all hazard rate up to time t.

![HazardRates](images/survival analysis/hazard rate base.png)


Perfectly aligned with the KM analysis, Spain (ES) exhibits the highest early hazard: once a negative price appears, it is comparatively likely to resolve quickly. France (FR) and Germany (DE) show intermediate early hazards. The Netherlands (NL) displays the lowest early hazard, indicating stronger early persistence.

Beyond ~6 hours (still under the n_at_risk ≥ 30 constraint), hazards across FR, DE and NL begin to converge toward similar levels (≈30–40%).

All markets display a broadly U-shaped hazard pattern:
- hazards decline slightly after the first hour,
- reach a local minimum around 2–4 hours,
- then increase steadily beyond ~4–5 hours.

That means that once a negative price spell survives the initial adjustment phase, its probability of termination increases again.

## 4. Let's continue with the analysis

I've been dropping several plot along my previous explanations. 




### Reference sources
- Kaplan, Meier (1958), *Nonparametric Estimation from Incomplete Observations*
- Cox (1972), *Regression Models and Life-Tables*
- Zamundio Lopez, Zareipour (2025), *Modeling the Duration of Electricity Price Spikes Using Survival Analysis*
- Martin and al. (2018), *Investigation Into Modeling Australian Power Transformer Failure and Retirement Statistics*   
- Barbosa de Santis and al. (2023), *A Data-Driven Framework for Small Hydroelectric Plant Prognosis Using Tsfresh and Machine Learning Survival Models*









