
I would like to start by giving you a little bit of context and the foundations of
this article.

I'm writing it while working on a broader topic: computing Cash-Flows at Risk for
a gas-fired power plant. I’ve defined a simple workflow to guide the modelling process:

![Workflow](images/regime switching model estimation/workflow.png)

I've already shared a [Linkedin post](https://www.linkedin.com/posts/tristanbeucher_co-simulating-gas-and-co2-scenarios-activity-7391742121973694465-37SA?utm_source=share&utm_medium=member_desktop&rcm=ACoAACCU3acBQq8Y387LjTXIf5N-KEwhLCNwVZU) about the co-simulation of gas and CO2 scenarios. I'm
now focusing on generating power prices based on fundamental variables such as gas and CO2
prices and weather. My first idea was to use an Machine Learning model to derive prices 
from these inputs. Thanks to the scenarios I've created to simulate the level of these
inputs for future periods, I'll be able to feed my model and have a range of power prices.
My concern is that standard Machine Learning models often struggle to capture extreme events
 which are quite frequent on power markets.

![ExtremePrices](images/regime switching model estimation/daily prices.png)

In a [previous article](simulating-electricity-spot-prices-with-jump-diffusion-model), I described how we can model jumps using a Poisson process,
but I decided not to use the same method here (it wouldn't have been fun).
That's why I've chosen a different approach called Regime Switching (RS). The intuitive
idea behind RS is the existence of different states of the market (for example: a “crisis
state” vs a “normal state”), and the fact that the market switches from one state to
another following a Markov chain.

You'll notice that the section about the estimation of the Hidden Markov Model behind the
regime switching approach is more technical than the rest of the article. I found this section
important because it explains how a complex problem like the one we'll go through can be
managed by applying the correct optimisation methods. However, skipping this section will not
hurt your ability to understand the overall message of this article.

Now that the context is set, let's dive into the process of setting up a regime switching model
for power prices.

---


## 1. Managing the seasonality

We work with daily power prices, obtained by averaging hourly (or quarter-hourly) observations 
over each day. In this article, I use French day-ahead prices from January 2023 to October 2025.

The seasonality of power prices has been well documented and can be observed in our dataset
through the autocorrelation plot below which shows pronounced peaks at multiples of 7
(a signature of a weekly pattern).

![ACF](images/regime switching model estimation/acf prices.png)

To estimate our regime-switching model, we want to remove this seasonality and work with 
a de-seasonalised series. Following the classical decomposition inspired by the methodology
of Lucia & Schwarz (2002), we express the (log) spot price as:

$$
\log(\text{Price}_t) = S_t + X_t
$$

where  
- $$ S_t $$ is a deterministic seasonal component, and  
- $$ X_t $$ is a stochastic component (the part we will model with the regime-switching process).

Using log-prices avoids negative values and stabilizes variance, making the stochastic component 
$$ X_t $$ closer to Gaussian and easier to model with regime switching.

We do not want $$ S_t $$ to include any fundamental variable, it should only represent the 
calendarian evolution of the power price. That's why we can modelize it like :

$$
S_t = \sum_{d=1}^{7} a_d \cdot \text{DOW}_{t,d}
\;+\;
\sum_{m=1}^{12} b_m \cdot \text{Month}_{t,m}
$$

I've also tested trigonometric seasonality but it tends to smooth transitions, whereas 
electricity markets exhibit sharp discontinuities between weekdays and weekends. Dummy 
variables capture these discontinuities better.

When plotting $$ S_t $$, we clearly observe seasonal patterns consistent with the weekly and annual cycles.

![SeasonBaseline](images/regime switching model estimation/season baseline.png)


Subtracting this seasonal component to the log-prices gives us the de-seasonalized series $$ X_t $$.
The ACF of $$ X_t $$ shows that most of the seasonality has been removed : 

![ACFdeseasonalized](images/regime switching model estimation/acf prices deseasonalized.png)

Below, the left panel shows the distribution of raw log-prices, which is heavily skewed because of strong weekly and yearly seasonal patterns.
After removing seasonality, the right panel shows a much more symmetric and centred distribution, with extreme values now clearly identifiable as genuine market shocks rather than calendar effects.

![DistributionComparison](images/regime switching model estimation/distributions.png)

This de-seasonalised series is therefore a more suitable input for estimating regime-switching dynamics.
---


## 2. Understanding how the Regime-Switching model works

As discussed in the introduction, the intuition behind Regime Switching is that we cannot
model the behaviour of power prices using a single stochastic process. The dynamics of prices
depend strongly on the state of the system. For example, we may assume that volatility
increases when the system enters a “crisis” mode.

For this reason, we define a small number of distinct regimes (in this article, we will
compare a 2-regime setup to a 3-regime setup). Each regime has its own mean, volatility,
and short-term dynamics — all wrapped inside an AR(1) model.


<div class="note" markdown="1">

#### 🧠 A Note on AR(1) models

An AR(1) model (“Auto-Regressive model of order 1”) is one of the simplest ways to describe
how a variable depends on its own past values. In an AR(1) process, today’s value is a
combination of:
- A long-term mean
- A fraction of yesterday’s deviation from that mean
- Random noise

Mathematically we have :

$$
X_t = \mu + \phi (X_{t-1} - \mu) + \sigma \varepsilon_t,
\qquad \varepsilon_t \sim \mathcal{N}(0,1)
$$

It can be read as : 

- If $$ |\phi| < 1 $$, the process **pulls back toward its mean** $$ \mu $$ over time  
  → this is **mean reversion**, essential in energy markets.

- If $$ \phi = 0 $$, there is **no memory** (pure noise).

- If $$ \phi $$ is close to 1, the process **keeps memory of past shocks**  
  → effects of shocks are persistent.

- The parameter $$ \sigma $$ controls the **volatility** of the innovations.

AR(1) makes the model simple, interpretable, and easy to estimate, while capturing the
essentials of electricity-price dynamics.

</div>

Now that we have defined how the price will behave within each state, we need to explain 
how it goes from one state to another.


### 2.1 Using an Hidden Markov Model

Let's remember first what is the Markov property.

<div class="note" markdown="1">

#### 🧠 A Note on Markov chains

A stochastic process $$ (S_t) $$ is said to satisfy the **Markov property** if the future 
depends **only on the present state**, not on the past. Formally:

$$
\mathbb{P}(S_{t+1} = j \mid S_t = i, S_{t-1}, S_{t-2}, \ldots ) 
= \mathbb{P}(S_{t+1} = j \mid S_t = i).
$$

In words:  
> *“Knowing where you are is enough to know where you are going next.”*

This property allows us to summarize the entire dynamics using a **transition matrix** 
containing the probabilities of switching from one state to another.

</div>


We start with an example of a "not-hidden" markov chain.
Suppose we categorize weather into three observable states:
- 1 = **Sunny**
- 2 = **Cloudy**
- 3 = **Rainy**

If we have 5 years of daily weather data, we can count transitions such as:
- how often "Sunny" is followed by "Sunny"
- how often "Sunny" is followed by "Cloudy"
- how often "Cloudy" is followed by "Rainy"
- etc.

Dividing the counts by row totals gives the empirical transition matrix $$ P $$:

$$
P = \begin{pmatrix}
0.70 & 0.20 & 0.10 \\
0.30 & 0.50 & 0.20 \\
0.15 & 0.25 & 0.60
\end{pmatrix}
$$

Here:
- a **Sunny** day is followed by another **Sunny** day 70% of the time  
- a **Rainy** day becomes **Cloudy** the next day 25% of the time  
- etc.

Because states are **directly observed**, inference is straightforward.

But in many financial and energy applications (including ours), the true state
of the system (e.g., “normal”, “stress”, “spike”) is **not observed** — we only see the
resulting prices.

This leads us to a **Hidden Markov Model (HMM)**, where the states are latent but the
prices provide noisy information about which state we are likely in.

In practice, building a regime-switching model means estimating many things at once:  
the behaviour of prices inside each regime (mean, mean reversion, volatility),  
the probabilities of jumping from one regime to another,  
and the hidden sequence of regimes over time.  

Because none of these quantities are directly observable, the model must infer them simultaneously.  
This creates a highly interdependent and time-consuming estimation problem:  
changing the dynamics inside one regime modifies the most likely regime sequence,  
which then modifies the transition probabilities,  
which then modifies the likelihood of all parameters… and so on.  

This is why we rely on numerical optimisation and algorithms like Hamilton’s filter : the 
following section describes that (and can be skipped if you prefer).

---


## 3. Estimating the Regime-Switching model


### 3.1 Maximizing the likelihood

To estimate our regime-switching model, we need a way to measure **how well a set of parameters explains the observed price series**.  
This is exactly what the *likelihood* does.

**Likelihood = “given my parameters, how probable is it that I observe this data?”**

If the model assigns high probability to the prices we actually observed, the parameters are good.  
If the model says these prices were very unlikely, the parameters are bad.

Because multiplying thousands of probabilities quickly leads to tiny numbers, we work instead with the **log-likelihood**, which turns products into sums and is much easier to optimise numerically.

In a regime-switching (Hidden Markov) model, the log-likelihood combines:
- the probability of being in each hidden regime at each date,
- the probability of observing the price given the regime’s AR(1) dynamics,
- the probability of switching from one regime to another according to the transition matrix.

Formally, let:

- $$ x_t $$ be the observed (de-seasonalised) log-price,
- $$ s_t \in \{1,\dots,K\} $$ the hidden regime at time $$ t $$,
- $$ f(x_t \mid s_t, \theta) $$ the AR(1) density in regime $$ s_t $$,
- $$ P_{ij} = \mathbb{P}(s_t = j \mid s_{t-1} = i) $$ the transition matrix.

For a *given* sequence of hidden states $$ s_1,\dots,s_T $$, the likelihood is:

$$
L(x_{1:T}, s_{1:T} \mid \theta)
   = \pi_{s_1}\, f(x_1 \mid s_1)
     \prod_{t=2}^{T} P_{s_{t-1}, s_t} \, f(x_t \mid s_t),
$$

and the **log-likelihood** is:

$$
\ell = 
\log \pi_{s_1} + \log f(x_1 \mid s_1)
+ \sum_{t=2}^{T}
    \big( \log P_{s_{t-1}, s_t}
       + \log f(x_t \mid s_t) \big).
$$

But we **do not observe** the true states $$ s_t $$.  
Therefore the log-likelihood of the HMM is the weighted sum over all possible state paths:

$$
\ell(\theta) =
\log \sum_{s_{1:T}}
L(x_{1:T}, s_{1:T} \mid \theta),
$$

which the Hamilton filter computes efficiently.



The goal of estimation is simple: **find the parameters $$ \theta $$ that maximise the log-likelihood**,  
i.e. the parameters under which the observed prices are the most “expected” by the model.

This is what the optimisation algorithm does: it searches across all possible regime dynamics and transition probabilities and keeps the configuration that gives the highest log-likelihood.


### 3.2 The Hamilton Filter: estimating hidden regimes

When regimes are not directly observable, we need to infer at each date $$ t $$:

$$
P(s_t = j \mid x_{1:t})
$$

where:
- $$ s_t $$ is the hidden regime (e.g. calm, volatile, stressed),
- $$ x_t $$ is the observed de-seasonalised log-price.

Because the regime is hidden and uncertainty must be updated every day using the new price, a simple counting approach is impossible.  
The **Hamilton filter** (Hamilton, 1989) provides a recursive way to compute these probabilities and the associated log-likelihood.


#### 3.2.1 Why do we need it?

If regimes were visible, we could:
- classify each day into a regime,
- count transitions (to estimate the transition matrix),
- estimate AR(1) parameters per regime.

But in a Hidden Markov Model (HMM):
- we never observe $$ s_t $$,
- regime inference depends on past uncertainty,
- uncertainty evolves with each new observation.

Thus, we need a principled way to keep track of:
1. the probability of being in each regime today,
2. how these probabilities propagate through the Markov chain,
3. how today’s price updates them using Bayes’ rule.

This is exactly what the Hamilton filter does.





#### 3.2.2 Hamilton Filter — Algorithm with example

Assume:
- 2 regimes,
- transition matrix

$$
P =
\begin{pmatrix}
0.9 & 0.1 \\
0.2 & 0.8
\end{pmatrix},
$$

- regime-specific AR(1) densities $$ f_1(x_t) $$ and $$ f_2(x_t) $$.

We denote:
- $$ \alpha_{t|t} = P(s_t \mid x_{1:t}) $$ = filtered probability,
- $$ \alpha_{t|t-1} = P(s_t \mid x_{1:t-1}) $$ = predicted probability.


#### **Step 1️⃣ — Initialise regime probabilities**

Choose initial probabilities, typically:

$$
\alpha_{0|0} = (0.5,\; 0.5).
$$

*Example:*  
We start with no reason to believe the system is more likely in either regime.


#### **Step 2️⃣ — Prediction step (Markov propagation)**

$$
\alpha_{t|t-1}(j)
=
\sum_{i=1}^2 
\alpha_{t-1|t-1}(i)\, P_{ij}.
$$

*Example:*  
Suppose yesterday we had:

$$
\alpha_{t-1|t-1} = (0.7,\; 0.3).
$$

Then:

$$
\alpha_{t|t-1}(1)
= 0.7 \cdot 0.9 + 0.3 \cdot 0.2
= 0.69,
$$

$$
\alpha_{t|t-1}(2)
= 0.7 \cdot 0.1 + 0.3 \cdot 0.8
= 0.31.
$$


#### **Step 3️⃣ — Filtering step (Bayesian update with today’s price)**

When we observe \(x_t\), we update:

$$
\alpha_{t|t}(j)
=
\frac{
f_j(x_t)\, \alpha_{t|t-1}(j)
}{
\sum_{k=1}^2 f_k(x_t)\, \alpha_{t|t-1}(k)
}.
$$

*Example:*  
Suppose today's price is unusually high.  
The regime-specific densities evaluate to:

$$
f_1(x_t) = 0.01,\qquad
f_2(x_t) = 0.20.
$$

Weighted likelihoods:

$$
\tilde{\alpha}_1 = 0.01 \times 0.69 = 0.0069,
$$
$$
\tilde{\alpha}_2 = 0.20 \times 0.31 = 0.062.
$$

Normalisation:

$$
\alpha_{t|t}
=
\left(
\frac{0.0069}{0.0689},\;
\frac{0.062}{0.0689}
\right)
=
(0.10,\; 0.90).
$$

After observing the spike, regime 2 becomes far more likely.


#### **Step 4️⃣ — Update the log-likelihood contribution**

Each date contributes:

$$
L_t = 
\sum_{j=1}^2 
f_j(x_t)\, \alpha_{t|t-1}(j).
$$

The total log-likelihood is:

$$
\log \mathcal{L}
=
\sum_{t=1}^T 
\log L_t.
$$

*Example:*

$$
L_t = 0.0069 + 0.062 = 0.0689,
\qquad
\log L_t = -2.6768.
$$

The optimiser adjusts:
- regime means \(\mu_r\),
- AR(1) parameters \(\phi_r, \sigma_r\),
- transition probabilities \(P_{ij}\),

to maximise this log-likelihood.


#### 3.2.3 Summary

The Hamilton filter does three things at once:

1. **Propagates uncertainty** using the Markov chain.  
2. **Updates regime probabilities** using today’s price (Bayes).  
3. **Accumulates log-likelihood** for parameter estimation.

It is the engine that makes Hidden Markov Models estimable in practice.

### 3.3 Parameter estimation: maximisation procedure and smoothing

Once we know how to compute the **log-likelihood** of the model using the Hamilton filter,
the next step is simply:

$$
\widehat{\theta}
=
\arg\max_{\theta}
\log \mathcal{L}(\theta),
$$

where $$ \theta $$ groups all parameters:

- regime means $$ \mu_r $$  
- AR(1) parameters $$ \phi_r, \sigma_r $$  
- transition probabilities $$ P_{ij} $$

Because the log-likelihood is not linear and has no closed-form solution,
we must rely on **numerical optimisation**.

The idea is simple:

1. Choose a trial parameter vector $$ \theta $$.  
2. Run the Hamilton filter to compute the log-likelihood.  
3. Change $$ \theta $$ slightly.  
4. Keep the version that gives a **higher** log-likelihood.  
5. Repeat until improvements become negligible.

This is no different from fitting a neural network, except the objective is the log-likelihood
instead of a loss function.

Even though the internal math is complicated, the procedure is always the same:
**the optimiser tries different parameter values until it finds the ones that make the observed
prices most “expected” under the model.**

---


### Reference sources
- Hamilton (1989), *New approach to economic time series with regime switching*  
- Kim & Nelson (1999), *State-Space Models with Regime Switching*  
- Perlin (2015), *HMM in Finance*