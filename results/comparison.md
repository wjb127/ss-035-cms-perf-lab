# CMS 성능 비교 결과

> 측정 환경: Cloudflare (APAC), curl TTFB. 모든 후보는 동일한 `shared/landing-content.json` + `shared/landing.css` 사용 (콘텐츠·디자인 단일 소스).
> **비교 허브: https://ss035-hub.pages.dev** (라이브 나란히 비교)

## TTFB (curl, 프로덕션)

| # | 후보 | 카테고리 | 콜드 TTFB | 웜 TTFB(중앙값) | 비고 |
|---|---|---|---|---|---|
| 00 | baseline (정적) | 기준점 | ~0.42s | **~0.05s** | 순수 HTML/CSS 단일 파일, CF Pages 엣지 |
| 03 | Payload on Workers | 엣지(D1+R2) | ~1.96s | ~0.22s | SSR + 매 요청 D1 글로벌 조회(force-dynamic) |
| 01 | Keystatic | git기반 | — | — | 예정 |
| 02 | Decap/Sveltia | git기반 | — | — | 예정 |
| 04 | Directus | 헤드리스(셀프호스트) | — | — | 예정 (CF Workers 불가 → VPS/Cloud) |

- 측정일: 2026-06-17
- **정적(baseline) vs 엣지CMS(Payload): 웜 TTFB 약 4배 격차** (~50ms vs ~220ms). 가설대로 정적이 성능 상한.
- baseline은 DB쿼리 0, 단일 정적 파일 → CDN 엣지에서 즉시 서빙.
- Payload는 force-dynamic이라 매 요청 D1 읽음. 캐시/ISR 적용 시 격차 축소 여지(트레이드오프 측정 포인트).

## 라이브 URL

| 후보 | URL |
|---|---|
| 비교 허브 | https://ss035-hub.pages.dev |
| 00 baseline | https://ss035-baseline.pages.dev |
| 03 Payload | https://ss035-payload-cms.seungbeen-dev.workers.dev |

## 편집 UX (초기 관찰)

| 후보 | 편집 주체 | 반영 방식 |
|---|---|---|
| baseline | 개발자만 | 코드 수정 → 재빌드 → 재배포 |
| Payload | 비개발자 admin | admin 저장 → 수초 내 반영 (D1 eventual consistency) |

## 다음 측정 항목
- Lighthouse 모바일 Performance/LCP/FCP 3회 중앙값 (후보별)
- Keystatic·Decap/Sveltia (git기반) 추가 → 정적 계열 편집UX 비교
- Directus (헤드리스) — 호스팅 결정 후
- 편집 UX: 비개발자가 텍스트 1건 수정하는 단계 수 (후보별 실측)
