#!/usr/bin/env node
// llama-steve — render a teardown result.json into the Apple report and serve it on localhost.
// The LLM teardown (scan → 10x → filter → humanized verdict) lives in commands/llama-steve.md;
// this CLI is deterministic: build the HTML, serve it, optionally open the browser.
import { existsSync, readFileSync } from 'node:fs'
import { resolve, join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { buildReport } from './lib/report.mjs'

export const VERSION = '0.1.0'
const VERBS = new Set(['serve', 'landing'])
const RESULT_FILE = '/tmp/llama-steve-result.json'

export function parseArgs(argv) {
  const args = { verb: 'serve', open: false, port: 7788, noServe: false, result: RESULT_FILE }
  let verbSet = false
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--open') args.open = true
    else if (a === '--no-serve' || a === '--html-only') args.noServe = true
    else if (a === '--result' && i + 1 < argv.length) args.result = argv[++i]
    else if (a === '--port' && i + 1 < argv.length) { const p = parseInt(argv[++i], 10); args.port = Number.isInteger(p) && p > 0 && p < 65536 ? p : 7788 }
    else if (!verbSet && VERBS.has(a)) { args.verb = a; verbSet = true }
  }
  return args
}

async function main() {
  const args = parseArgs(process.argv)
  const LS = dirname(fileURLToPath(import.meta.url))
  const reportsDir = join(LS, 'reports')

  if (args.verb === 'landing') {
    const demoPath = join(LS, 'assets/demo.json')
    const src = existsSync(demoPath) ? demoPath : join(LS, 'assets/example.json')
    const data = JSON.parse(readFileSync(src, 'utf8'))
    const out = join(LS, 'site')
    buildReport(data, out, { mode: 'landing' })
    console.log(`built public landing → ${out}/index.html (from ${src})`)
    return
  }

  // serve: render the latest teardown result into reports/ then serve.
  let result
  if (existsSync(args.result)) {
    result = JSON.parse(readFileSync(args.result, 'utf8'))
  } else {
    console.log(`no result at ${args.result} — showing the example teardown. Run /llama-steve to scan this repo.`)
    result = JSON.parse(readFileSync(join(LS, 'assets/example.json'), 'utf8'))
  }
  buildReport(result, reportsDir, { mode: 'report' })
  if (args.noServe) { console.log(`built report → ${reportsDir}/index.html (--no-serve)`); return }
  const { createReportServer } = await import('./lib/serve.mjs')
  const { url } = await createReportServer(args.port, reportsDir)
  if (args.open) { try { execFile('open', [url], () => {}) } catch { console.log(`open ${url}`) } }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => { console.error(e); process.exit(1) })
}
