---
layout: post
title: Note on Linear Optimisation problems
date: 2026-05-16
---

Let's use an electricity dispatch problem as an example. In our imaginary world, there are three power plant available : plant A has a cost of 2€ per MWh produced and a maximum capacity of 100MW and plant B has a cost of 5€ per MWh produced and a capacity of 300MW. Our objective is to minimise the production costs while ensuring the total production equal the demand.

This problem is called a linear problem because every relationship is proportionnal. For both plants, producing 100MW costs twice as much as producing 50MW. This sounds like a restriction : we can't include start costs for example because we'll break the proportionality. However, it's precisely what makes the problem solvable at scale for a good geometric reason.

This reason is that every constrain in a linear problem draws a straight line (in 2D) or a flat plane (in higher dimensions) accross the space of possible decisions. it carves out a region of valid solutions : the feasible set which, because all boundaries are straight, always form a convex polygon. 

Let's take our dispatch problem again and try to visualise it geometrically :

First we draw the capacity constraints for plant A and B :
![Capacity constraints](images/lp_note/lp_step1_capacity.svg)

Second, we add the demand constraint to obtain the feasible region (here we accept overproduction then, unlike in the next sections, our demand constraint is an inequality : $$p_A + p_B \geq 200$$)
![Feasible region](images/lp_note/lp_step2_feasible.svg)

The feasible region is the green area. We have the following first critical property :

> **The optimum is always at a corner of this region.**

Indeed, an objective function has a direction of improvement "go this way and the cost decreases". as long as you are in the interior of the feasible region, you can always take a small step in that direction and stay feasible. So the interior is never optimal, you can always do better. When you hit an edge of the region, you're constraint on one side but can still slide along the edge. as long as the edge is not perpendicular to the direction of improvement, sliding along in the correct direction keeps reducing the cost. You stop only when you hit a corner, because every direction that would further reduce the cost takes you outside the feasible region. You've find the optimum (or at least a candidate).

Using the cost decreasing direction, the cost is evaluated at several corners of the feasible region, finding that point C1 is the optimum (with cost = 700€).
![Optimum](images/lp_note/lp_step3_optimum.svg)


It's more or less how the Simplex algorithm, used by a lot of solvers, works. At each step, it's not searching blindy : it knows exactly which direction to go and it follows this direction along each edge until it hits the next corner, then reassesses.

## The primal problem

The problem we introduced can be translated in a mathematical format. Each power plant has a maximum capacity $$PMAX_A = 100MW$$ and $$PMAX_B = 300MW$$ and their production $$p_A$$ and $$p_B$$ must remain lower than these capacities (and positive). We then have two first constraints: 

$$0 \leq p_A \leq 100$$

$$0 \leq p_B \leq 300$$

producing one MWh has a cost $$c_A = 2€/MWh$$ using plant A and $$c_B = 5€/MWh$$ using plant B. We want to minimise the total cost, that's the **objective function**:

$$\min_{p_A, p_B} \quad 2p_A + 5p_B$$

Finally, the goal of the dispatch system is to ensure production meets demand (exactly, unlike in our visualisation before where production could be larger than demand), then we must constraint equality between production and demand $$D$$. Let's say the demand at some point is 200MWh : 

$$p_A + p_B = 200$$

the primal problem can be summarised as 

$$\min_{p_A, p_B} \quad 2p_A + 5p_B$$

$$\text{s.t.} \quad p_A + p_B = 200 \quad [\lambda]$$

$$\quad 0 \leq p_A \leq 100 \quad [\mu_A]$$

$$\quad 0 \leq p_B \leq 300 \quad [\mu_B]$$



## The Lagrangian

We can now introduce the lagrangian which is basically a trick to get rid of the wall caused by the constraints. Instead of saying "you cannot exceed 100MW", you say "you can exceed 100MW, but every MW above 100 costs you an extra $$mu$$ euros". If $$mu$$ is small, ou're happe to violate the constraint, when it's large you are afraid to do it. 

$$\mathcal{L} = \underbrace{2p_A + 5p_B}_{\text{original cost}} + \underbrace{\mu_A(p_A - 100)}_{\text{penalty for exceeding A's capacity}} + \underbrace{\mu_B(p_B - 300)}_{\text{penalty for exceeding B's capacity}} - \underbrace{\lambda(p_A + p_B - 200)}_{\text{penalty for missing demand}}$$

Note something very important : the lagragian includes the original and other components which are all negative (the two penalty for capacity constraints because $$0 \leq p_A \leq 100$$ and $$0 \leq p_B \leq 300$$) or zero (the penalty for missing demand because $$p_A + p_B = 200$$)

> The Lagrangian is always less than or equal to the true primal cost. Then minimising L over $$p_A$$ and $$p_B$$ gives you a number which is always below the true optimal cost or in other words : a lower bound.

We can rearrange the Lagrangian :

$$\mathcal{L} = \underbrace{(2 - \lambda + \mu_A)}_{\text{coefficient of } p_A} p_A + \underbrace{(5 - \lambda + \mu_B)}_{\text{coefficient of } p_B} p_B + 200\lambda - 100\mu_A - 300\mu_B$$

We note $g(\lambda, \mu_A, \mu_B) = \min_{p_A, p_B \geq 0} \mathcal{L}(p_A, p_B, \lambda, \mu_A, \mu_B)$

The minimum over $p_A$ and $p_B$ is:

- $-\infty$ if $(2 - \lambda + \mu_A) < 0$ (you'd push $p_A$ to $+\infty$)
- $-\infty$ if $(5 - \lambda + \mu_B) < 0$ (same reason)
- $200\lambda - 100\mu_A - 300\mu_B$ if $(2 - \lambda + \mu_A) \geq 0$ and $(5 - \lambda + \mu_B) \geq 0$

So g is only useful in the third case when both constraints over $$mu_A$$ and $$mu_B$$ are satisfied.

## The dual problem

We know that g() is a lower bound of the primal and we would like to find the highest possible lower-bound. That's when the dual problem emerges :

$$\max_{\lambda, \mu_A, \mu_B} \quad 200\lambda - 100\mu_A - 300\mu_B$$

$$\text{s.t.} \quad \lambda - \mu_A \leq 2 \quad \text{(plant A)}$$

$$\quad \lambda - \mu_B \leq 5 \quad \text{(plant B)}$$

$$\quad \mu_A, \mu_B \geq 0$$

Economically, the dual problem is asking : **find the prices that maximise the total value of the system's resources, subject to the constraint that no plan is over rewarded.** The variable are :
- $$\lambda$$ the electricity price
- $$\mu_A$$ and $$\mu_B$$ the scarcity values of each plant's capacity (the extra value an additionnal MW of capacity would bring to the system).

The great proporty of linear optimisation is **strong duality**.

> Strong duality means that when they are linear problem, the primal and the dual problems give exactly the same number.

$$\underbrace{2 \times 100 + 5 \times 100}_{\text{primal: total cost}} = \underbrace{200 \times 5 - 100 \times 3 - 300 \times 0}_{\text{dual: total value}} = 700 \text{ €/h}$$

This equality is not a coincidence. It says that in a competitive market, the minimum cost of producing electricity equals the total revenue generators earn sellong at the market price, minus the scarcity paid to capacity owners.

| Dual variable | Value | Meaning |
|---|---|---|
| $\lambda$ | $5$ €/MWh | Plant B sets the price — it's the marginal unit |
| $\mu_A$ | $3$ €/MWh | Plant A earns 3 €/MWh above its cost because it's capacity-constrained |
| $\mu_B$ | $0$ | Plant B has spare capacity — it's not scarce |

Plant A produces at 2€/MWh but sells at 5€/MWh. the difference (3€/MWh) is its infra-marginal rent. it exists not because plant A is doing anything special but because its capacity is scarce. If you boult more of plant A, the rent would shrink. if you built enough to fully replace plant B, the rent would disappear and the price would fall to 2€/MWh.

This is the economic mechanism behind the merit order effect of renewables for example : adding zero-cost solar capacity is equivalent to adding more cheap plant. It pushes more expensive plants off the margin, destroys their role as price setter and collapses both the price and the infra-marginal rents of all other generators simultneously. 

## The KKT conditions

We now have all the pieces : the primal dispatch problem, the dual price system, the Lagrangian that connects them. The KKT conditions are the three rules that any optimal solution must satisfy simultaneously. They are properties that emerge automatically at the optimum, not additional constraints.


### Condition 1 — Stationarity : the price is pinned by the marginal plant

At the optimum, the Lagrangian cannot be improved by nudging any production variable. Mathematically this means the derivative of the Lagrangian with respect to each $p_g$ is zero. For plant A this gives :

$$\lambda = c_A + \mu_A$$

For plant B :

$$\lambda = c_B + \mu_B$$

That means : the electricity price equals the marginal cost of each plant plus its scarcity rent.

For plant B, which is not capacity-constrained, $\mu_B = 0$ and the condition becomes $\lambda = c_B = 5$. The price is exactly plant B's marginal cost, and that makes sense because plant B is the marginal unit (the last one called which then sets the price).

For plant A, which is at full capacity, $\mu_A = 3$ and the condition gives $\lambda = 2 + 3 = 5$. Plant A's cost plus its scarcity rent equals the market price. The scarcity rent is exactly the gap between what plant A costs and what the market pays : it's the infra-marginal rent that plant A earns by being cheaper than the price-setter.

This condition is the mathematical statement of the merit order : the price is always set by the marginal unit, and every cheaper unit earns a rent equal to the difference between the price and its own cost.


### Condition 2 — Complementary slackness : scarcity and spare capacity cannot coexist

For each capacity constraint, the following must hold :

$$\mu_g \cdot (\overline{P}_g - p_g) = 0$$

This says : either the plant is at full capacity ($\overline{P}_g - p_g = 0$) or its scarcity rent is zero ($\mu_g = 0$). Both cannot be non-zero simultaneously.

The economic logic is immediate. If a plant has spare capacity (is producing below its maximum) then one more MW from that plant costs nothing extra to unlock. Its capacity is not the binding constraint. It has no scarcity value, so $\mu_g = 0$.

If a plant has a positive scarcity rent (its capacity is genuinely valuable) then it must be running at its limit. If it weren't, you could produce more from it and save money, which contradicts optimality.

In our example :

- Plant A : running at 100 MW $= \overline{P}_A$, so $\mu_A = 3 > 0$ ✓
- Plant B : running at 100 MW $< \overline{P}_B = 300$, so $\mu_B = 0$ ✓

This condition is what connects the primal dispatch to the dual prices. It tells you exactly which constraints are "active" and which are slack. An active constraint has a positive dual variable. A slack constraint has a zero dual variable. This is how you read the economics of the whole system at a glance.


### Condition 3 — Primal feasibility : the solution must be physically valid

The optimal solution must respect all the original constraints :

$$p_A + p_B = 200 \quad \text{(demand met)}$$

$$0 \leq p_A \leq 100, \quad 0 \leq p_B \leq 300 \quad \text{(capacity limits)}$$

This sounds obvious but it matters formally because the Lagrangian approach technically allows infeasible solutions during the search process. The KKT conditions require that at the optimum, you are back inside the feasible set.


### The three conditions together reproduce the merit order

Primal feasibility says demand is met. Stationarity says the price is set by the marginal unit. Complementary slackness says cheap units run at full capacity and earn a scarcity rent and expensive units stay idle and earn nothing. Only the marginal unit sits in between, producing at whatever level is needed to balance supply and demand, with zero scarcity rent because it has spare capacity.

This is precisely a simplified merit order which appears as the unique solution that satisfies all three KKT conditions simultaneously. Any other dispatch would violate at least one of them.


### How solvers use these conditions in practice

The KKT conditions play a double role in practice.

During the solve, they serve as the **stopping criterion**. At each iteration, the solver checks whether the current solution satisfies the KKT conditions to within a numerical tolerance (typically $10^{-7}$). As long as any condition is violated, the algorithm keeps iterating. The moment all three are satisfied within tolerance, the solver stops and declares the solution optimal. This is why you see parameters like `primal_feasibility_tolerance` and `dual_feasibility_tolerance` in HiGHS.

After the solve, they serve as a **validation tool**. When your model produces a surprising price the KKT conditions give you a systematic diagnostic protocol. You find the plant satisfying $\lambda = c_g$ (the marginal unit), verify that all cheaper plants satisfy $\mu_g > 0$ and are running at capacity, and verify that all more expensive plants satisfy $p_g = 0$. If any of these checks fail, there is a bug in your formulation. The KKT conditions transform a black-box output into an auditable economic narrative.


## When the framework breaks : adding integer variables

Everything we have built so far relies on one assumption : all decision variables are continuous. 
Production can be set to any value between 0 and $\overline{P}_g$. This is what makes the problem 
linear, the feasible set convex, and the dual prices meaningful.

This assumption breaks the moment you introduce non-linearities such as **startup costs**. A startup cost is only paid if a plant actually starts then it requires a variable that captures the on/off decision : $u_g \in \{0, 1\}$. One binary variable is enough to destroy the entire LP structure.

Indeed, binary variables turn the feasible set from a convex polygon into a collection of discrete points. The Simplex has no edges to slide along. Strong duality no longer holds (the primal and dual optimal values are no longer guaranteed to be equal). The KKT conditions do not apply. 

The practical fix used in power system modelling is a two-step procedure. First, solve the MILP to 
find the optimal commitment — which plants are on or off at each hour. Then fix those binary 
decisions and re-solve the resulting LP, where all remaining variables are continuous. This restored LP is convex, its dual is well-defined, and its shadow prices are interpretable as market prices, conditional on the commitment found in step one.

The economic consequence of this two-step approach is subtle but important. Some plants that were 
committed in the MILP may find themselves operating at a loss at the LP market price : they were 
worth starting for system reasons, but the price doesn't cover their startup cost. In real markets, 
this could be resolved through **uplift payments** : out-of-market side payments that compensate committed units for losses they incur at the market price. The clean merit order world of the LP is an approximation.

