---
description: Tear down the current repo — 10x ideas, the Jobs filter, a humanized verdict — and open the report
argument-hint: "[path-to-repo] (defaults to current repo)"
---

Run a **LLama Steve teardown** of the target repo (default: the current working directory), then open
the report on localhost.

Requirements: Node 20+. No other dependencies — the persona, 10x, and humanizer skills are bundled.

**Models.** The teardown runs inside your Claude Code session — LLama Steve thinks with whatever Claude
model you're running (Claude by default, zero config). To prefer a specific Claude model for the run,
export `LLAMA_STEVE_MODEL` in your shell (e.g. in `~/.zshrc`) and use it when set.

Do this in order:

1. **Activate the persona.** Use the bundled `llama-steve` skill — you are LLama Steve for this run.
2. **Scan** the repo at `$ARGUMENTS` (or `.`): read README, `package.json`/manifest, structure. Write
   one sentence describing what the product is. Do not invent features — read the code.
3. **10x.** Use the bundled `ten-x` skill to generate the game-changing candidates.
4. **Filter.** Put every candidate through the LLama Steve mental models. Keep ~3 (never more than 5),
   ranked by least effort ÷ most benefit. Everything else goes on the kill list.
5. **Verdict.** Make the binary call — SHEEP IT or SPIT IT — in his voice, then use the bundled
   `humanizer` skill to rewrite it so it reads human (no AI tells, no "delve", no hedging).
6. **Emit** the structured result to `/tmp/llama-steve-result.json` using the exact output contract in
   the `llama-steve` skill.
7. **Render + open** the report:

```bash
node "${CLAUDE_PLUGIN_ROOT}/llama-steve.mjs" serve --open
```

Give the user the URL it prints (for example http://localhost:7788). Then summarize the verdict and the
three surviving features in chat. Report only what you put in the result — do not invent findings.

To rebuild the public landing page (curated example, for the demo site):

```bash
node "${CLAUDE_PLUGIN_ROOT}/llama-steve.mjs" landing
```
