---
name: ten-x
description: |
  Find the 10x product opportunities — the few high-leverage moves that change the product by an
  order of magnitude, not the incremental ones. Used by Llama Steve inside the teardown to generate
  candidate ideas before the Jobs filter cuts them down. Triggers on "10x", "game-changing
  features", "what should we build next", "high-leverage".
---

# 10x — game-changing opportunity finder

Given a product (its current features, users, and friction), surface the handful of ideas that would
make it 10x better — not 10% better. Output candidates; a separate filter decides what ships.

## Method

1. **Find the core job.** What is the one thing a user hires this product to do? Strip everything else.
2. **Find the friction on that job.** Where does the core job stall, repeat, or make the user think?
   Each friction point is a 10x candidate.
3. **Invert the defaults.** For each "everyone does it this way", ask what happens if you delete it.
   The biggest leverage is usually removal, not addition.
4. **Score each candidate** on two axes only:
   - **Benefit**: does it move the core job by an order of magnitude? (LOW / HIGH / 10×)
   - **Effort**: can it ship in a weekend, or is it a quarter? (LOW / MED / HIGH)
5. **Rank by benefit ÷ effort.** A LOW-effort / 10×-benefit idea beats a HIGH-effort / HIGH one.

## Output

A list of candidates, each with: a short imperative name, one or two sentences of why it's 10x,
an effort label, an impact label, and a rough build estimate. Generate freely — over-produce, then
hand the list to the filter. Do not self-censor here; saying no is the next step's job.
