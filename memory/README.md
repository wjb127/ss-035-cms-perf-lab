# memory/

`/mem` 스킬로 관리되는 프로젝트 외장 기억소. 주제별 md 분할 저장.
필요한 챕터만 읽어서 컨텍스트 윈도우 절약.

일반 노트(`*.md`)는 **git 추적** → 다른 머신/세션에서 `git pull` 로 기억 복구.
시크릿·민감정보는 `memory/.private/` 에 격리(`.gitignore` 제외, 로컬 전용).

## 빠른 참조

- 비교 허브: https://ss035-hub.pages.dev
- 저장소: https://github.com/wjb127/ss-035-cms-perf-lab (퍼블릭)
- 라이브: baseline/keystatic/decap = `ss035-<name>.pages.dev`, payload = `ss035-payload-cms.seungbeen-dev.workers.dev`
- 배포: 정적은 `node build.mjs` + `wrangler pages deploy`, Payload는 opennext build/deploy

## 파일 인덱스

| 파일 | 언제 펴볼지 |
|---|---|
| `01-overview.md` | 랩 목적·canonical 구조·후보 추가 방법 |
| `02-deployments.md` | 라이브 URL, CF 리소스 이름/ID, 후보별 배포 명령 |
| `03-gotchas.md` | 셋업 함정 (payload 3.84.1 핀백, D1 지연, Directus BSL/CF불가, .test 이메일 등) |
| `04-findings.md` | 성능 비교 결과·카테고리별 추천·라이선스 주의 |
| `.private/00-secrets.md` | 라이브 admin 계정 (private, git 제외) |

## 사용

- 컨텍스트 복구: `/mem catchup`
- 키워드 검색: `/mem recall <키워드>`
- 새 메모: `/mem save <주제>`
- 한눈에 시각화: `/mem visualize`
