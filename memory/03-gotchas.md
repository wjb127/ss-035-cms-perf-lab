# 셋업 함정 (gotchas)

**최종 갱신**: 2026-06-17

언제 펴볼지: 후보 셋업/배포 막힐 때, 같은 삽질 반복 방지.

## Payload on Workers
- **★ v3.85.0 회귀 (payload#16757)**: admin 500. storage 어댑터의 ClientUploadHandler가
  `plugin-cloud-storage/exports/utilities` 배럴 통해 서버 전용 코드(pino-pretty→worker_threads,
  undici→node:assert)를 클라이언트 번들로 끌어옴. node 빌트인 stub은 두더지잡기.
  → **해결: 전 payload 패키지 3.84.1 핀백** (payload, @payloadcms/next·ui·richtext-lexical·db-d1-sqlite·storage-r2). 공식 패치 나오면 해제.
- **scaffold 버그**: create-payload-app 3.85.1이 payload.config.ts에 깨진 import
  `import migrations from './db/migrations'` 주입(파일 없음+미사용). 삭제. 공식 3.x엔 없음.
- **빌드 chicken-egg**: `next build`/opennext build가 빌드 중 원격 바인딩(edge-preview 프록시)을
  탐 → **D1/R2 먼저 생성 + wrangler.jsonc에 실제 id 넣어야 빌드 통과**. 리소스 프로비저닝이 빌드보다 먼저.
- wrangler.jsonc 바인딩명은 config가 참조하는 `D1`/`R2` 유지 (wrangler 제안 이름 쓰지 말 것).
- opennext가 next>=15.5.18 peer 요구하나 템플릿 15.4.11 — 경고만, 로컬/배포 동작은 OK.

## Payload 런타임
- **D1 eventual consistency**: admin 저장 직후 공개 `/`가 잠깐 옛 값 → 수초 내 수렴.
  cache-control은 no-store(HTTP캐시 아님). 원격 D1 읽기 일관성 지연. "즉시 100% 반영" 아님.
- 콜드스타트 TTFB ~2s, 웜 ~0.2s.
- 이메일 어댑터 미설정 → 비번재설정/알림메일 콘솔만(발송 X). 로그인은 무관.

## Keystatic (Astro)
- 프로덕션 build를 순수 정적으로 두려면 astro.config에서 keystatic 통합을 env 게이트:
  `KEYSTATIC=1`일 때만 react()+keystatic() 주입 → build는 어댑터 불필요한 정적, dev만 admin SSR.
- index.astro는 빌드타임 reader(`createReader(process.cwd(), config)`)로 싱글톤 읽음 + JSON fallback.
- 로컬모드 admin은 dev 전용(FS 필요) → CF 배포본엔 admin 없음. 프로덕션 라이브 편집은 GitHub 모드 필요.

## Sveltia/Decap
- admin = 정적 `/admin/index.html`(CDN 스크립트) + `/admin/config.yml`. 프레임워크 불필요.
- config 파일이 JSON 전체를 덮어쓰므로 **관리 안 하는 필드(meta 등)도 config에 넣어야 유실 안 됨**.
- 라이브 편집은 GitHub OAuth 백엔드 필요(또는 Access Token 로그인). admin UI 자체는 인증 전에도 뜸.

## Directus
- **`.test` TLD 이메일 거부** — ADMIN_EMAIL은 유효 도메인(admin@example.com 등) 써야 부트스트랩 성공.
- **BSL 1.1 라이선스**(2025~) — OSI 오픈소스 아님. 매출/펀딩/예산 $5M 미만만 무료. admin 진입 시 owner 등록 모달.
- **CF Workers 불가** (Node 상시서버). VPS/Cloud 필요. 이번엔 로컬 Docker(SQLite)로만.
- 싱글톤 컬렉션: POST /collections에 fields 인라인 + meta.singleton:true. 시드는 PATCH /items/<collection>.

## 공통
- 정적 후보 dist/는 gitignore, build.mjs로 재생성.
- 루트 .gitignore: `/*.png`(루트 스샷만), node_modules, dist/, .astro/, .env*, memory/.private/, 04-directus/database·uploads.

## 같이 보면 좋은 문서
- `02-deployments.md` · `04-findings.md`
