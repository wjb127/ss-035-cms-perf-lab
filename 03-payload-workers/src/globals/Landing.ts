import type { GlobalConfig } from 'payload'

// 랜딩페이지 콘텐츠 글로벌 — admin에서 비개발자가 직접 편집.
// 프론트(src/app/(frontend)/page.tsx)가 이 데이터를 읽어 렌더한다.
// read 접근을 공개로 열어 비로그인 프론트에서도 fetch 가능.
export const Landing: GlobalConfig = {
  slug: 'landing',
  label: '랜딩페이지',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: '히어로',
      fields: [
        {
          name: 'badge',
          type: 'text',
          label: '뱃지 문구',
          defaultValue: 'Cloudflare 엣지 CMS',
        },
        {
          name: 'title',
          type: 'text',
          label: '제목',
          required: true,
          defaultValue: '콘텐츠는 직접 수정하고, 속도는 엣지에 맡기세요',
        },
        {
          name: 'subtitle',
          type: 'textarea',
          label: '부제',
          defaultValue:
            'Payload + Cloudflare Workers로 만든 랜딩페이지. 관리자 패널에서 글·이미지를 바꾸면 전 세계 엣지에서 즉시 서빙됩니다.',
        },
        {
          name: 'primaryCtaText',
          type: 'text',
          label: '주 버튼 텍스트',
          defaultValue: '문의하기',
        },
        {
          name: 'primaryCtaUrl',
          type: 'text',
          label: '주 버튼 링크',
          defaultValue: '#contact',
        },
        {
          name: 'secondaryCtaText',
          type: 'text',
          label: '보조 버튼 텍스트',
          defaultValue: '관리자 패널',
        },
        {
          name: 'secondaryCtaUrl',
          type: 'text',
          label: '보조 버튼 링크',
          defaultValue: '/admin',
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      label: '특징',
      labels: { singular: '특징', plural: '특징' },
      defaultValue: [
        {
          title: '비개발자 직접 편집',
          description: '관리자 패널에서 텍스트·이미지를 클릭 몇 번으로 수정. 배포 없이 즉시 반영됩니다.',
        },
        {
          title: '엣지에서 서빙',
          description: 'D1 데이터베이스와 R2 스토리지가 Cloudflare 글로벌 네트워크 위에서 돌아갑니다.',
        },
        {
          title: '소스 전체 소유',
          description: '오픈소스(MIT) 기반이라 라이선스 비용 0원. 코드와 데이터를 모두 직접 보유합니다.',
        },
      ],
      fields: [
        { name: 'title', type: 'text', label: '제목', required: true },
        { name: 'description', type: 'textarea', label: '설명' },
      ],
    },
    {
      name: 'ctaSection',
      type: 'group',
      label: '하단 CTA',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: '제목',
          defaultValue: '지금 바로 콘텐츠를 직접 관리해 보세요',
        },
        {
          name: 'buttonText',
          type: 'text',
          label: '버튼 텍스트',
          defaultValue: '관리자 패널 열기',
        },
        {
          name: 'buttonUrl',
          type: 'text',
          label: '버튼 링크',
          defaultValue: '/admin',
        },
      ],
    },
    {
      name: 'footerText',
      type: 'text',
      label: '푸터 문구',
      defaultValue: '© 2026 CMS Perf Lab · Payload on Cloudflare Workers',
    },
  ],
}
