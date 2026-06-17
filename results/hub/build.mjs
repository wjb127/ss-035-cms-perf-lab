// 비교 허브 빌드 — candidates.json을 읽어 후보별 카드 + iframe 프리뷰 + 지표표 생성
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..', '..')
const cands = JSON.parse(readFileSync(resolve(root, 'shared/candidates.json'), 'utf8'))

const esc = (s = '') =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const statusBadge = (s) =>
  s === 'live'
    ? '<span class="badge b-live">LIVE</span>'
    : s === 'local'
      ? '<span class="badge b-local">로컬</span>'
      : '<span class="badge b-plan">예정</span>'

// 지표 비교표 행
const rows = cands
  .map(
    (c) => `      <tr>
        <td><b>${esc(c.name)}</b><div class="muted">${esc(c.id)}</div></td>
        <td><span class="cat">${esc(c.category)}</span></td>
        <td>${esc(c.cms)}</td>
        <td class="muted">${esc(c.stack)}</td>
        <td>${c.warmTtfb ? esc(c.warmTtfb) : '<span class="muted">—</span>'}</td>
        <td class="muted">${esc(c.editUx)}</td>
        <td>${statusBadge(c.status)}</td>
        <td>${c.url ? `<a href="${esc(c.url)}" target="_blank">열기 ↗</a>` : '<span class="muted">—</span>'}</td>
      </tr>`,
  )
  .join('\n')

// 라이브 후보 iframe 프리뷰
const previews = cands
  .map((c) => {
    const inner = c.url
      ? `<iframe src="${esc(c.url)}" loading="lazy" title="${esc(c.name)}"></iframe>`
      : c.status === 'local'
        ? `<div class="ph">로컬 데모 (CF 배포 불가)<br><span class="muted">${esc(c.stack)}</span><br><span class="muted">admin 스크린샷은 QA 리포트 참조</span></div>`
        : `<div class="ph">아직 배포 안 됨<br><span class="muted">${esc(c.stack)}</span></div>`
    return `      <figure class="preview">
        <figcaption>
          <span><b>${esc(c.name)}</b> <span class="cat">${esc(c.category)}</span></span>
          ${statusBadge(c.status)}
        </figcaption>
        ${inner}
        ${c.url ? `<a class="open" href="${esc(c.url)}" target="_blank">${esc(c.url)} ↗</a>` : ''}
      </figure>`
  })
  .join('\n')

const liveCount = cands.filter((c) => c.status === 'live').length

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>CMS 비교 허브 · ss-035</title>
<style>
  :root { --bg:#0b0d12; --soft:#12151d; --border:#232836; --text:#e8eaf0; --muted:#9aa3b2; --accent:#f97316; --live:#34d399; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font-family:system-ui,-apple-system,"Apple SD Gothic Neo",Pretendard,sans-serif; line-height:1.6; }
  .wrap { max-width:1180px; margin:0 auto; padding:48px 24px 96px; }
  h1 { font-size:clamp(26px,4vw,38px); font-weight:800; letter-spacing:-0.02em; margin:0 0 8px; }
  h2 { font-size:20px; font-weight:700; margin:48px 0 16px; }
  .sub { color:var(--muted); font-size:15px; margin:0; }
  a { color:var(--accent); }
  .muted { color:var(--muted); font-size:13px; }
  .cat { display:inline-block; font-size:11px; font-weight:700; padding:1px 8px; border-radius:6px; background:#1b2030; color:var(--muted); border:1px solid var(--border); }
  .badge { display:inline-block; font-size:11px; font-weight:700; padding:2px 9px; border-radius:999px; white-space:nowrap; }
  .b-live { background:rgba(52,211,153,.12); color:var(--live); border:1px solid rgba(52,211,153,.3); }
  .b-local { background:rgba(251,191,36,.12); color:#fbbf24; border:1px solid rgba(251,191,36,.3); }
  .b-plan { background:#1b2030; color:var(--muted); border:1px solid var(--border); }
  table { width:100%; border-collapse:collapse; font-size:14px; }
  th,td { text-align:left; padding:11px 12px; border-bottom:1px solid var(--border); vertical-align:top; }
  th { color:var(--muted); font-weight:600; font-size:12px; text-transform:uppercase; letter-spacing:.04em; }
  .previews { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; margin-top:18px; }
  @media (max-width:820px){ .previews { grid-template-columns:1fr; } }
  .preview { margin:0; background:var(--soft); border:1px solid var(--border); border-radius:14px; overflow:hidden; }
  .preview figcaption { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-bottom:1px solid var(--border); font-size:14px; }
  .preview iframe { width:100%; height:420px; border:0; background:#000; display:block; }
  .preview .ph { height:420px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; color:var(--muted); text-align:center; }
  .preview .open { display:block; padding:10px 14px; font-size:12px; border-top:1px solid var(--border); word-break:break-all; }
  footer { margin-top:56px; padding-top:24px; border-top:1px solid var(--border); color:var(--muted); font-size:13px; }
</style>
</head>
<body>
<div class="wrap">
  <h1>CMS 비교 허브</h1>
  <p class="sub">ss-035 · 동일 랜딩 콘텐츠/디자인을 여러 무료 CMS로 구현해 성능·편집UX·DX를 한자리에서 비교. 라이브 ${liveCount}/${cands.length}.</p>

  <h2>지표 비교표</h2>
  <table>
    <thead><tr><th>후보</th><th>카테고리</th><th>CMS</th><th>스택</th><th>웜 TTFB</th><th>편집 UX</th><th>상태</th><th>링크</th></tr></thead>
    <tbody>
${rows}
    </tbody>
  </table>
  <p class="muted">TTFB는 curl 기준 웜 상태 대략값. 정밀 Lighthouse는 후보 완성 후 추가. 모든 후보는 동일한 <code>shared/landing-content.json</code> + <code>shared/landing.css</code> 사용.</p>

  <h2>라이브 프리뷰 (나란히)</h2>
  <div class="previews">
${previews}
  </div>

  <footer>
    ss-035 CMS Perf Lab · 비교 허브 · <a href="https://github.com/wjb127/ss-035-cms-perf-lab">github.com/wjb127/ss-035-cms-perf-lab</a>
  </footer>
</div>
</body>
</html>
`

mkdirSync(resolve(__dirname, 'dist'), { recursive: true })
writeFileSync(resolve(__dirname, 'dist/index.html'), html)
console.log('hub → dist/index.html 생성 (' + html.length + ' bytes, 라이브 ' + liveCount + '/' + cands.length + ')')
