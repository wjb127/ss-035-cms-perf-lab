import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'

// 매 요청마다 최신 콘텐츠 반영 (admin 수정 즉시 노출)
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const landing = await payload.findGlobal({ slug: 'landing' })

  const hero = landing?.hero
  const features = landing?.features ?? []
  const ctaSection = landing?.ctaSection

  return (
    <main className="lp">
      <section className="hero">
        {hero?.badge && <span className="badge">{hero.badge}</span>}
        <h1>{hero?.title}</h1>
        {hero?.subtitle && <p className="subtitle">{hero.subtitle}</p>}
        <div className="cta-row">
          {hero?.primaryCtaText && (
            <a className="btn btn-primary" href={hero.primaryCtaUrl || '#'}>
              {hero.primaryCtaText}
            </a>
          )}
          {hero?.secondaryCtaText && (
            <a className="btn btn-ghost" href={hero.secondaryCtaUrl || '#'}>
              {hero.secondaryCtaText}
            </a>
          )}
        </div>
      </section>

      {features.length > 0 && (
        <section className="features">
          {features.map((f, i) => (
            <article key={i} className="feature">
              <h3>{f.title}</h3>
              {f.description && <p>{f.description}</p>}
            </article>
          ))}
        </section>
      )}

      {ctaSection?.title && (
        <section className="cta-section" id="contact">
          <h2>{ctaSection.title}</h2>
          {ctaSection.buttonText && (
            <a className="btn btn-primary" href={ctaSection.buttonUrl || '#'}>
              {ctaSection.buttonText}
            </a>
          )}
        </section>
      )}

      {landing?.footerText && <footer className="footer">{landing.footerText}</footer>}
    </main>
  )
}
