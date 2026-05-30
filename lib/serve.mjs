import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { join, normalize, extname } from 'node:path'

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' }

export function createReportServer(port = 7788, root) {
  const server = createServer(async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405, { 'Cache-Control': 'no-store' }).end('method not allowed'); return }
    let rel
    try { rel = decodeURIComponent((req.url || '/').split('?')[0]) }
    catch { res.writeHead(400, { 'Cache-Control': 'no-store' }).end('bad request'); return }
    if (rel === '/' || rel.endsWith('/')) rel += 'index.html'
    const path = normalize(join(root, rel))
    if (path !== root && !path.startsWith(root + '/')) { res.writeHead(403, { 'Cache-Control': 'no-store' }).end('forbidden'); return }
    try {
      const body = await readFile(path)
      res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store, must-revalidate' }).end(body)
    } catch (e) {
      if (e.code !== 'ENOENT' && e.code !== 'EISDIR') { res.writeHead(500, { 'Cache-Control': 'no-store' }).end('server error'); return }
      res.writeHead(404, { 'Cache-Control': 'no-store' }).end('not found')
    }
  })
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      const actual = server.address().port
      const url = `http://localhost:${actual}`
      process.stdout.write(`serving ${root} at ${url}\n`)
      resolve({ server, url, port: actual })
    })
  })
}
