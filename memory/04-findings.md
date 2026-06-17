# 비교 결과 / 결론

**최종 갱신**: 2026-06-17

언제 펴볼지: 외주에서 "CMS 붙여주세요" 올 때 추천 근거. 성능/트레이드오프 요약.

## Lighthouse 모바일 (lighthouse 13.4.0, 단일 실행)
| 후보 | Perf | FCP | LCP | SI |
|---|---|---|---|---|
| baseline / Keystatic / Sveltia | **100** | 0.8s | 0.8s | 0.8~1.1s |
| Payload | 98 | 1.4s | 1.7s | 3.9s |
- 정적/깃기반 3종 만점, Payload만 SI 3.9s로 확연. CLS/TBT 전부 0. "정적=성능상한" Lighthouse 재확인.

## TTFB (curl 웜 중앙값, 프로덕션)
| 후보 | 카테고리 | 웜 TTFB | 비고 |
|---|---|---|---|
| baseline | 정적 | ~47ms | 단일 HTML, CSS 인라인 |
| Keystatic | git기반 | ~50ms | Astro 정적 빌드 |
| Sveltia/Decap | git기반 | ~46ms | 정적 + admin |
| Payload | 엣지(D1) | ~220ms | force-dynamic, 매 요청 D1 조회 |
| Directus | 헤드리스 | (로컬 only) | CF 불가, 엣지 측정 불가 |

## 핵심 결론
- **정적/깃기반 3종 전부 ~50ms 군집 = 성능 상한.** CMS 종류 무관, 결과물이 정적이면 동일.
- Payload(엣지 DB)만 ~220ms — 비개발자 즉시 편집 + 폼/DB의 대가. 캐시/ISR로 축소 여지.

## 카테고리별 추천 (외주 의사결정)
- **성능 최우선 + 가끔 편집**: 깃기반(Keystatic/Sveltia) 또는 baseline. 단 편집→반영에 재빌드 + GitHub 인증 셋업.
- **비개발자 즉시 편집 + 폼/리드/이미지 + CF 단일스택**: **Payload on Workers** (느려도 admin 바로 반영). 글로벌 룰 1순위.
- **정밀 권한·관계형·헤드리스 API**: Directus. 단 BSL 라이선스(매출 $5M+ 유료) + 별도 서버(VPS/Cloud).

## 라이선스/호스팅 주의
- Payload/Keystatic/Sveltia: OSI 오픈소스(MIT 등) + CF 무료티어 운영 가능.
- Directus: BSL 1.1 (조건부 무료) + CF 불가.

## 미측정 (다음)
- Lighthouse 모바일 5종 정밀(Perf/LCP/FCP)
- 편집 UX 단계 수 실측(비개발자 텍스트 1건 수정 클릭 수)
- Directus를 Cloud/VPS 실배포해 엣지 성능

## 산출물
- 비교 허브: https://ss035-hub.pages.dev
- QA 리포트(Payload E2E): results/qa/report.html + screenshots/ (payload/decap/keystatic/directus admin 스샷)
- 결과표: results/comparison.md

## 같이 보면 좋은 문서
- `01-overview.md` · `02-deployments.md` · `03-gotchas.md`
