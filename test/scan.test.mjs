// test/scan.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, basename } from 'node:path'
import { repoIdentity } from '../lib/scan.mjs'

test('reads name and oneLiner from package.json', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ls-scan-'))
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ name: 'focusflow', description: 'a habit tracker' }))
  const id = repoIdentity(dir)
  assert.equal(id.name, 'focusflow')
  assert.equal(id.oneLiner, 'a habit tracker')
})

test('falls back to directory basename when no manifest', () => {
  const dir = mkdtempSync(join(tmpdir(), 'ls-nomani-'))
  const id = repoIdentity(dir)
  assert.equal(id.name, basename(dir))
})
