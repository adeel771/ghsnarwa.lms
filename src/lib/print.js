import { school } from '../data/mockData'

const baseStyles = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 28px;
    font-family: "Segoe UI", "Plus Jakarta Sans", Arial, sans-serif;
    color: #0f172a;
    background: #fff;
    font-size: 13px;
    line-height: 1.5;
  }
  .sheet { max-width: 780px; margin: 0 auto; }
  .doc-head { display: flex; align-items: center; gap: 16px; border-bottom: 3px solid #0b2545; padding-bottom: 14px; }
  .crest { width: 64px; height: 64px; border-radius: 14px; background: linear-gradient(135deg,#0b2545,#0f6b3d); color:#f4c95d; display:flex; align-items:center; justify-content:center; font-size:26px; font-weight:800; flex:none; }
  .doc-head h1 { margin: 0; font-size: 20px; color: #0b2545; letter-spacing: -0.2px; }
  .doc-head p { margin: 2px 0; color: #475569; font-size: 11px; }
  .doc-title { margin: 22px 0 4px; text-align:center; font-size: 17px; letter-spacing: 1.4px; text-transform: uppercase; color:#0b2545; }
  .doc-sub { text-align:center; color:#64748b; font-size:11px; margin-bottom:18px; }
  .grid { display:grid; grid-template-columns: repeat(2, 1fr); gap: 8px 24px; margin: 16px 0; }
  .row { display:flex; justify-content:space-between; gap:12px; border-bottom:1px dotted #cbd5e1; padding:5px 0; }
  .row span:first-child { color:#64748b; }
  .row span:last-child { font-weight:600; }
  table { width:100%; border-collapse:collapse; margin:14px 0; }
  th, td { border:1px solid #cbd5e1; padding:7px 9px; text-align:left; font-size:12px; }
  th { background:#eef3f9; color:#0b2545; font-size:11px; text-transform:uppercase; letter-spacing:.5px; }
  tfoot td { font-weight:700; background:#f8fafc; }
  .muted { color:#64748b; }
  .big { font-size:22px; font-weight:800; color:#0b2545; }
  .badge { display:inline-block; padding:2px 8px; border-radius:999px; background:#ecfdf3; color:#0f6b3d; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.5px; }
  .sign { display:flex; justify-content:space-between; margin-top:54px; gap:30px; }
  .sign div { flex:1; border-top:1px solid #94a3b8; padding-top:6px; text-align:center; color:#475569; font-size:11px; }
  .foot { margin-top:28px; border-top:1px solid #e2e8f0; padding-top:8px; color:#94a3b8; font-size:10px; text-align:center; }
  .watermark { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; font-size:120px; font-weight:800; color:rgba(11,37,69,.035); transform:rotate(-22deg); pointer-events:none; z-index:0; }
  .sheet { position:relative; z-index:1; }
  @media print { body { padding:0; } .no-print { display:none; } }
`

export const documentHeader = () => `
  <div class="doc-head">
    <div class="crest">G</div>
    <div>
      <h1>${school.name}</h1>
      <p>${school.address}</p>
      <p>${school.phone} · ${school.email} · ${school.board}</p>
    </div>
  </div>
`

export const printHTML = (title, bodyHTML) => {
  const win = window.open('', '_blank', 'width=900,height=1000')
  if (!win) {
    alert('Please allow pop-ups to print this document.')
    return
  }
  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>${baseStyles}</style></head><body><div class="watermark">GHSNB</div>${bodyHTML}</body></html>`)
  win.document.close()
  win.focus()
  setTimeout(() => {
    win.print()
  }, 350)
}

export const printReceipt = ({ title = 'Fee Receipt', rows = [], table = '', footerNote = '' }) => {
  const body = `
    <div class="sheet">
      ${documentHeader()}
      <h2 class="doc-title">${title}</h2>
      <p class="doc-sub">Academic Year ${school.academicYear} · Generated ${new Date().toLocaleDateString('en-GB')}</p>
      <div class="grid">
        ${rows.map(([label, value]) => `<div class="row"><span>${label}</span><span>${value ?? '—'}</span></div>`).join('')}
      </div>
      ${table}
      ${footerNote ? `<p class="muted" style="font-size:11px">${footerNote}</p>` : ''}
      <div class="sign">
        <div>Received by</div>
        <div>Accounts Officer</div>
        <div>Principal</div>
      </div>
      <p class="foot">This is a computer-generated document from the GHS Narwa Bajmore Digital LMS. Demo data only.</p>
    </div>`
  printHTML(title, body)
}

export const printTable = (title, columns, rows, meta = []) => {
  const head = columns.map((c) => `<th>${c.label}</th>`).join('')
  const body = rows
    .map((row) => `<tr>${columns.map((c) => `<td>${row[c.key] ?? '—'}</td>`).join('')}</tr>`)
    .join('')
  const html = `
    <div class="sheet">
      ${documentHeader()}
      <h2 class="doc-title">${title}</h2>
      <p class="doc-sub">Generated ${new Date().toLocaleDateString('en-GB')}</p>
      ${meta.length ? `<div class="grid">${meta.map(([l, v]) => `<div class="row"><span>${l}</span><span>${v}</span></div>`).join('')}</div>` : ''}
      <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
      <p class="foot">Government High School Narwa Bajmore · Digital LMS · Demo data only</p>
    </div>`
  printHTML(title, html)
}
