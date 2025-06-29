---
layout: post
title: Financial Markets & Instruments — Introduction
permalink: /financial-markets-intro/chapter2-interest-rates/
---


# What is an interest rate

Let's start simple 

> An interest rate is the price of money over time. It’s what you pay when you borrow money, or what you earn when you lend or deposit it.

Interest rates are expressed as a percentage of the principal amount, usually over one year. For example, if you borrow 1,000€ at a 5% annual interest rate, you’ll pay 50€ in interest over one year.


## Why do interest rates vary ?

**Not everyone gets the same rate**. The reason is simple: not everyone represents the same level of risk.

When you lend money, there's always a chance the borrower won’t repay. That’s called **credit risk**. The higher the risk of default, the more compensation the lender will require. In other words, the higher the credit risk, the higher the interest rate.

A government or a large stable company might borrow at a low rate. A riskier borrower, like a startup or an emerging market, will have to pay more to access funds.

## Interest rates across markets

You will encounter the term "basis point". In financial markets, interest rates often change in small increments. Instead of saying "0.01 percent", we use the term **basis point**. One basis point equals 0.01% per annum.

For instance, if a rate moves from 3.00% to 3.25%, that’s a change of 25 basis points.

Interest rates are used in all types of financial contracts, and quoted in various currencies. Here are a few common examples:
  - Interbank rates: the rates at which banks lend to each other, such as EURIBOR or SOFR.
  - Government rates: interest rates on public debt, like U.S. Treasury yields or French OATs.
  - Deposit rates: the rate banks offer for holding your money.

Each of these rates reflects different levels of credit risk, liquidity, and market conditions.


# Why do interest rates exist ?

Interest rates exist for one key reason: 

> money today is worth more than the same amount in the future.

This is called **the time value of money**. It’s a core idea in finance: a euro received today can be invested, used, or protected against uncertainty — which makes it more valuable than waiting for the same euro in a year.

When someone lends money, they give up the ability to use it now. Interest is the compensation for that sacrifice. This compensation reflects four key things:

1. **Time**: Lending money ties up resources.  
2. **Inflation**: Over time, purchasing power tends to fall. 100€ today might only buy 95€ worth of goods in a year.  
3. **Credit risk**: There's always a chance the borrower won’t pay back.  
4. **Opportunity cost**: The lender could have used the money elsewhere for a better return.  

That’s why interest rates are the foundation of nearly all financial decisions, from valuing an investment to pricing a bond or comparing loan offers.

## Simple Vs Compound Interest

There are two main ways to calculate interest on an investment or loan: **simple interest** and **compound interest**.

### Simple Interest

Simple interest is calculated only on the initial principal. The amount of interest stays the same each period.

If you invest an amount \\(N\\) at a rate \\(R\\) over time \\(T\\), the **future value** is:

$$
FV = N \times (1 + R \times T)
$$

The **present value** of a future amount $V$ is:

$$
PV = \frac{V}{1 + R \times T}
$$

This approach is typically used for short durations (\\(T \leq 1\\) year), or when the agreement specifies no reinvestment of earnings..


### Compound Interest

Compound interest means you earn interest **on the interest already earned**, which leads to **exponential growth**.

This makes your investment grow faster, because each period the base you're earning interest on gets bigger.

Let’s break it down:

- In year 1, you earn interest on the original amount.
- In year 2, you earn interest **on the original amount plus the interest from year 1**.
- In year 3, you earn interest **on the original amount plus interest from years 1 and 2**.

This is why compound interest is sometimes called “interest on interest”.


#### Discrete Compounding

Interest is added at regular intervals: yearly, quarterly, monthly, etc. The future value if the interest is compounded once per year:

$$
FV = N \times (1 + R)^T
$$

The present value of the future amount (\\V\\) is:

$$
PV = \frac{V}{(1 + R)^T}
$$

Where:  
- (\\N\\) = principal  
- (\\R\\) = annual rate  
- (\\T\\) = number of years

If compounded (\\n\\) times per year:

$$
FV = N \times \left(1 + \frac{R}{n} \right)^{nT}
$$

$$
PV = \frac{V}{\left(1 + \frac{R}{n} \right)^{nT}}
$$

The more frequently the interest is compounded, the more total interest you earn — but the effect becomes smaller as (\\n\\) increases.

**Example**:  
Let’s say you invest 1,000€ at 5% per year for 1 year.

- Compounded annually:  
  \\(FV = 1000 \times (1 + 0.05)^1 = 1050€\\)

- Compounded quarterly:  
  \\(FV = 1000 \times \left(1 + \frac{0.05}{4}\right)^4 ≈ 1050.95€\\)

- Compounded daily:  
  \\(FV ≈ 1051.27€\\)

You earn slightly more as compounding becomes more frequent, but there's a limit.

#### Continuous Compounding

This is a theoretical case where interest is added **at every instant**, rather than monthly or annually.

It assumes the investment is constantly growing — like compounding an infinite number of times per year.

The future value is calculated using the exponential function:

$$
FV = N \times e^{rT}
$$

The present value of a future amount \\(V\\) is:

$$
PV = V \times e^{-rT}
$$

Where:  
- \\(r\\) is the **continuously compounded interest rate**  
- \\(e\\) is Euler’s number (≈ 2.71828)

This model is widely used in mathematical finance (especially for options and bonds) because it simplifies many calculations.


### Relationship Between Discrete and Continuous Compounding

You can convert a discrete rate \\(R\\) to its continuous equivalent \\(r\\), and vice versa.

If interest is compounded \\(n\\) times per year:

$$
r = n \cdot \ln\left(1 + \frac{R}{n}\right)
$$

$$
R = n \cdot \left(e^{\frac{r}{n}} - 1\right)
$$

And as (\\n \to \infty\\):

$$
\left(1 + \frac{R}{n} \right)^n \to e^R
$$

This means that **discrete compounding converges to continuous compounding** as the compounding frequency increases.



## Nominal vs. Real Interest Rates

Interest rates can be expressed in **nominal** or **real** terms.

- The **nominal interest rate** is the rate you see quoted in the market. It's expressed in currency terms (like dollars or euros) and **does not account for inflation**.
- The **real interest rate** adjusts for inflation and reflects the actual increase in purchasing power.

For example:  
If your bank offers a 4% return and inflation is also 4%, your **real return is zero**. Your money grows, but everything you buy gets more expensive — so you’re not better off.

The relationship between nominal and real rates is often summarized by the **Fisher equation**:

$$
(1 + r_{\text{nominal}}) = (1 + r_{\text{real}}) \times (1 + i)
$$

Where:
- \\( r_{\text{nominal}} \\): nominal interest rate  
- \\( r_{\text{real}} \\): real interest rate  
- \\( i \\): expected inflation rate  

For small rates, a good approximation is:

$$
r_{\text{real}} \approx r_{\text{nominal}} - i
$$

Real interest rates matter because they determine the **actual return** you’re getting after accounting for inflation.


## Who Sets Interest Rates?

At the short end of the curve, **central banks** are in control. A central bank is a public institution that manages a country’s money and credit system. Its main job is to keep the economy stable by influencing interest rates, money supply, and inflation. In most countries, the central bank also acts as a bank for commercial banks and often for the government.

Here are the main functions of a central bank:

- **Set policy interest rates**: This is the rate at which the central bank lends to commercial banks, and it directly influences borrowing costs across the economy.
- **Control inflation**: By raising or lowering interest rates, central banks try to keep inflation within a target range (often around 2%).
- **Ensure financial stability**: Central banks monitor the banking system and act as a "lender of last resort" in times of crisis.
- **Manage currency and foreign reserves**: They influence exchange rates and may intervene in currency markets to maintain stability.
- **Issue money**: Central banks are responsible for printing and distributing the national currency.

These institutions like the **European Central Bank (ECB)** or the **Federal Reserve (Fed)** set short-term **policy rates** to guide the economy. These are the benchmark rates that affect:

- Bank loan and deposit rates  
- Treasury yields  
- Currency exchange rates

One of their most important tools is the **overnight rate**: the interest rate at which banks borrow from one another at the end of the day to meet central bank reserve requirements.

This rate is:
- A signal of **liquidity** in the banking system  
- A lever used in **monetary policy** to influence **inflation** and **employment**

By raising or lowering the policy rate, central banks try to manage the pace of economic activity.


## Market Interest Rates

Beyond short-term rates, **longer-term interest rates are set by the market**.

They reflect a mix of:

- **Inflation expectations**: higher expected inflation leads to higher rates  
- **Central bank guidance**: markets try to anticipate future policy decisions  
- **Credit risk**: risky borrowers must pay more  
- **Liquidity**: more liquid instruments typically have lower yields  
- **Maturity**: longer loans generally come with more uncertainty and demand higher returns

This explains why a 10-year bond often has a higher yield than a 1-year bond: investors need more compensation for locking up money for a longer period.

An important example is the **Treasury rate** — the interest rate paid on government debt issued in its own currency. Treasury yields are considered "risk-free" benchmarks because governments (in theory) cannot default on debt in their own currency.

Now that we've seen how central banks and the market influence interest rates, it's time to look at how rates evolve over time, across future periods. This brings us to two key concepts: **spot rates** and **forward rates**.


## Spot Rates and Forward Rates

To understand how interest rates behave over time, we need to distinguish two key concepts:

- **Spot rates**: interest rates that apply from **today** until a specific future date
- **Forward rates**: interest rates that apply **in the future**, over a specific time period

These two ideas are fundamental for building and interpreting the **yield curve** and for pricing many financial instruments.

### Spot Rates (Zero-Coupon Rates)

A **spot rate** is the interest rate you’d earn today on a **zero-coupon bond** maturing at a specific date in the future.

Because a zero-coupon bond only pays **one amount at maturity**, it gives a clean, direct way to measure the time value of money over a fixed horizon.

If the market price of a zero-coupon bond that pays 1 unit at time \\(t\\) is \\(B(0, t)\\), then the spot rate \\(R(0, t)\\) (with annual compounding) is:

$$
B(0, t) = \frac{1}{(1 + R(0, t))^t}
$$

This means: the price today of receiving 1€ in \\(t\\) years reflects the interest rate over that full period.

Under **continuous compounding**, the same idea becomes:

$$
B(0, t) = e^{-r(0, t) \cdot t}
$$

Where \\(r(0, t)\\)  is the continuously compounded spot rate.


### Forward Rates: Interest Rates Starting in the Future

A **forward rate** is the rate you lock in **today**, for a loan or investment that happens **in the future**.

It applies between two future dates:  
- Starting at time \\(t\\)
- Ending at time \\(T\\)  
with \\(T > t\\) 

This rate is **implied by today’s yield curve** — it tells us what the market expects interest rates to be in the future.

In simple terms:

> If you know the spot rates for 1 year and 2 years, you can compute the 1-year forward rate starting 1 year from now.

### Why Spot and Forward Rates Matter

- **Spot rates** are used to discount future cash flows.  
  Each cash flow gets discounted using its corresponding zero-coupon rate.
- **Forward rates** help us:
  - Understand **market expectations** of future interest rates
  - **Price forward contracts** or floating-rate instruments
  - Build a **forward rate curve** from the spot curve

Even though you can't always invest at a forward rate today, the **no-arbitrage principle** tells us that forward rates are **consistent with current bond prices and spot rates**.


### Relationship Between Spot and Forward Rates (Intuition Only)


Let’s assume you have:

- A 1-year spot rate: \\(R(0,1)\\)   
- A 2-year spot rate: \\(R(0,2)\\)  
- A 1-year forward rate starting in 1 year: \\(F(0,1,1)\\) 

You can invest for 2 years at a known spot rate or you can invest for 1 year, then reinvest at the 1-year forward rate starting next year Both strategies must result in the same value. Otherwise, you’d have an arbitrage opportunity (a guaranteed profit). This idea links forward rates to spot rates in a way that keeps the market consistent.

#### Discrete Compounding (Annual)

$$
(1 + R(0,2))^2 = (1 + R(0,1)) \times (1 + F(0,1,1))
$$

Solving for the forward rate:

$$
F(0,1,1) = \frac{(1 + R(0,2))^2}{(1 + R(0,1))} - 1
$$

#### Continuous Compounding

Let \\(r(0,1)\\)  and \\(r(0,2)\\)  be the continuously compounded spot rates.

Then the forward rate \\(f(0,1,1)\\)  is given by:

$$
f(0,1,1) = \frac{r(0,2) \cdot 2 - r(0,1) \cdot 1}{1}
= 2r(0,2) - r(0,1)
$$

This ensures that the compounded returns over the full period are consistent with no arbitrage.


These formulas can be extended to any pair of maturities \\(T_1 < T_2\\)  to find forward rates over arbitrary future periods.



### Instantaneous Forward Rate (Optional Intuition)

The **instantaneous forward rate** is a theoretical concept: it tells us the interest rate the market expects **at a specific future instant**.

It’s important in quantitative finance models (like those used for interest rate derivatives), but for now, just remember:

> It’s the slope of the zero-coupon curve at a given point — how steeply the curve is rising at that maturity.



## The Yield Curve

The **yield curve** is a graph that shows the interest rates (or yields) of fixed-income securities across different maturities from very short-term (like overnight or 1 month) to very long-term (like 30 or 50 years).It’s also known as the **term structure of interest rates**. This curve is a key tool in finance: it gives us a snapshot of how the market values time, risk, and expectations.


### Structure of the Yield Curve

The yield curve has two segments:

- **Money market segment**: short-term maturities from 1 day to 1 year. This part reflects interbank rates, short-term Treasury bills, and overnight lending.
- **Capital market segment**: longer maturities, from 1 year to 30–50 years. This part includes government bonds, corporate bonds, and interest rate swaps.

When we put the yields of all these instruments together across different maturities, we get the full shape of the yield curve.


### Common Shapes of the Yield Curve

The shape of the curve matters because it reflects how investors feel about future interest rates and economic conditions.

- **Normal yield curve**: upward sloping. Longer-term rates are higher than short-term rates. This suggests the economy is growing and inflation is expected to rise moderately.
  
- **Flat yield curve**: short and long-term rates are similar. This may signal a turning point : the market is uncertain about future growth.
  
- **Inverted yield curve**: short-term rates are higher than long-term rates. This is often seen as a warning sign of an upcoming recession.



### What Drives the Shape?

The shape of the yield curve comes from a mix of three effects:

1. **Translation**  
   Expectations of rising or falling short-term interest rates shift the whole curve up or down.

2. **Slope**  
   Investors demand a **liquidity premium** for longer-term investments. This premium grows quickly at first, then levels off.

3. **Curvature**  
   Differences in how yields behave across maturities (especially mid-term vs long-term) give the curve a convex shape. This effect is linked to **convexity**, a concept tied to bond pricing and interest rate sensitivity.


### Why the Yield Curve Matters

Understanding the yield curve is essential for:

- **Pricing bonds** and any security that pays cash flows in the future
- **Valuing interest rate derivatives**
- **Building forward rate curves** (what the market expects rates to be in the future)
- **Discounting future cash flows**

In practice, most bonds pay coupons multiple cash flows over time. That makes it harder to isolate the yield for a single maturity, because the bond price is influenced by several interest rates at once. However, we generally want to understand the **pure interest rate** that applies to each maturity without being distorted by coupon payments. This is where **zero-coupon bonds** come in.

A **zero-coupon bond** is a bond that pays **no intermediate interest (coupon)** (we'll discuss bonds in more details in the dedicated section). Instead, it’s sold at a discount and pays its full face value at maturity.

Hence, the price of a zero-coupon bond reflects exactly one cash flow and that makes it ideal for extracting the pure interest rate for that maturity. In other words, it gives us a clean, direct measure of how much investors are willing to pay today to receive 1€ in, say, 1 year, 2 years, or 10 years.

These spot rates form what we call the **zero-coupon yield curve** which tells us the purest form of interest rate per maturity, stripped of coupon effects.

Once we know the zero-coupon curve, we can derive:

- The **discount factor curve**: how much future cash flows are worth today  
- The **forward rate curve**: implied future interest rates  
- The **par yield curve**: yields on bonds priced at par value


### How Is the Yield Curve Built?

There are two main approaches:

1. **Direct method (Bootstrapping)**  
   Based on observed market prices of zero-coupon bonds.

2. **Indirect method (Curve fitting)**  
   Uses mathematical models (e.g. splines or Nelson-Siegel) to interpolate the curve from a range of market instruments.


#### 1. Direct Method: Bootstrapping

**Bootstrapping** is a step-by-step method used to derive the zero-coupon curve from market prices of bonds or swaps.

It works by using the prices of instruments that have known cash flows (typically government bonds or interest rate swaps) to extract the **discount factor** (or zero rate) corresponding to each maturity.


1. **Start with short-term zero-coupon bonds**:  
   For maturities up to 1 year, we can directly compute the discount factor and zero-coupon rate from the price of short-term instruments (like Treasury bills).

2. **Interpolate for short-term curve**:  
   Use **linear** or **cubic interpolation** to draw a smooth curve for maturities \\( T \leq 1 \\) year.

3. **Move to the next maturity range**:  
   Take a bond with the nearest maturity beyond 1 year (say, 18 months or 2 years). Use the earlier known discount factors to isolate the unknown one in a nonlinear pricing equation.

4. **Repeat** for each successive maturity (2Y–3Y, 3Y–4Y, etc.), solving each new discount factor in turn.

5. **Interpolate between calculated points**:  
   After each step, update the curve using interpolation to keep it continuous and usable at any maturity.


The most common interpolation methods are : 

- **Linear interpolation**: simple, straight-line segments between known points  
- **Cubic spline interpolation**: smoother and more realistic for interest rate curves, especially over longer maturities

Bootstrapping is widely used because it respects the actual market prices of traded instruments and builds the curve in a consistent, stepwise way.


#### 2. Indirect Method: Curve Fitting

The **curve fitting** method builds the yield curve by assuming a specific mathematical form (or model) and calibrating it to market data.

This method does not extract one discount factor at a time. Instead, it fits a **smooth functional form** (like a polynomial or exponential curve) to the entire set of observed market prices. Common models are :

- **Polynomial models**: use low-degree polynomials to fit the curve  
- **Spline methods**: fit separate curves to different segments and connect them smoothly  
- **Nelson–Siegel and Svensson models**: popular in finance for their flexibility and good behavior at long maturities

Curve fitting is useful when:

- Market data is noisy or sparse  
- You want a **smooth**, **continuous**, and **differentiable** curve for use in models or simulations  
- You're working with multiple types of instruments (bonds, swaps, etc.) at once


Now that we’ve explored how interest rates evolve over time and how the zero-coupon curve is built, it’s time to dive deeper into one of the most fundamental parts of the financial system: the bonds market.
