import { mkdirSync, writeFileSync, cpSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ASSETS = join(dirname(dirname(fileURLToPath(import.meta.url))), 'assets')
const LLAMA_MARK = readFileSync(join(ASSETS, 'llama-mark.svg'), 'utf8')

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export const heatFlames = (n) => '🔥'.repeat(Math.max(1, Math.min(3, Number(n) || 1)))

export const safeName = (s) => String(s).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'report'

// Lightly bold known framework/company names in the verdict (sonto-news keyword-highlight, trimmed).
const KW_TERMS = ['Next.js', 'LangChain', 'TypeScript', 'JavaScript', 'App Store', 'React', 'Vercel', 'Apple', 'Laravel', 'Ollama', 'Node', 'Python', 'PHP', 'iPhone', 'iPod', 'iPad', 'Mac']
export function boldNames(escaped, productName) {
  const terms = [...new Set([productName, ...KW_TERMS].filter(Boolean))]
    .sort((a, b) => b.length - a.length)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  return escaped.replace(new RegExp(`(?<![\\w-])(${terms.join('|')})(?![\\w-])`, 'gi'), '<b class="kw">$1</b>')
}

function renderFeature(f) {
  return `<div class="feat">
    <div class="rank">${esc(String(f.rank).padStart(2, '0'))}</div><div class="heat">${heatFlames(f.heat)}</div>
    <div class="feat-main">
      <div class="feat-name">${esc(f.name)}</div>
      <div class="feat-desc">${boldNames(esc(f.desc))}</div>
      <div class="chips"><span class="chip eff">EFFORT · ${esc(f.effort)}</span><span class="chip imp">IMPACT · ${esc(f.impact)}</span><span class="chip mid">${esc(f.build)}</span></div>
    </div>
  </div>`
}

function renderOutput(r) {
  if (!r.features?.length) {
    return `<p class="out-meta">${esc(`scanned ${r.product.scope || 'the repo'} · ${r.ideasConsidered || 0} ideas considered`)}</p>
      <div class="killbox"><h4>Nothing survived the filter</h4><p>He looked, and there was no single idea worth shipping yet. Start over.</p></div>`
  }
  const kills = (r.killed || []).map((k) => `<li>${esc(k)}</li>`).join('')
  return `<p class="cmd"><span class="p">➜</span> llama-steve teardown <b>./${esc(r.product.name)}</b></p>
    <p class="out-meta">${esc(`scanned ${r.product.scope || 'the repo'} · ${r.ideasConsidered || 0} ideas weighed ·${(r.killed || []).length} cut · ${r.features.length} shipped · 1 verdict`)}</p>
    ${r.features.map(renderFeature).join('\n')}
    ${(r.more && r.more.length) ? `<details class="more-feats"><summary>${esc(`+ ${r.more.length} more ideas he weighed`)}</summary>${r.more.map(renderFeature).join('\n')}</details>` : ''}
    ${kills ? `<div class="killbox"><h4>❌ He said no to ${(r.killed || []).length} things</h4><ul class="kill-list">${kills}</ul><p class="kill-quote">"Every one of these is a good idea. That's the trap. Focus is saying no to good ideas."</p></div>` : ''}`
}

export function renderReport(r, { mode = 'report', v = '' } = {}) {
  const stampClass = /spit/i.test(r.verdict?.stamp || '') ? 'stamp spit' : 'stamp'
  const navCta = mode === 'landing'
    ? `<a class="nav-cta" href="#get">Add to Claude Code</a>`
    : `<a class="nav-cta" href="#get">Re-run teardown</a>`
  const finalBlock = mode === 'landing'
    ? `<h2>Stop adding. Start cutting.</h2>
       <p class="lede" style="margin-top:18px">Add the marketplace, then point him at anything you're building.</p>
       <div class="install-stack">
         <div class="install"><span>/plugin marketplace add <b class="ga">artttj/llama-steve</b></span><span class="copy">COPY</span></div>
         <div class="install"><span>/plugin install <b class="ga">llama-steve</b></span><span class="copy">COPY</span></div>
       </div>`
    : `<h2>That's the teardown.</h2>
       <p class="lede" style="margin-top:18px">${esc(`scanned ${r.product.name} · ${new Date(r.product.scannedAt || Date.now()).toLocaleString()}`)}</p>
       <div class="install"><span>llama-steve&nbsp;<b class="ga">serve --open</b>&nbsp;to re-run</span></div>`
  return `<!DOCTYPE html>
<html lang="en">
<head>
${mode === 'landing' ? '<base href="/steve/">\n' : ''}<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Llama Steve — ${esc(r.product.name)}</title>
<meta property="og:title" content="Llama Steve — your roadmap has 1,000 ideas. He ships 3.">
<meta property="og:description" content="Llama Steve analyzes your actual product to identify and ship game-changing features. Maximize your conversion, cut user friction, and focus only on what wins.">
<meta property="og:image" content="https://sonto.space/steve/assets/og-2.png">
<meta property="og:image:secure_url" content="https://sonto.space/steve/assets/og-2.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Llama Steve — your roadmap has 1,000 ideas. He ships 3.">
<meta property="og:url" content="https://sonto.space/steve/">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Llama Steve — your roadmap has 1,000 ideas. He ships 3.">
<meta name="twitter:image" content="https://sonto.space/steve/assets/og-2.png">
<meta name="description" content="Llama Steve analyzes your actual product to identify and ship game-changing features. Maximize your conversion, cut user friction, and focus only on what wins.">
<meta name="author" content="Artem Iagovdik">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#fbfbfd">
<link rel="canonical" href="https://sonto.space/steve/">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Llama Steve","applicationCategory":"DeveloperApplication","operatingSystem":"Claude Code","description":"A 10x product teardown that ships 3 features and a humanized verdict.","url":"https://sonto.space/steve/","author":{"@type":"Person","name":"Artem Iagovdik","url":"https://artttj.de"},"offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}</script>
<link rel="stylesheet" href="assets/llama-steve.css${v ? `?v=${v}` : ''}">
<script>try{var t=localStorage.getItem('ls-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
</head>
<body>
<nav><div class="wrap">
  <div class="brand"><span class="dot">${LLAMA_MARK}</span> Llama&nbsp;Steve</div>
  <div class="nav-links"><a href="#output">The teardown</a><a href="#verdict">The verdict</a><a href="#model">The taste</a></div>
  <div class="nav-right">
    <button class="theme-btn" id="themeBtn" type="button" aria-label="Toggle theme">
      <svg class="moon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      <svg class="sun" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
    </button>
    ${navCta}
  </div>
</div></nav>

<header>
  <p class="eyebrow">Introducing Llama Steve</p>
  <h1>Your roadmap has <span id="roadmapCount" data-count>1,000</span> ideas.<span class="sub">Llama Steve ships 3.</span></h1>
  <p class="lede">Point him at your <em>codebase</em>. He skips the roadmap noise, analyzes your actual product, and builds the highest-impact fixes to boost conversion and eliminate user friction.</p>
  <div class="hero-cta"><a class="btn-primary" href="#get">${mode === 'landing' ? 'Add to Claude Code' : 'Re-run teardown'}</a><a class="btn-ghost" href="#output">See the teardown ↓</a></div>
  <div class="portrait-stage">
    <img class="portrait" src="assets/llama-steve.png" alt="Llama Steve">
    <span class="portrait-tag">"Great products are edited, not added to."</span>
  </div>
</header>

<section id="output"><div class="wrap">
  <div class="out-head">
    <p class="label">The output</p><h2 class="sec-title">What he hands back</h2>
    <p class="sec-sub">He scans the codebase for product opportunities, then cuts the ideas that are too expensive, too noisy, or not worth the surface area. What survives is ranked by payoff against effort. More 🔥 means bigger upside for less wasted build time.</p>
    <p class="real-tag"><span class="rpip"></span> Real, unedited teardown of next.js — the model's actual output, nothing rewritten.</p>
  </div>
  <div class="terminal">
    <div class="term-bar"><div class="tl"><i></i><i></i><i></i></div><div class="title">llama-steve · ${esc(r.product.name)} (${esc(r.product.oneLiner)})</div></div>
    <div class="term-body">${renderOutput(r)}</div>
  </div>
</div></section>

<section class="verdict" id="verdict"><div class="wrap">
  <p class="label" style="text-align:center;margin-bottom:34px">The verdict</p>
  <div class="verdict-card">
    <span class="${stampClass}">${esc(r.verdict?.stamp || 'SHEEP IT')}</span>
    <img class="vphoto" src="assets/llama-steve.png" alt="Llama Steve">
    <div>
      <p class="vquote">${boldNames(esc(r.verdict?.quote || ''), r.product?.name)}</p>
      <p class="vby">— Llama Steve, take it or leave it</p>
      <span class="humanized"><span class="pip"></span> written to read like a person, not a model</span>
    </div>
  </div>
</div></section>

<section class="ad" id="model"><div class="wrap"><div class="ad-card">
  <div class="ad-body">
    <p class="ad-kicker">// not a prompt. a mental model.</p>
    <h2 class="ad-h">Llama Steve isn't a one-line persona. <em>It's the operating system that cut 350 products down to 10.</em></h2>
    <p class="ad-p">Most "act like Steve Jobs" prompts are a sentence and a vibe. Llama Steve was distilled from biographies, interviews, keynotes, and primary sources into mental models, heuristics, and a voice DNA. Not a costume — a product judgment engine built around focus, taste, and ruthless subtraction.</p>
  </div>
  <div class="ad-stats">
    <div class="stat"><div class="n">6</div><div class="k">core mental models</div></div>
    <div class="stat"><div class="n">8</div><div class="k">decision heuristics</div></div>
    <div class="stat"><div class="n">30<span class="u">+</span></div><div class="k">primary sources</div></div>
    <div class="stat"><div class="n">2</div><div class="k">verdicts — sheep it, or spit it</div></div>
  </div>
</div>
  <p class="mm-cap">The six mental models he runs on</p>
  <div class="mm-grid">
    <div class="mm"><div class="mm-top"><span class="mm-i">01</span><h4 class="mm-name">Focus = saying no</h4></div><p class="mm-d">Focus isn't saying yes to the one thing. It's saying no to the hundred other good ideas.</p></div>
    <div class="mm"><div class="mm-top"><span class="mm-i">02</span><h4 class="mm-name">The whole widget</h4></div><p class="mm-d">Be serious about the software and you make the hardware too — own the whole experience, end to end.</p></div>
    <div class="mm"><div class="mm-top"><span class="mm-i">03</span><h4 class="mm-name">Connecting the dots</h4></div><p class="mm-d">You can't connect the dots looking forward, only backward. Follow your gut and trust they will.</p></div>
    <div class="mm"><div class="mm-top"><span class="mm-i">04</span><h4 class="mm-name">Death as the filter</h4></div><p class="mm-d">If today were your last day, would you do what you're about to? Too many no's in a row, change something.</p></div>
    <div class="mm"><div class="mm-top"><span class="mm-i">05</span><h4 class="mm-name">Reality distortion field</h4></div><p class="mm-d">Make people believe an impossible goal, and you make it possible.</p></div>
    <div class="mm"><div class="mm-top"><span class="mm-i">06</span><h4 class="mm-name">Technology × liberal arts</h4></div><p class="mm-d">Technology alone isn't enough. Married to the humanities, it yields what makes the heart sing.</p></div>
  </div>
<div class="sources"><span class="src">Isaacson biography</span><span class="src">Stanford 2005</span><span class="src">The Lost Interview</span><span class="src">D-Conference D3–D8</span><span class="src">Make Something Wonderful</span><span class="src">WWDC keynotes '97–'11</span></div>
</div></section>

<section class="final" id="get"><div class="wrap">${finalBlock}</div>
  <footer><div class="fl"><a href="https://github.com/artttj/llama-steve">GitHub</a></div>
  MIT © <a href="https://artttj.de">Artem Iagovdik</a> · built on the <a href="https://github.com/artttj/llama-smith">llama-smith</a> engine · 2026</footer>
</section>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<script>
(function(){
  var tb=document.getElementById('themeBtn');
  if(tb)tb.addEventListener('click',function(){var d=document.documentElement,dk=d.getAttribute('data-theme')==='dark';if(dk)d.removeAttribute('data-theme');else d.setAttribute('data-theme','dark');try{localStorage.setItem('ls-theme',dk?'light':'dark')}catch(e){}});
  var el=document.getElementById('roadmapCount');
  if(!el)return;
  var target=1100+Math.floor(Math.random()*800);
  var fmt=function(n){return n.toLocaleString('en-US')};
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=fmt(target);return}
  var dur=1500,t0=null;
  function tick(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/dur);var e=p<0.5?2*p*p:1-Math.pow(-2*p+2,2)/2;el.textContent=fmt(Math.round(target*e));if(p<1)requestAnimationFrame(tick);else el.textContent=fmt(target)}
  el.textContent='0';requestAnimationFrame(tick);
})();
(function(){
  var toast=document.getElementById('toast');
  function notify(msg){if(!toast)return;toast.textContent=msg;toast.classList.add('show');clearTimeout(toast._h);toast._h=setTimeout(function(){toast.classList.remove('show')},1700)}
  function copy(text){
    if(navigator.clipboard&&navigator.clipboard.writeText){return navigator.clipboard.writeText(text)}
    return new Promise(function(res,rej){try{var ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.top='-9999px';document.body.appendChild(ta);ta.focus();ta.select();document.execCommand('copy');document.body.removeChild(ta);res()}catch(e){rej(e)}})
  }
  document.querySelectorAll('.install .copy').forEach(function(btn){
    btn.setAttribute('role','button');btn.setAttribute('tabindex','0');btn.setAttribute('aria-label','Copy command');
    var orig=btn.textContent;
    function flash(){btn.textContent='COPIED ✓';btn.classList.add('ok');clearTimeout(btn._f);btn._f=setTimeout(function(){btn.textContent=orig;btn.classList.remove('ok')},1500)}
    function go(){var sib=btn.previousElementSibling;var cmd=(sib?sib.textContent:'').trim();copy(cmd).then(function(){flash();notify('Copied to clipboard')},function(){notify('Press ⌘C to copy')})}
    btn.addEventListener('click',go);
    btn.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}});
  });
})();
</script>
</body>
</html>`
}

// Write index.html + copy assets into outDir (self-contained, server-ready).
export function buildReport(r, outDir, opts = {}) {
  mkdirSync(outDir, { recursive: true })
  cpSync(ASSETS, join(outDir, 'assets'), { recursive: true })
  const v = createHash('sha1').update(readFileSync(join(ASSETS, 'llama-steve.css'))).digest('hex').slice(0, 8)
  writeFileSync(join(outDir, 'index.html'), renderReport(r, { ...opts, v }))
  return join(outDir, 'index.html')
}
