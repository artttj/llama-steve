import { readFileSync } from 'node:fs'
import { join, basename } from 'node:path'
import { execFileSync } from 'node:child_process'

// Identity of the repo under teardown: name, one-line description, git remote, commit count.
export function repoIdentity(root) {
  let name = '', oneLiner = '', url = '', commits = 0
  try {
    const remote = execFileSync('git', ['-C', root, 'config', '--get', 'remote.origin.url'], { encoding: 'utf8' }).trim().replace(/\.git$/, '')
    const m = remote.match(/([^/:]+\/[^/]+)$/)
    if (m) url = `https://github.com/${m[1]}`
  } catch {}
  for (const f of ['package.json', 'composer.json']) {
    try {
      const j = JSON.parse(readFileSync(join(root, f), 'utf8'))
      if (!name && j.name) name = String(j.name)
      if (!oneLiner && j.description) oneLiner = String(j.description)
    } catch {}
  }
  if (!oneLiner) {
    for (const [f, re] of [['pyproject.toml', /^description\s*=\s*"([^"]+)"/m], ['Cargo.toml', /^description\s*=\s*"([^"]+)"/m]]) {
      try { const t = readFileSync(join(root, f), 'utf8').match(re); if (t) { oneLiner = t[1]; break } } catch {}
    }
  }
  if (!name) name = basename(root)
  try { commits = parseInt(execFileSync('git', ['-C', root, 'rev-list', '--count', 'HEAD'], { encoding: 'utf8' }).trim(), 10) || 0 } catch {}
  return { name, oneLiner, url, commits }
}
