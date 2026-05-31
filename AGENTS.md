# AGENTS.md — Llama Steve

Guidance for coding agents (Claude Code, etc.) working in this repo.

## What this is

Llama Steve is a Claude Code plugin that runs a **10x product teardown** of a repo
in the voice of a Steve-Jobs-modeled persona — it generates game-changing ideas,
says no to most of them, keeps ~3, and stamps a binary verdict (**SHEEP IT** or
**SPIT IT**). It renders the result as an Apple-keynote-style report and serves it
on localhost. A curated landing page is published at `https://sonto.space/steve/`.

## Architecture (read before changing anything)

The CLI is a **deterministic renderer. It makes zero LLM calls.** The actual
thinking is done by the Claude Code agent following `commands/llama-steve.md`.

- `llama-steve.mjs` — CLI. Verbs: `serve` (render `/tmp/llama-steve-result.json`
  into `reports/` and serve it) and `landing` (render `assets/demo.json` into
  `site/` for the public demo). Flags: `--open`, `--no-serve`, `--port`, `--result`.
- `lib/report.mjs` — `renderReport` / `buildReport`. Emits self-contained HTML and
  copies `assets/`. Two modes: `report` (local) and `landing` (adds
  `<base href="/steve/">`). CSS is cache-busted by content hash. `boldNames()`
  lightly bolds known framework/company names; the brand mark is `assets/llama-mark.svg`
  inlined with `fill: currentColor`.
- `lib/scan.mjs` — `repoIdentity()`: name/description from manifest, git remote, commit count.
- `lib/serve.mjs` — tiny static server, bound to `127.0.0.1`, path-traversal guarded.
- `skills/` — bundled skills used during a teardown: `llama-steve` (persona +
  output contract), `ten-x` (idea generation), `humanizer` (verdict rewrite).
- `assets/demo.json` — data for the **public** landing. **Must be a real teardown.**
  `assets/example.json` is the fallback sample shown when no result exists.

## Running it

```bash
node llama-steve.mjs serve --open    # local report from /tmp/llama-steve-result.json
node llama-steve.mjs landing         # build public site/ from assets/demo.json
node --test test/*.mjs               # tests (Node 20+, no deps, no build step)
```

## The teardown (what the agent does)

Follow `commands/llama-steve.md` and the `skills/llama-steve` output contract:
`{ product, ideasConsidered, features[], more[], killed[], verdict }`. `heat` is
1–3, `effort` ∈ LOW/MED/HIGH. Keep `features` to ~3 (max 5); the kill list is the point.

**Read the real code before judging it. Do not invent findings.** Ground every
feature and number in something you actually observed in the target repo. The demo
is a real scan of `vercel/next.js`, not recited knowledge — keep it that way.

## Deploying

The public demo at `sonto.space/steve/` is a static drop that lives **outside** the
sonto-space repo. See `.claude/skills/deploy`. Only real results ship to the demo.

## Conventions

- ES modules, Node 20+, no dependencies, no build step.
- Many small focused files. Match the surrounding style.
- Don't add LLM calls to the CLI — the agent is the model.
