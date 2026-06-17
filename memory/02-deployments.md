# 배포 / 라이브 URL / CF 리소스

**최종 갱신**: 2026-06-17

언제 펴볼지: 라이브 URL, CF 리소스 이름/ID, 후보별 배포 명령이 필요할 때.

## 라이브 URL
| 후보 | URL | admin |
|---|---|---|
| 비교 허브 | https://ss035-hub.pages.dev | — |
| 00 baseline | https://ss035-baseline.pages.dev | — |
| 01 Keystatic | https://ss035-keystatic.pages.dev | 로컬 dev만 (/keystatic) |
| 02 Sveltia/Decap | https://ss035-decap.pages.dev | /admin |
| 03 Payload | https://ss035-payload-cms.seungbeen-dev.workers.dev | /admin |
| 04 Directus | (로컬 only) http://localhost:8055/admin | docker compose up |

- GitHub(퍼블릭): https://github.com/wjb127/ss-035-cms-perf-lab (계정 wjb127)

## Cloudflare 계정
- 계정: qhv147@gmail.com, Account ID `46e9985a2cd78037a239e6a0a1a4067d`
- wrangler 로그인돼 있음. Workers는 **Paid 플랜**(Payload 번들 10MB 한도 필요)

## 03 Payload (Workers) — 리소스
- Worker/D1/R2 이름 통일: `ss035-payload-cms`
- D1 database_id: `3ad6ced1-aa67-4094-9d8f-6fb4665a0bb4` (APAC) — wrangler.jsonc에 박힘(시크릿 아님)
- PAYLOAD_SECRET: 프로덕션은 `wrangler secret put`로 발급(레포/로컬 .env 분리). 값은 미보관.
- 배포(수동 제어, `--env=$CLOUDFLARE_ENV` 빈값 이슈 회피):
  1. `NODE_ENV=production PAYLOAD_SECRET=ignore pnpm payload migrate` (원격 D1)
  2. `pnpm exec opennextjs-cloudflare build`
  3. `pnpm exec opennextjs-cloudflare deploy`
  4. `printf "%s" "$(openssl rand -hex 32)" | npx wrangler secret put PAYLOAD_SECRET`

## 00/01/02 정적 — CF Pages
- 프로젝트: ss035-baseline / ss035-keystatic / ss035-decap
- `node build.mjs && npx wrangler pages deploy dist --project-name <p> --branch main --commit-dirty=true`
- 01-keystatic: 프로덕션 build는 순수 정적(KEYSTATIC 미설정). admin은 `KEYSTATIC=1 pnpm dev` 로컬만(로컬모드)

## 04 Directus — 로컬 Docker
- `cd 04-directus && docker compose up -d` → `node seed.mjs` (landing 싱글톤 생성+시드)
- admin http://localhost:8055/admin. 데이터는 04-directus/database/ (gitignore)
- ⚠️ CF Workers 불가. 프로덕션은 Vultr VPS(Docker) 또는 Directus Cloud

## 같이 보면 좋은 문서
- `03-gotchas.md` · `.private/00-secrets.md` (admin 계정)
