# CMS 성능 비교 결과

> 측정 환경: Cloudflare (APAC), curl TTFB. 모든 후보는 동일한 `shared/landing-content.json` + `shared/landing.css` 사용 (콘텐츠·디자인 단일 소스).
> **비교 허브: https://ss035-hub.pages.dev** (라이브 나란히 비교)

## TTFB (curl, 프로덕션)

| # | 후보 | 카테고리 | 콜드 TTFB | 웜 TTFB(중앙값) | 비고 |
|---|---|---|---|---|---|
| 00 | baseline (정적) | 기준점 | ~0.42s | **~0.05s** | 순수 HTML/CSS 단일 파일, CF Pages 엣지 |
| 01 | Keystatic | git기반 | ~0.44s | **~0.05s** | Astro 정적 빌드(빌드타임 reader), admin은 로컬/GitHub |
| 02 | Sveltia/Decap | git기반 | ~0.36s | **~0.05s** | 정적 + Sveltia admin(/admin), GitHub 백엔드 |
| 03 | Payload on Workers | 엣지(D1+R2) | ~1.96s | ~0.22s | SSR + 매 요청 D1 글로벌 조회(force-dynamic) |
| 04 | Directus | 헤드리스(셀프호스트) | 로컬 only* | 로컬 only* | Docker+SQLite 로컬 데모. CF 불가, 엣지 측정 불가(*localhost는 비교 무의미) |

- 측정일: 2026-06-17
- **정적(baseline) vs 엣지CMS(Payload): 웜 TTFB 약 4배 격차** (~50ms vs ~220ms). 가설대로 정적이 성능 상한.
- baseline은 DB쿼리 0, 단일 정적 파일 → CDN 엣지에서 즉시 서빙.
- Payload는 force-dynamic이라 매 요청 D1 읽음. 캐시/ISR 적용 시 격차 축소 여지(트레이드오프 측정 포인트).
- **정적/깃기반 3종(baseline·Keystatic·Sveltia) 모두 웜 ~50ms로 군집** → CMS 종류 무관, 결과물이 정적이면 성능 동일(상한). 엣지DB(Payload)만 ~220ms.

## 라이브 URL

| 후보 | URL |
|---|---|
| 비교 허브 | https://ss035-hub.pages.dev |
| 00 baseline | https://ss035-baseline.pages.dev |
| 01 Keystatic | https://ss035-keystatic.pages.dev |
| 02 Sveltia/Decap | https://ss035-decap.pages.dev (admin: /admin) |
| 03 Payload | https://ss035-payload-cms.seungbeen-dev.workers.dev (admin: /admin) |

## 편집 UX (초기 관찰)

| 후보 | 편집 주체 | 반영 방식 | 라이브 편집 조건 |
|---|---|---|---|
| baseline | 개발자만 | 코드 수정 → 재빌드 → 재배포 | — |
| Keystatic | 비개발자 admin | 파일 편집 → 재빌드 | 로컬모드(dev)는 즉시 / 프로덕션은 GitHub모드+git연동 Pages |
| Sveltia/Decap | 비개발자 admin | GitHub 커밋 → 재빌드 | GitHub OAuth 설정 필요(Access Token 로그인도 가능) |
| Payload | 비개발자 admin | admin 저장 → 수초 내 반영 (D1 eventual consistency) | 바로 됨(이미 라이브) |

> 핵심 트레이드오프: **깃기반(Keystatic/Sveltia)은 성능 최강(~50ms)이지만 편집→반영에 재빌드 필요 + GitHub 인증 셋업.** Payload는 느리지만(~220ms) 비개발자가 바로 저장하면 즉시 반영.

## 라이선스 / 호스팅 주의 (실측 발견)
- **Directus는 BSL 1.1 라이선스** (2025 변경). 순수 오픈소스(OSI) 아님 — "연 매출/펀딩/예산 $5M 미만"만 무료, 초과 시 유료. admin 진입 시 project owner 등록 모달로 고지됨.
- **Directus는 CF Workers에 못 올림** (Node 상시 서버). 프로덕션은 Vultr VPS(Docker) 또는 Directus Cloud 필요. 이번엔 로컬 Docker로 admin/편집UX만 검증.
- Payload/Keystatic/Sveltia는 MIT 등 OSI 오픈소스 + CF 무료티어 내 운영 가능.

## 카테고리별 한 줄 결론
- **성능만**: baseline = Keystatic = Sveltia (정적, ~50ms). CMS 종류 무관, 결과물이 정적이면 동일.
- **비개발자 즉시 편집 + 폼/DB**: Payload on Workers (엣지, ~220ms 감수). CF 단일 스택.
- **정밀 권한·관계형 데이터·헤드리스 API**: Directus. 단 BSL 라이선스 + 별도 서버(VPS/Cloud).

## 다음 측정 항목
- Lighthouse 모바일 Performance/LCP/FCP 3회 중앙값 (후보별)
- Keystatic·Decap/Sveltia (git기반) 추가 → 정적 계열 편집UX 비교
- Directus (헤드리스) — 호스팅 결정 후
- 편집 UX: 비개발자가 텍스트 1건 수정하는 단계 수 (후보별 실측)
