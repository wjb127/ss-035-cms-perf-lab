# ss-035 CMS 비교 랩 — 개요/아키텍처

**최종 갱신**: 2026-06-17

언제 펴볼지: 랩 목적·구조·후보 추가 방법이 헷갈릴 때. canonical 콘텐츠 구조.

## 무엇
Cloudflare 랜딩에 무료 CMS들을 적용해 **성능·편집UX·DX를 실측 비교**하는 테스트 랩.
글로벌 CLAUDE.md "CMS / 콘텐츠 관리 개발" 룰(바퀴 재발명 방지)의 실증 프로젝트.

## 핵심 설계 — "한 랜딩, 여러 CMS" 공정 비교
모든 후보가 **동일 콘텐츠 + 동일 디자인**을 써야 비교가 공정 → 단일 소스:
- `shared/landing-content.json` — 콘텐츠 단일 소스 (hero/features/ctaSection/footerText/meta)
- `shared/landing.css` — 디자인 단일 소스 (.lp/.hero/.features/... 클래스, 다크테마)
- `shared/candidates.json` — 후보 레지스트리 (허브가 이걸로 표/iframe 자동 생성)

## 후보 5종 (카테고리)
| # | 폴더 | 카테고리 | 스택 |
|---|---|---|---|
| 00 | 00-baseline | 기준점(정적) | 순수 HTML/CSS, build.mjs로 생성 |
| 01 | 01-keystatic | git기반 | Astro 정적 + Keystatic 로컬모드 admin |
| 02 | 02-decap | git기반 | 정적 + Sveltia(Decap호환) admin(/admin) |
| 03 | 03-payload-workers | 엣지(D1+R2) | Next.js15 + Payload 3.84.1 + OpenNext |
| 04 | 04-directus | 헤드리스(셀프호스트) | Directus 11 + SQLite, Docker 로컬 |

## 후보 추가 방법 (재현 절차)
1. `0N-<name>/` 폴더 + `build.mjs`(정적류) 또는 프레임워크 셋업
2. `shared/landing-content.json` + `landing.css` 먹여서 동일 랜딩 생성
3. CF Pages/Workers 배포
4. `shared/candidates.json`에 항목 추가 (url/warmTtfb/status)
5. `results/hub/build.mjs` 재실행 → 허브 재배포 → 표/iframe 자동 반영

## 빌드/배포 패턴
- 정적 후보: `node build.mjs` → `npx wrangler pages deploy dist --project-name ss035-<name> --branch main --commit-dirty=true`
- Pages 프로젝트 최초 1회: `npx wrangler pages project create ss035-<name> --production-branch main`
- dist/는 gitignore (build.mjs로 재생성)

## 같이 보면 좋은 문서
- `02-deployments.md` — 라이브 URL, CF 리소스, 배포 명령 상세
- `03-gotchas.md` — 셋업 함정 (payload 핀백, D1 지연, Directus BSL 등)
- `04-findings.md` — 성능/결론
- `.private/00-secrets.md` — 라이브 admin 계정 (git 제외)
