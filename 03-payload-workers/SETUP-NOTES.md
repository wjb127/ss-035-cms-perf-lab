# 03-payload-workers — 셋업 로그 (DX 측정용)

> 후보: **Payload on Workers** (공식 `with-cloudflare-d1` 템플릿)
> 스택: Next.js 15 + Payload 3 + D1(SQLite) + R2 + OpenNext(Cloudflare 어댑터)
> ⚠️ Workers **Paid 전용** (무료는 1MB 번들 한도, 유료 10MB)

## 셋업 명령
```bash
npx create-payload-app@latest -n 03-payload-workers -t with-cloudflare-d1 --use-pnpm --no-agent
cd 03-payload-workers && pnpm dev   # http://localhost:3000/admin
```
- dev 모드는 wrangler `getPlatformProxy`로 로컬 D1/R2 목을 자동 생성 → 첫 admin 요청 시 스키마 자동 push. 별도 마이그레이션 명령 불필요.

## 겪은 함정 (셋업 난이도에 반영)

### 1. scaffold 깨진 import (create-payload-app 3.85.1 버그)
- `src/payload.config.ts`에 `import migrations from './db/migrations'` 자동 주입됨.
- 그러나 해당 경로 파일 없음(`src/migrations/`에 존재) + buildConfig에서 미사용 → 모듈 로드 시 크래시.
- 공식 3.x 템플릿 원본엔 이 라인 자체가 없음. **해당 라인 삭제**로 해결.

### 2. ★ v3.85.0 회귀 — admin 500 (worker_threads / node:assert)
- 증상: `/`(프론트)는 200인데 `/admin`만 500.
  - 1차 에러: `Can't resolve 'worker_threads'` (pino-pretty)
  - 2차 에러: `node:assert ... Unhandled scheme` (undici)
- 원인 (payload#16757): PR #16495가 `resolveSignedURLKey`(서버 전용)를
  `@payloadcms/plugin-cloud-storage/exports/utilities` 배럴에 추가 →
  storage 어댑터의 `*ClientUploadHandler`가 그 배럴을 import하면서
  `payload/exports/internal`(로거=pino-pretty, safeFetch=undici)이
  **클라이언트 번들로 끌려들어감.** R2뿐 아니라 vercel-blob 등 모든 storage 어댑터 영향.
- node 빌트인 stub(webpack fallback)은 두더지잡기(worker_threads → node:assert → ...).
- **해결: 전 payload 패키지를 3.84.1로 핀백.** (공식 패치 미출시, 2026-06 기준)
  ```bash
  pnpm add payload@3.84.1 @payloadcms/next@3.84.1 @payloadcms/ui@3.84.1 \
    @payloadcms/richtext-lexical@3.84.1 @payloadcms/db-d1-sqlite@3.84.1 \
    @payloadcms/storage-r2@3.84.1
  ```
- → admin 200, "Create first user" 정상 렌더 확인(스크린샷).

### 3. peer dep 경고 (배포 단계 점검 필요)
- `@opennextjs/cloudflare`가 `next >=15.5.18` 요구하나 템플릿은 next 15.4.11.
- 로컬 dev엔 무관. **배포(`pnpm run deploy`) 전 next 버전/opennext 호환 점검 필요.**

## 상태
- [x] 로컬 dev 구동 + admin 렌더 확인
- [ ] 첫 admin 유저 생성
- [ ] 동일 랜딩 콘텐츠 적용 (baseline과 동일하게)
- [ ] CF 배포(Paid Workers) + D1/R2 프로비저닝
- [ ] Lighthouse(모바일) 3회 중앙값 + TTFB 측정 → results/comparison.md
