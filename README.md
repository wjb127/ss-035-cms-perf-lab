# ss-035 · CMS 성능 비교 랩

Cloudflare에 랜딩페이지를 올리고 **무료 CMS 툴들을 적용해 성능·편집UX·DX를 실측 비교**하는 테스트 랩.
"어떤 무료 CMS가 클플 랜딩에 제일 맞나"를 숫자로 답한다.

자세한 배경·가설·측정지표는 [`BRIEF.md`](./BRIEF.md) 참고.

## 진행 현황

| # | 후보 | 카테고리 | 상태 | 라이브 |
|---|---|---|---|---|
| 00 | baseline (순수 정적) | 기준점 | 예정 | — |
| 03 | **Payload on Workers** | 엣지(D1+R2) | ✅ 배포됨 | [링크](https://ss035-payload-cms.seungbeen-dev.workers.dev) |

## 03 · Payload on Workers

- 스택: Next.js 15 + Payload 3 + Cloudflare D1(SQLite) + R2 + OpenNext
- 공식 `with-cloudflare-d1` 템플릿 기반. admin에서 편집하는 `Landing` 글로벌을 프론트가 렌더.
- 라이브: https://ss035-payload-cms.seungbeen-dev.workers.dev
  - `/` 랜딩 · `/admin` 관리자 패널
- 셋업 함정·버전 핀백 기록: [`03-payload-workers/SETUP-NOTES.md`](./03-payload-workers/SETUP-NOTES.md)

### 로컬 실행
```bash
cd 03-payload-workers
pnpm install
pnpm dev   # http://localhost:3000
```

### 배포 (Cloudflare Workers Paid 필요)
```bash
cd 03-payload-workers
pnpm wrangler login
# D1/R2 생성 후 wrangler.jsonc에 id/name 반영
NODE_ENV=production PAYLOAD_SECRET=ignore pnpm payload migrate   # 원격 D1 마이그레이션
pnpm exec opennextjs-cloudflare build
pnpm exec opennextjs-cloudflare deploy
printf "%s" "$(openssl rand -hex 32)" | pnpm wrangler secret put PAYLOAD_SECRET
```

> 시크릿(`PAYLOAD_SECRET`)은 `.env`(로컬)·Worker secret(프로덕션)으로만 관리. 레포에 절대 커밋하지 않는다.
