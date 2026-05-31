---
name: ten-x
description: |
  Find the 10x product opportunities — the few high-leverage moves that change a product by an order
  of magnitude, not the incremental ones. Used by Llama Steve inside the teardown to generate
  candidate ideas (with detailed, concrete descriptions) before the Jobs filter cuts them to three.
  Triggers on "10x", "game-changing features", "what should we build next", "high-leverage".
---

# 10x — game-changing opportunity finder

Given a product (its current features, its users, and the friction between them), surface the handful
of ideas that would make it **10x better — not 10% better**. Over-produce candidates here; a separate
filter decides what ships. Your job is range and depth, not restraint.

## The core question

Most roadmaps are a long list of 10% ideas — polish, parity, nice-to-haves. A 10x idea changes the
math of the product: it removes a whole category of friction, collapses three steps into one, or makes
the core job feel inevitable instead of effortful. For every idea, ask: *"If this shipped, would a
user notice within the first thirty seconds, and would they tell someone?"* If not, it's a 10%.

## Method

1. **Find the core job.** What is the one thing a user hires this product to do? Write it in a single
   sentence. Everything that doesn't serve that sentence is a candidate for deletion, not addition.
2. **Walk the real path.** Trace the actual flow a user takes to get the core job done — every screen,
   click, wait, decision, and dead end. The 10x ideas hide in the steps where the user stalls,
   repeats themselves, or has to think.
3. **Find the friction.** For each stall, name it concretely: *what* the user is doing, *why* it's
   slow or confusing, and *what it costs* (a drop-off, a support ticket, a moment of doubt).
4. **Invert the defaults.** For every "everyone does it this way," ask what happens if you delete it.
   The biggest leverage is usually removal, not addition — the feature you cut, the step you skip, the
   choice you make for the user.
5. **Reach for the order-of-magnitude version.** Don't propose "make onboarding faster." Propose "no
   onboarding — the product works on the first screen." Push each idea to its boldest honest form.

## Writing a strong candidate (descriptions matter)

A weak idea is a label. A strong idea is a **detailed, concrete description** that a builder could act
on and a skeptic could argue with. Each candidate should carry:

- **A short imperative name** — the move in four to six words ("Open straight to the one next thing").
- **A description of two to four sentences** that does real work:
  - Name the friction it kills, specifically — not "improves UX" but "kills the dashboard nobody
    reads on launch."
  - Say what the change actually is, concretely enough to picture.
  - Say *why* it's 10x, not 10% — what it removes, what it makes inevitable.
  - Where it helps, add the cost of the status quo (the drop-off, the confusion, the 2am bug).
  Write it in plain, opinionated language. Specific beats clever. A description a junior understands
  on the first read is worth more than one that sounds smart in a meeting.
- **Effort** — can it ship in a weekend, or is it a quarter? (LOW / MED / HIGH)
- **Impact** — does it move the core job by an order of magnitude? (LOW / HIGH / 10×)
- **A rough build estimate** — "1 weekend", "a sprint", "a quarter".

## Score and rank

Score each candidate on two axes only — **benefit** and **effort** — and rank by benefit ÷ effort. A
LOW-effort / 10×-benefit idea beats a HIGH-effort / HIGH one every time. The point of ranking by
least-effort, most-benefit is that it surfaces the moves a team can actually ship before they lose
their nerve.

## Output

Over-produce: generate ten to fifteen real candidates with full descriptions, ranked. Do not
self-censor here — saying no is the next step's job. Hand the ranked list, descriptions and all, to
the filter, which keeps the three that matter and records the rest as "more ideas weighed."
