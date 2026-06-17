// 00-baseline 빌드 — CMS 없이 canonical 콘텐츠로 순수 정적 HTML 생성 (성능 상한 기준점)
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const c = JSON.parse(readFileSync(resolve(root, 'shared/landing-content.json'), 'utf8'))
const css = readFileSync(resolve(root, 'shared/landing.css'), 'utf8')

// XSS 방지용 HTML 이스케이프 (정적이라도 콘텐츠 출처 일관성 유지)
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
<title>${esc(c.meta.title)}</title>
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

mkdirSync(resolve(__dirname, 'dist'), { recursive: true })
writeFileSync(resolve(__dirname, 'dist/index.html'), html)
console.log('00-baseline → dist/index.html 생성 완료 (' + html.length + ' bytes)')
