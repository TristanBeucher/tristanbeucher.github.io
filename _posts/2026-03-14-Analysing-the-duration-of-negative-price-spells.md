
In a previous post, I initiated a discussion (or should I say a monolog ?) about the potential of survival analysis in the energy sector. Inspired by this paper (CITE) focused on price spikes, I started analysing negative price spells in West European day ahead markets from the perspective of their duration rather than their occurence. You can find the complete article here (LINK). Thanks to the Kaplan-Meier estimator and the concept of hazard rate, I uncovered the following stylised facts :

- Spain exhibits the steepest early drop (after ~2 hours, survival is well below 50%) while France, Belgium and the Netherlands display much higher early survival probabilities (after ~2 hours, survival is closer to 65–70%). Germany sits in-between (after ~2 hours, survival is closer to 65–70%). In Switzerland, negative price spells are less frequent, but when they occur, they tend to persist longer.
- The probability of negative price spells lasting longer tends to increase in France with the years while no clear difference can be spotted in Germany. In that sense, Germany feels like a system that has already adapted to hthis phenomena, while France still appears to be in the middle of that adjustment process. 
- In Germany and Spain, as peak RES penetration increases, the survival curves shift upward almost systematically. This suggests a strong structural link between renewable oversupply and price persistence. Note that Spain exhibits a faster decay indicating that even high-RES situations tend to resolve more quickly. In France, the curves remain relatively close across penetration bins, suggesting that renewable penetration alone does not fully explain persistence.


Kaplan–Meier is great: it tells you the probability that a negative price spell is still ongoing after 1 hour, 2 hours, 6 hours, etc. But it remains a descriptive tool. Today I'd like to go further and reproduce the same kind of analysis with Cox proportionnal hazard models. These models will help to uncover the variable impacting the duration of negative price spells. As in the first article, I'll use data from the Entso-e Transparency platform. I'll focus on France, Belgium, Germany and Spain because the models created for these countries have shown very different results.

This article is organised as follow : the first section aims to give you a good understanding of the Cox proportionnal hazard model and will describe the procedure and metrics I'll use to build and evaluate the model. The other sections are organized by countries.


## The Cox proportional hazard model

The Cox model has been introduced by XXX. It answers a simple question

> **“What factors increase or decrease the probability that a negative price spell ends?”**

Instead of modelling duration directly, the Cox model focuses on the hazard rate. The hazard rate is simply the probability that the spell ends at this moment, given that it has lasted until now. Think of it as the instantaneous “escape probability” from a negative price regime. If the hazard is high, the event ends quickly. Otherwise, the event tends to persist.

The Cox model assumes that the hazard takes the following form:

$$
h(t \mid X) = h_0(t)\, e^{\beta X}
$$

Where:

- **$$h(t \mid X)$$**: hazard at time $$t$$, given the covariates $$X$$  
- **$$h_0(t)$$**: baseline hazard (the natural dynamics of the system)  
- **$$X$$**: explanatory variables (residual load, seasonality, etc.)  
- **$$\beta$$**: coefficients estimated by the model

Let's decompose this formula. First we have the baseline hazard **$$h_0(t)$$** which represents the probability that a spell ends at time t, when all covariates are neutral. If the system conditions change, it should change the probability that the spell ends. This is why the baseline hazard is multiplied by a factor: $$ e^{\beta X} $$

The exponential term has several convenient properties.
- the hazard must always be positive and the exponential ensures $$ e^{\beta X} > 0$$
- Effects combine multiplicatively : Effects combine multiplicatively
- The exponential makes interpretation easy through hazard ratios. If $$ e^{\beta} = 1.5 $$ then a one-unit increase in the variable increases the probability that the event ends by 50%.

In fact, the **hazard ratio** is the key quantity. It's what we usually interpret. If the hazard ratio is above one, the event ends faster (probability to stop increase). If the hazard ratio is below one, the event tends to last longer (probability to stop decrease).

The Cox model has a very elegant property: it is **semi-parametric**. The effect of the variables is modeled parametrically. Here we estimate coefficients $$ \beta $$, just like in a linear or logistic regression.  
This part tells us **how the explanatory variables affect the hazard**. It's indeed very easy to interpret.

However the baseline hazard is not specified. We do not assume it follows a particular distribution (exponential, Weibull, log-normal, etc.). Instead, the model leaves it completely flexible. In many duration problems, the natural timing dynamics of events are complex and unknown.

For example, negative electricity price events might:

- end quickly most of the time,
- but occasionally persist for many hours during oversupply regimes.

Rather than forcing the duration distribution into a specific functional form, the Cox model lets the data determine the shape of $$h_0(t)$$.

The model therefore focuses entirely on what we care about most:

> **How system conditions modify the probability that the event ends.**


## Selecting the variables

My first challenge was to decide which variables could plausibly influence the duration of negative price events in day-ahead markets. I chose to rely exclusively on data available through the ENTSO-E API. Because day-ahead prices are determined in the auction held the day before delivery, only information available at that time can be used. In practice, the main variables accessible through ENTSO-E are:

- forecasted load  
- forecasted solar generation  
- forecasted wind generation  
- day-ahead prices  

From these data, it is possible to construct **forecasted residual load** for each country, as well as lagged price variables (for example the minimum and median price observed during the previous auction). Residual load is used here as a proxy for **renewable penetration**, since it captures the balance between demand and variable renewable generation.

To describe the shape of renewable penetration throughout the day, I created several derived indicators with the objective of capturing the shape of renewable production:

- median residual load during peak hours  
- minimum residual load during peak hours  
- maximum residual load during peak hours  
- residual load at 10:00  
- residual load at 15:00  
- mean residual load during off-peak hours  

In addition, I included several calendar variables to capture systematic patterns in electricity demand and generation:

- a **weekend indicator**
- a **weekday indicator**
- a **monthly seasonal component**, represented using sine and cosine transformations.

Considering the fact that I want to include residual load for neighboring countries, I already reach a first conclusion :

> **I have too much variables and must find a way to select the most descriptive**

An old reflex led me to LASSO. When fitting a model, LASSO adds a small penalty to the estimation process. Instead of maximizing the likelihood alone, the model maximizes:

$$
\text{Likelihood} - \lambda \sum |\beta|
$$

Where:

- **$$\lambda$$** is a penalty parameter.

This penalty forces some coefficients to **shrink toward zero**. If the penalty is strong enough, some variables disappear entirely. So LASSO acts like a **feature filter** which make useless variables vanish and keep only the important ones. The larger the penalty, the simpler will be the model. To choose the optimal value, we test a **grid of penalties** and select the one that produces the best predictive performance.

---

## Evaluating model performance

Two metrics are particularly useful in survival analysis. Both are directly included in the lifelines Python package which is the one I have used.

### Concordance index

The **concordance index** measures how well the model ranks durations.It answers the following question:

> If two events have different durations, does the model correctly predict which one lasts longer?

The value ranges from 0.5 (a random guess) to 1. Electricity markets are noisy systems, so values around **0.7–0.8** can be already considered good.

---

### Partial AIC

Another useful metric is the **partial Akaike Information Criterion (AIC)**. AIC balances model fit and model complexity. Lower values indicate a better trade-off.

This helps avoid models that fit the data well but rely on too many variables. **AIC rewards models that explain the data well while remaining as simple as possible**.


## Summarize the procedure

The modelling process typically follows these steps:

1. Construct candidate explanatory variables  
2. Apply **LASSO regularization** to remove redundant features  
3. Select the optimal penalty using **concordance** and **partial AIC** 
4. Estimate the **final Cox model**  
5. Interpret **hazard ratios**

The goal is not simply to predict duration, but to **identify the structural drivers of negative price persistence**.


## Germany: the engine of negative price regimes

The final model for Germany is relatively parsimonious and highlights a clear structure behind negative price persistence.

![model_germany](images/cox model/germany_final_cox.png)


The dominant driver is the German residual load during peak hours. The estimated hazard ratio is around 1.79, meaning that a one-unit increase in residual load increases the probability that a negative price spell ends by nearly 80%. In practical terms, when demand is stronger relative to renewable generation, the system absorbs excess supply more quickly and negative prices disappear faster. It's consistent with what we had observed in the previous article [LINK] :

![de_residual_germany](images/cox model/germany_de_residual_load.png)

Unlike other neighbours' residual load which as not been selected in the procedure, Belgian residual load also appears as a significant, though smaller, contributor. With a hazard ratio of about 1.21, it suggests that neighbouring systems help absorb part of the German oversupply. This confirms the role of cross-border exchanges in shortening negative price events, although the effect remains secondary for Germany compared to domestic conditions.

Calendar effects are captured through a seasonal component using sine and cosine transformations of the month. Both coefficients are significant and indicate that negative price persistence varies throughout the year. In particular, certain periods — typically associated with high renewable output and moderate demand — are more prone to longer negative price spells.

By contrast, the weekend effect is not significant. Once system balance and seasonality are accounted for, there is no clear difference between weekday and weekend dynamics in Germany. This is consistent with the scale and structure of the German system, where industrial demand and cross-border flows tend to smooth intra-week variations.

PLOT BY MONTH

Overall, the model delivers a coherent economic message: negative price durations in Germany are primarily driven by domestic system conditions, with regional markets playing a supporting role. The concordance of 0.68 indicates a reasonable predictive power, which is typical for electricity market applications where many short-term operational factors remain unobserved.

## Belgium: a market shaped by its neighbours

The Belgian model reveals a different structure, where negative price dynamics are largely driven by regional interactions rather than purely domestic conditions.

![model_belgium](images/cox model/belgium_final_cox.png)

German residual load again appears as the dominant factor, with a hazard ratio of about 1.63. This confirms that the persistence of negative prices in Belgium is strongly influenced by the German system: when German residual load increases, excess supply is absorbed more quickly across the region, and Belgian negative price spells tend to end sooner.

![de_residual_belgium](images/cox model/belgium_km_de_residual.png)

Belgian residual load also plays a significant role, with a hazard ratio close to 1.47. This indicates that local demand conditions contribute to resolving negative price events, although their impact remains secondary compared to the German system.

Interestingly, Dutch residual load has a negative effect (hazard ratio around 0.79), meaning that certain regional configurations tend to prolong negative price spells. This likely reflects situations where oversupply is shared across interconnected markets, reducing the ability of neighboring systems to absorb excess generation. 

The model also highlights what does *not* matter. Calendar effects such as weekday/weekend structure do not appear in the final specification, as they are absorbed by the stratification. More importantly, price-based variables (such as lagged day-ahead prices) and alternative representations of residual load (peak max, off-peak averages, or specific hourly values) are not selected by the model. This suggests that the duration of negative price events is primarily driven by **structural system balance**, rather than short-term price signals or detailed intra-day patterns. We can also note that the french residual load has not been selected either.

Overall, the Belgian model conveys a clear message: negative price persistence is largely imported from the region, with Germany acting as the main driver, while local conditions and broader regional configurations modulate the duration of these events. The concordance of 0.74 indicates a strong predictive performance, reinforcing the relevance of cross-border system dynamics in explaining Belgian price behavior.

## France: a partially insulated system

The French model sits somewhere between the German and Belgian cases, reflecting a system that is both influenced by regional dynamics and shaped by its own structural characteristics.

![model_france](images/cox model/france_final_cox.png)

Unlike Germany, domestic residual load does not play a significant role: while it has been selected by the procedure (concordance decreased significantly without it), the coefficient associated with French residual load is small and not statistically significant. This suggests that, in France, negative price persistence may not  be primarily driven by renewable generation. That's a very strong assumption which may also be explained by the correlation of this residual load variable with other selected variables such as "weekend" and "lagged-prices". 

Instead, cross-border effects dominate. Both German and Belgian residual loads are highly significant, with hazard ratios of around 1.41 and 1.45 respectively. This indicates that negative price spells in France tend to end faster when neighboring systems are better able to absorb excess supply. In other words, France behaves as part of a broader regional system, where external conditions strongly influence local price dynamics.

An interesting feature of the French model is the role of lagged prices. The minimum peak price from the previous auction has a significant positive effect (hazard ratio around 1.27), suggesting that recent price signals contain useful information about current system conditions. This is the only case among the models where price-based variables are retained, indicating a stronger short-term memory effect in the French market.

The weekend variable is also significant, with a hazard ratio of approximately 0.75. This implies that negative price spells tend to last longer during weekends, likely reflecting lower demand levels and reduced system flexibility. This contrasts with Germany, where weekend effects were negligible.

As in the other models, several variables were not selected. Alternative representations of residual load (such as hourly values or off-peak averages) do not provide additional explanatory power, and seasonal components are not retained in the final specification. This suggests that, for France, the key drivers of negative price duration are a combination of regional system balance and short-term market signals, rather than detailed intra-day patterns or long-term seasonal effects.

Overall, the model highlights a hybrid structure: France is neither fully driven by its own system conditions nor entirely dependent on external markets, but rather sits at the intersection of regional dynamics and local market characteristics. The concordance of 0.74 indicates a strong predictive performance, comparable to the Belgian case.

## Spain: a different negative price dynamic

The Spanish model is structurally different from the others and clearly less informative, reflecting a market where negative price dynamics are less frequent and harder to explain with the available variables.

![model_spain](images/cox model/spain_final_cox.png)

The only variable that emerges as statistically significant is the Spanish residual load during peak hours, with a hazard ratio of around 1.26. This indicates that higher residual load — meaning tighter system conditions — tends to shorten negative price events. This is consistent with intuition: when demand net of renewables increases, the system rebalances more quickly and prices recover.

![model_spain](images/cox model/spain_km_es_residual_load.png)

However, beyond this core effect, the model struggles to identify strong drivers. Neither cross-border variables (such as French residual load), nor calendar effects (weekend), nor seasonal patterns (month sinus/cosinus) are statistically significant. This contrasts sharply with the German and Belgian cases, where both domestic and neighboring system conditions play a central role.

The relatively low concordance (0.61) confirms that the model has limited predictive power. In practical terms, this means that the ranking of event durations is only marginally better than random. This is not a modelling failure, but rather a reflection of the underlying system: negative prices in Spain are rarer over the considered period, less persistent, and likely driven by more complex or localized factors not captured in the dataset.

Overall, the Spanish case highlights the limits of the approach when applied to markets with fewer extreme events. The Cox framework remains valid, but the signal-to-noise ratio is lower, and the structural drivers of negative price persistence are less clearly identifiable with standard system variables.