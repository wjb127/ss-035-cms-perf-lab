# CMS 성능 비교 결과

> 측정 환경: Cloudflare Workers (APAC), curl TTFB. Lighthouse는 추후 추가.

## TTFB (curl, 프로덕션)

| # | 후보 | 콜드 TTFB | 웜 TTFB(중앙값) | 비고 |
|---|---|---|---|---|
| 03 | Payload on Workers | ~1.96s | ~0.22s | `/` SSR + 매 요청 D1 글로벌 조회(force-dynamic) |
| 00 | baseline (정적) | — | — | 예정 (성능 상한 기준점) |

- 측정일: 2026-06-17
- 03 웜 TTFB 3회: 0.96 / 0.21 / 0.23s → 첫 요청은 콜드스타트, 이후 ~200ms.
- force-dynamic이라 캐시 없이 매 요청 D1을 읽음. 정적 캐시/ISR 적용 시 더 낮출 여지 있음(엣지 트레이드오프 측정 포인트).

## 다음 측정 항목
- Lighthouse 모바일 Performance/LCP/FCP 3회 중앙값
- 정적 baseline 대비 격차 (DB쿼리 0 vs 엣지 DB조회)
- 편집 UX: 비개발자가 텍스트 1건 수정하는 단계 수
