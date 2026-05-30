// test/cli.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseArgs } from '../llama-steve.mjs'

test('defaults to serve verb on the cwd', () => {
  const a = parseArgs(['node', 'cli'])
  assert.equal(a.verb, 'serve')
  assert.equal(a.open, false)
  assert.equal(a.port, 7788)
})

test('parses landing verb, --open, --port, --no-serve', () => {
  const a = parseArgs(['node', 'cli', 'landing', '--open', '--port', '9001', '--no-serve'])
  assert.equal(a.verb, 'landing')
  assert.equal(a.open, true)
  assert.equal(a.port, 9001)
  assert.equal(a.noServe, true)
})
