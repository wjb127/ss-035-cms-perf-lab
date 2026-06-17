import { config, singleton, fields } from '@keystatic/core'

// 로컬 스토리지 모드 — dev에서 src/content/landing/index.json을 직접 편집.
// 프로덕션 라이브 편집은 storage를 { kind: 'github', repo } 또는 keystatic.cloud로 전환 필요.
export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'CMS Perf Lab · Keystatic' },
  },
  singletons: {
    landing: singleton({
      label: '랜딩페이지',
      path: 'src/content/landing/',
      format: { data: 'json' },
      schema: {
        meta: fields.object({
          title: fields.text({ label: 'title' }),
          description: fields.text({ label: 'description', multiline: true }),
          lang: fields.text({ label: 'lang', defaultValue: 'ko' }),
        }, { label: '메타' }),
        hero: fields.object({
          badge: fields.text({ label: '뱃지' }),
          title: fields.text({ label: '제목' }),
          subtitle: fields.text({ label: '부제', multiline: true }),
          primaryCtaText: fields.text({ label: '주 버튼 텍스트' }),
          primaryCtaUrl: fields.text({ label: '주 버튼 링크' }),
          secondaryCtaText: fields.text({ label: '보조 버튼 텍스트' }),
          secondaryCtaUrl: fields.text({ label: '보조 버튼 링크' }),
        }, { label: '히어로' }),
        features: fields.array(
          fields.object({
            title: fields.text({ label: '제목' }),
            description: fields.text({ label: '설명', multiline: true }),
          }),
          { label: '특징', itemLabel: (props) => props.fields.title.value || '특징' },
        ),
        ctaSection: fields.object({
          title: fields.text({ label: '제목' }),
          buttonText: fields.text({ label: '버튼 텍스트' }),
          buttonUrl: fields.text({ label: '버튼 링크' }),
        }, { label: '하단 CTA' }),
        footerText: fields.text({ label: '푸터 문구' }),
      },
    }),
  },
})
