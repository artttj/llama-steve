// test/serve.test.mjs
import { test, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createReportServer } from '../lib/serve.mjs'

const dir = mkdtempSync(join(tmpdir(), 'ls-serve-'))
writeFileSync(join(dir, 'index.html'), '<!DOCTYPE html><h1>ok</h1>')
const { server, url } = await createReportServer(0, dir)
after(() => server.close())

test('serves index.html at root', async () => {
  const res = await fetch(url + '/')
  assert.equal(res.status, 200)
  assert.match(await res.text(), /ok/)
})

test('blocks path traversal', async () => {
  const res = await fetch(url + '/../../etc/passwd')
  assert.ok(res.status === 403 || res.status === 404)
})
