# ss-035 · CMS 성능 비교 랩 (Cloudflare 랜딩 + 무료 CMS)

> Cloudflare에 랜딩페이지를 올리고 **무료 CMS 툴들을 적용해 성능·편집UX·DX를 실측 비교**하는 테스트 랩. "어떤 무료 CMS가 클플 랜딩에 제일 맞나"를 숫자로 답한다.

## 목표
1. 동일 랜딩 콘텐츠를 여러 무료 CMS로 구현
2. 같은 조건(CF Pages/Workers 배포)에서 **런타임 성능 측정**
3. **편집 UX(비개발자 직접 수정) · 셋업 난이도 · CF 연동성**까지 종합 비교
4. 외주(km-*)에서 "CMS 붙여주세요" 요청 올 때 **검증된 1순위 추천 확보** (바퀴 재발명 방지 룰 실증)

## 핵심 가설 (테스트로 검증)
- **깃기반 정적(pre-render)** = 런타임 성능 최강(DB쿼리 0, CDN 엣지 서빙). 단 편집이 git commit 경유
- **엣지 CMS(D1/R2)** = DB쿼리 약간의 latency 감수하고 **비개발자 DB 편집 + 폼/게시판** 획득
- → "성능"만이면 정적이 이김. 근데 **운영주체가 비개발자면** 엣지/어드민형이 필요. 이 트레이드오프를 실측으로 박제

## 후보 CMS (카테고리별)

### Tier 1 — Cloudflare 엣지 네이티브 (D1/R2) ★ 글로벌 룰 1순위
| 후보 | 스택 | 특징 |
|---|---|---|
| **Payload on Workers** | Next.js + D1 + R2 | CF 공식 포팅, "Deploy to Cloudflare" 버튼, Form Builder·Blocks 플러그인. 폼/리드/이미지 CMS 그냥 줌 |
| **SonicJS** | Hono + D1 + R2 + TS | edge-native 헤드리스 |
| **EmDash** | Astro (CF 공식) | WP풍 admin |
| **cms-worker** | 최소 헤드리스 + R2 | iframe 라이브 프리뷰 |

### Tier 2 — 깃기반 / 정적 (CF Pages, 성능 최강 후보)
| 후보 | 스택 | 특징 |
|---|---|---|
| **Decap CMS** | git-based (구 Netlify CMS) | 무료·성숙, OAuth, DB 없음(커밋 편집) |
| **Sveltia CMS** | Decap 호환 | 더 빠르고 모던, Decap 대체 |
| **Keystatic** | Astro/Next, git or local | Thinkmill, 타입세이프, CF 호환 |
| **TinaCMS** | React/Next/Astro | git기반 + 비주얼/인라인 편집 |
| **Pages CMS** | git-based (pagescms.org) | 정적 사이트용 심플 CMS |

### Tier 3 — 셀프호스트 헤드리스 (참고군, 엣지 아님 → Vultr VPS)
- **Directus**(SQL 래핑 + 폴리시 admin) · **PocketBase**(단일 Go 바이너리 + SQLite) · **Strapi**(배터리 포함)

## 측정 지표
| 분류 | 항목 |
|---|---|
| **런타임 성능** | Lighthouse Performance / TTFB / LCP / FCP / 페이지 weight / 캐시 HIT |
| **빌드·배포** | 빌드 시간 / CF 연동 난이도 / 배포 단계 수 |
| **편집 UX** | 비개발자 편집 가능성 / 미리보기 / 이미지 업로드 / 폼·게시판 / 미디어 관리 |
| **DX** | 셋업 난이도 / 문서 / 타입세이프 / 마이그레이션 |
| **비용** | CF 무료티어 내 가능 여부 / 외부 의존 |

## 테스트 방법
1. `00-baseline` — CMS 없는 순수 정적 CF 랜딩(동일 콘텐츠) = **성능 기준점**
2. 각 후보를 `0N-<name>` 폴더로 구현(같은 랜딩 콘텐츠)
3. 동일 조건 배포(CF Pages 또는 Workers) 후 **Lighthouse(모바일) 3회 중앙값** + WebPageTest TTFB 측정
4. 결과를 `results/comparison.md` 표로 집계
5. 편집 UX는 "비개발자가 텍스트·이미지 1건 수정"을 직접 해보고 단계 수·체감 기록

## 폴더 구조 (실측 시 생성)
```
ss-035-cms-perf-lab/
├─ BRIEF.md
├─ 00-baseline/          ← 순수 정적 CF 랜딩 (기준점)
├─ 01-decap/             ← (예시) 깃기반
├─ 02-keystatic/
├─ 03-payload-workers/   ← 엣지 D1/R2
├─ 04-sonicjs/
└─ results/
   └─ comparison.md      ← 측정 표 집계
```

## ⚠️ 알려진 함정 (글로벌 룰)
- **Workers 런타임 FS 접근 불가** → migration SQL은 **빌드타임 번들 필수**(Payload on Workers·SonicJS 공통 함정)
- D1 무료한도(쓰기 10만 row/일 등) 내에서 테스트
- R2 이미지 업로드 시 egress 0원이지만 Class A/B 작업 한도 확인

## 추천 1차 테스트 순서
1. **00-baseline** (기준점)
2. **Keystatic** 또는 **Decap** (깃기반 정적 — 성능 상한 측정, 셋업 빠름)
3. **Payload on Workers** (엣지 풀CMS — 폼/게시판/이미지까지, 외주 1순위 후보 검증)
4. 필요 시 SonicJS·EmDash·Sveltia 추가

→ 1~3만 돌려봐도 "정적 vs 엣지" 성능 격차 + 편집UX 트레이드오프 결론 나옴

## 연결 메모
- 글로벌 CLAUDE.md "CMS / 콘텐츠 관리 개발" 룰의 실증 프로젝트
- 결과는 외주(km-220 biostream·km-프로젝트시민 등 CMS 필요건) 추천 근거로 재사용
- 배포 스킬: `/cf-deploy`, `/nextjs-cloudflare-deploy`, `/astro-cloudflare-deploy`
