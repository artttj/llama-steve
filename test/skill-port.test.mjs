// test/skill-port.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const skill = readFileSync(join(ROOT, 'skills/llama-steve/SKILL.md'), 'utf8')

test('contains no CJK characters', () => {
  assert.doesNotMatch(skill, /[　-〿㐀-鿿＀-￯]/)
})

test('is branded LLama Steve and declares the teardown protocol + output contract', () => {
  assert.match(skill, /LLama Steve/)
  assert.match(skill, /## Teardown Protocol/)
  assert.match(skill, /result\.json/)
  assert.match(skill, /SHEEP IT/)
  assert.match(skill, /SPIT IT/)
})
