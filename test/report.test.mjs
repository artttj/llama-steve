// test/report.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { renderReport, buildReport, esc, heatFlames, safeName } from '../lib/report.mjs'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const example = JSON.parse(readFileSync(join(ROOT, 'assets/example.json'), 'utf8'))

test('esc neutralizes HTML and nullish input', () => {
  assert.equal(esc('<script>x</script>'), '&lt;script&gt;x&lt;/script&gt;')
  assert.equal(esc(null), '')
  assert.equal(esc(undefined), '')
})

test('heatFlames maps 1..3 to fire count, clamped', () => {
  assert.equal(heatFlames(3), '🔥🔥🔥')
  assert.equal(heatFlames(2), '🔥🔥')
  assert.equal(heatFlames(1), '🔥')
  assert.equal(heatFlames(9), '🔥🔥🔥')
})

test('safeName slugifies and falls back to "report"', () => {
  assert.equal(safeName('Foo Bar!'), 'foo-bar')
  assert.equal(safeName('!!!'), 'report')
})

test('renders product, features, and verdict stamp', () => {
  const html = renderReport(example, { mode: 'landing' })
  assert.match(html, /<!DOCTYPE html>/)
  assert.match(html, /focusflow/)
  assert.match(html, /Open straight to the one next thing/)
  assert.match(html, /SHEEP IT/)
  assert.match(html, /assets\/llama-steve\.css/)
})

test('escapes hostile feature content', () => {
  const evil = { ...example, features: [{ rank: 1, heat: 1, name: '<img src=x onerror=alert(1)>', desc: 'x', effort: 'LOW', impact: 'HIGH', build: '1 day' }], killed: [], verdict: { stamp: 'SPIT IT', quote: 'no' } }
  const html = renderReport(evil, { mode: 'report' })
  assert.doesNotMatch(html, /<img src=x onerror/)
  assert.match(html, /&lt;img src=x onerror/)
})

test('escapes hostile product fields (title, terminal, lede)', () => {
  const evil = { ...example, product: { ...example.product, name: '</title><script>x</script>', oneLiner: '"><b>x' } }
  const html = renderReport(evil, { mode: 'report' })
  assert.doesNotMatch(html, /<script>x<\/script>/)
  assert.match(html, /&lt;\/title&gt;&lt;script&gt;/)
})

test('SPIT IT verdict gets the red stamp class', () => {
  const r = { ...example, verdict: { stamp: 'SPIT IT', quote: 'Start over.' } }
  const html = renderReport(r, { mode: 'report' })
  assert.match(html, /class="stamp spit"/)
})

test('empty features renders an empty state', () => {
  const r = { ...example, features: [], killed: [] }
  const html = renderReport(r, { mode: 'report' })
  assert.match(html, /Nothing survived the filter/)
})

test('landing mode shows install CTA; report mode shows run meta', () => {
  assert.match(renderReport(example, { mode: 'landing' }), /plugin install/)
  assert.match(renderReport(example, { mode: 'report' }), /scanned/)
})

test('buildReport writes index.html and copies assets', () => {
  const out = mkdtempSync(join(tmpdir(), 'ls-build-'))
  const path = buildReport(example, out, { mode: 'landing' })
  assert.ok(existsSync(path))
  assert.ok(existsSync(join(out, 'assets', 'llama-steve.css')))
  assert.ok(existsSync(join(out, 'assets', 'llama-steve.png')))
})
