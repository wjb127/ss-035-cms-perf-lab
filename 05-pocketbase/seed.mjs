// PocketBase에 landing 컬렉션 생성 + canonical 콘텐츠 시드
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const c = JSON.parse(readFileSync(resolve(__dirname, '..', 'shared/landing-content.json'), 'utf8'))

const BASE = 'http://127.0.0.1:8090'
const j = (r) => r.json()

// 1) 슈퍼유저 인증
let res = await fetch(`${BASE}/api/collections/_superusers/auth-with-password`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ identity: 'admin@example.com', password: 'ClpLab-2026-demo!' }),
})
if (!res.ok) { console.error('인증 실패', res.status, await res.text()); process.exit(1) }
const token = (await j(res)).token
const auth = { authorization: token, 'content-type': 'application/json' }
console.log('인증 OK')

// 2) landing 컬렉션 (이미 있으면 skip)
res = await fetch(`${BASE}/api/collections/landing`, { headers: auth })
if (res.status !== 200) {
  const t = (name) => ({ name, type: 'text' })
  const create = await fetch(`${BASE}/api/collections`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      name: 'landing',
      type: 'base',
      // 공개 read 허용 (헤드리스 프론트가 토큰 없이 조회 가능하게)
      listRule: '',
      viewRule: '',
      fields: [
        t('hero_badge'), t('hero_title'), { name: 'hero_subtitle', type: 'editor' },
        t('hero_primary_cta_text'), t('hero_primary_cta_url'),
        t('hero_secondary_cta_text'), t('hero_secondary_cta_url'),
        { name: 'features', type: 'json' },
        t('cta_title'), t('cta_button_text'), t('cta_button_url'),
        t('footer_text'),
      ],
    }),
  })
  if (!create.ok) { console.error('컬렉션 생성 실패', create.status, await create.text()); process.exit(1) }
  console.log('landing 컬렉션 생성 OK')
} else {
  console.log('landing 컬렉션 이미 존재')
}

// 3) 레코드 시드 (1건)
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
// 기존 레코드 있으면 갱신, 없으면 생성
res = await fetch(`${BASE}/api/collections/landing/records?perPage=1`, { headers: auth })
const items = (await j(res)).items ?? []
if (items.length) {
  await fetch(`${BASE}/api/collections/landing/records/${items[0].id}`, { method: 'PATCH', headers: auth, body: JSON.stringify(payload) })
  console.log('레코드 갱신 OK')
} else {
  const cr = await fetch(`${BASE}/api/collections/landing/records`, { method: 'POST', headers: auth, body: JSON.stringify(payload) })
  if (!cr.ok) { console.error('레코드 생성 실패', cr.status, await cr.text()); process.exit(1) }
  console.log('레코드 생성 OK')
}
console.log('완료 — admin: http://127.0.0.1:8090/_/')
