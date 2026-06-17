// Directus 로컬에 landing 싱글톤 컬렉션 생성 + canonical 콘텐츠 시드
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const c = JSON.parse(readFileSync(resolve(root, 'shared/landing-content.json'), 'utf8'))

const BASE = 'http://localhost:8055'
const EMAIL = 'admin@example.com'
const PASSWORD = 'ClpLab-2026-demo!'

const j = (r) => r.json()
const die = async (r, msg) => {
  if (!r.ok) {
    console.error(msg, r.status, await r.text())
    process.exit(1)
  }
}

// 1) 로그인
let res = await fetch(`${BASE}/auth/login`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
})
await die(res, '로그인 실패')
const token = (await j(res)).data.access_token
const auth = { authorization: `Bearer ${token}`, 'content-type': 'application/json' }
console.log('로그인 OK')

// 2) landing 컬렉션 존재 확인
res = await fetch(`${BASE}/collections/landing`, { headers: auth })
if (res.status === 200) {
  console.log('landing 컬렉션 이미 존재 — 시드만 갱신')
} else {
  const text = (label) => ({ field: label, type: 'string', meta: { interface: 'input' }, schema: {} })
  const area = (label) => ({ field: label, type: 'text', meta: { interface: 'input-multiline' }, schema: {} })
  const create = await fetch(`${BASE}/collections`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      collection: 'landing',
      meta: { singleton: true, icon: 'web', note: '랜딩페이지 콘텐츠' },
      schema: {},
      fields: [
        { field: 'id', type: 'integer', meta: { hidden: true }, schema: { is_primary_key: true, has_auto_increment: true } },
        text('hero_badge'), text('hero_title'), area('hero_subtitle'),
        text('hero_primary_cta_text'), text('hero_primary_cta_url'),
        text('hero_secondary_cta_text'), text('hero_secondary_cta_url'),
        { field: 'features', type: 'json', meta: { interface: 'list', special: ['cast-json'] }, schema: {} },
        text('cta_title'), text('cta_button_text'), text('cta_button_url'),
        text('footer_text'),
      ],
    }),
  })
  await die(create, 'landing 컬렉션 생성 실패')
  console.log('landing 싱글톤 컬렉션 생성 OK')
}

// 3) 콘텐츠 시드 (싱글톤은 PATCH /items/landing)
const payload = {
  hero_badge: c.hero.badge,
  hero_title: c.hero.title,
  hero_subtitle: c.hero.subtitle,
  hero_primary_cta_text: c.hero.primaryCtaText,
  hero_primary_cta_url: c.hero.primaryCtaUrl,
  hero_secondary_cta_text: c.hero.secondaryCtaText,
  hero_secondary_cta_url: c.hero.secondaryCtaUrl,
  features: c.features,
  cta_title: c.ctaSection.title,
  cta_button_text: c.ctaSection.buttonText,
  cta_button_url: c.ctaSection.buttonUrl,
  footer_text: c.footerText,
}
res = await fetch(`${BASE}/items/landing`, { method: 'PATCH', headers: auth, body: JSON.stringify(payload) })
await die(res, '콘텐츠 시드 실패')
console.log('콘텐츠 시드 OK')
console.log('완료 — admin: http://localhost:8055/admin')
