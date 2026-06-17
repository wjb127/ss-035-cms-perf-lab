// 02-decap 빌드 — Sveltia/Decap가 관리하는 content/landing.json으로 정적 랜딩 생성 + admin 복사
import { readFileSync, mkdirSync, writeFileSync, cpSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// 콘텐츠 단일 소스 = CMS가 소유하는 content/landing.json (초기값은 canonical과 동일)
const c = JSON.parse(readFileSync(resolve(__dirname, 'content/landing.json'), 'utf8'))
const css = readFileSync(resolve(root, 'shared/landing.css'), 'utf8')

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const features = c.features
  .map(
    (f) => `      <article class="feature">
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.description)}</p>
      </article>`,
  )
  .join('\n')

const html = `<!doctype html>
<html lang="${esc(c.meta.lang)}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(c.meta.title)} · Sveltia</title>
<meta name="description" content="${esc(c.meta.description)}" />
<style>${css}</style>
</head>
<body>
<main class="lp">
  <section class="hero">
    <span class="badge">${esc(c.hero.badge)}</span>
    <h1>${esc(c.hero.title)}</h1>
    <p class="subtitle">${esc(c.hero.subtitle)}</p>
    <div class="cta-row">
      <a class="btn btn-primary" href="${esc(c.hero.primaryCtaUrl)}">${esc(c.hero.primaryCtaText)}</a>
      <a class="btn btn-ghost" href="${esc(c.hero.secondaryCtaUrl)}">${esc(c.hero.secondaryCtaText)}</a>
    </div>
  </section>
  <section class="features">
${features}
  </section>
  <section class="cta-section" id="contact">
    <h2>${esc(c.ctaSection.title)}</h2>
    <a class="btn btn-primary" href="${esc(c.ctaSection.buttonUrl)}">${esc(c.ctaSection.buttonText)}</a>
  </section>
  <footer class="footer">${esc(c.footerText)}</footer>
</main>
</body>
</html>
`

const dist = resolve(__dirname, 'dist')
mkdirSync(dist, { recursive: true })
writeFileSync(resolve(dist, 'index.html'), html)
// admin UI(/admin) 복사
cpSync(resolve(__dirname, 'public/admin'), resolve(dist, 'admin'), { recursive: true })
console.log('02-decap → dist/index.html + dist/admin/ 생성 완료')
