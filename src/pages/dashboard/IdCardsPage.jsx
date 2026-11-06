import { useMemo, useState } from 'react'
import {
  CreditCard, Eye, IdCard, Plus, Printer, Search, ShieldCheck, Users,
} from 'lucide-react'
import {
  Badge, Button, Card, EmptyState, Field, IconButton, Input, Modal, PageHeader,
  Pagination, SearchInput, Select, StatCard, Table,
} from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { school } from '../../data/mockData'
import { formatDate, initials, paginate, todayISO } from '../../lib/utils'
import { printHTML, documentHeader } from '../../lib/print'

const nextYear = () => {
  const d = new Date()
  d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

function CardPreview({ student, card }) {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-gov-800 px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-base font-extrabold text-gold-400 ring-1 ring-white/20">G</span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-extrabold">{school.name}</p>
            <p className="truncate text-[8px] text-navy-200/80">{school.board}</p>
          </div>
          <span className="ml-auto text-[8px] font-bold uppercase tracking-wider text-gold-400">Student ID</span>
        </div>
      </div>
      <div className="flex gap-3 p-4">
        <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-xl font-extrabold text-navy-800 ring-2 ring-white">
          {initials(student?.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-navy-900">{student?.name}</p>
          <p className="text-[10px] text-slate-500">Class {student?.grade}-{student?.section} · {student?.group}</p>
          <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px]">
            <p><span className="text-slate-400">Roll:</span> <span className="font-semibold text-slate-700">{student?.rollNo}</span></p>
            <p><span className="text-slate-400">House:</span> <span className="font-semibold text-slate-700">{student?.house}</span></p>
            <p><span className="text-slate-400">B-Form:</span> <span className="font-semibold text-slate-700">{student?.bForm?.slice(-8) || '—'}</span></p>
            <p><span className="text-slate-400">Blood:</span> <span className="font-semibold text-slate-700">{student?.bloodGroup}</span></p>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between border-t border-dashed border-slate-200 px-4 py-2.5">
        <div>
          <p className="text-[8px] uppercase tracking-wider text-slate-400">Card number</p>
          <p className="font-mono text-[10px] font-bold text-navy-900">{card?.cardNo || 'Not generated'}</p>
          <p className="mt-0.5 text-[8px] text-slate-400">Valid until {card?.validUntil ? formatDate(card.validUntil) : '—'}</p>
        </div>
        <div className="grid grid-cols-5 gap-0.5" aria-hidden="true">
          {Array.from({ length: 25 }).map((_, i) => (
            <span key={i} className={`h-1.5 w-1.5 ${i % 3 === 0 || i % 7 === 0 ? 'bg-navy-900' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>
      <div className="bg-slate-50 px-4 py-1.5 text-center text-[8px] text-slate-400">
        {school.address}
      </div>
    </div>
  )
}

export default function IdCardsPage() {
  const { user, linkedStudent } = useAuth()
  const { db, create, update } = useData()
  const toast = useToast()
  const role = user?.roleKey
  const isStudent = role === 'student'
  const students = db.students || []
  const cards = db.idcards || []

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(8)
  const [viewing, setViewing] = useState(null)
  const [genOpen, setGenOpen] = useState(false)
  const [genForm, setGenForm] = useState({ studentId: students[0]?.id || '', validUntil: nextYear(), status: 'Issued' })
  const [errors, setErrors] = useState({})

  const rows = useMemo(() => students.map((s) => {
    const card = cards.find((c) => c.studentId === s.id)
    return { ...s, card, cardStatus: card?.status || 'Not generated', cardNo: card?.cardNo || '—', validUntil: card?.validUntil || '' }
  }), [students, cards])

  const scoped = isStudent ? rows.filter((r) => r.id === linkedStudent?.id) : rows
  const filtered = scoped.filter((r) => {
    const q = query.trim().toLowerCase()
    const matchQ = !q || [r.name, r.rollNo, r.grade, r.cardNo].some((v) => String(v || '').toLowerCase().includes(q))
    return matchQ && (!status || r.cardStatus === status)
  })
  const pageRows = paginate(filtered, page, perPage)
  const issued = rows.filter((r) => r.cardStatus === 'Issued').length
  const pending = rows.filter((r) => r.cardStatus === 'Pending').length
  const missing = rows.filter((r) => r.cardStatus === 'Not generated').length

  const generate = (student, options = {}) => {
    if (!student) return
    const card = create('idcards', {
      studentId: student.id,
      studentName: student.name,
      class: `${student.grade}-${student.section}`,
      cardNo: `GHSNB-ID-2026-${String(cards.length + 1).padStart(4, '0')}`,
      issuedDate: todayISO(),
      validUntil: options.validUntil || nextYear(),
      status: options.status || 'Issued',
    })
    toast.success(`ID card generated for ${student.name}.`, 'Card ready')
    return card
  }

  const printCard = (student) => {
    const card = student.card
    if (!card) {
      toast.error('Generate an ID card before printing.', 'No card')
      return
    }
    printHTML('Student ID Card', `
      <div class="sheet">
        ${documentHeader()}
        <h2 class="doc-title">Student Identity Card</h2>
        <p class="doc-sub">Academic Year 2026–27 · Card ${card.cardNo}</p>
        <div style="max-width:420px;margin:20px auto;border:2px solid #0b2545;border-radius:14px;overflow:hidden">
          <div style="background:linear-gradient(120deg,#0b2545,#0f6b3d);color:#fff;padding:14px 18px">
            <p style="margin:0;font-size:15px;font-weight:800">${school.name}</p>
            <p style="margin:2px 0 0;font-size:10px;color:#c7d2fe">${school.board} · Student Identity Card</p>
          </div>
          <div style="display:flex;gap:14px;padding:16px 18px">
            <div style="width:74px;height:90px;border-radius:8px;background:#e2e8f0;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;color:#0b2545">${initials(student.name)}</div>
            <div style="flex:1">
              <p style="margin:0;font-size:16px;font-weight:800;color:#0b2545">${student.name}</p>
              <p style="margin:3px 0;font-size:11px;color:#475569">Class ${student.grade}-${student.section} · ${student.group} · Roll ${student.rollNo}</p>
              <p style="margin:3px 0;font-size:11px;color:#475569">Father / guardian: ${student.fatherName}</p>
              <p style="margin:3px 0;font-size:11px;color:#475569">B-Form: ${student.bForm}</p>
              <p style="margin:3px 0;font-size:11px;color:#475569">Blood group: ${student.bloodGroup} · House: ${student.house}</p>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;border-top:1px dashed #cbd5e1;padding:10px 18px;font-size:10px;color:#475569">
            <div><strong>Card no:</strong> ${card.cardNo}<br/><strong>Issued:</strong> ${formatDate(card.issuedDate)}</div>
            <div style="text-align:right"><strong>Valid until:</strong> ${formatDate(card.validUntil)}<br/><strong>Status:</strong> ${card.status}</div>
          </div>
          <div style="background:#f1f5f9;padding:6px 18px;font-size:9px;color:#64748b;text-align:center">${school.address} · ${school.phone}</div>
        </div>
        <p class="foot">Cut along the border and laminate. Demo ID card only.</p>
      </div>`)
    toast.success('ID card opened for printing.', 'Print ready')
  }

  const submitGenerate = (e) => {
    e.preventDefault()
    const student = students.find((s) => s.id === genForm.studentId)
    if (!student) { setErrors({ studentId: 'Select a student.' }); return }
    if (cards.some((c) => c.studentId === student.id)) {
      setErrors({ studentId: 'This student already has an ID card. Update the existing card instead.' })
      return
    }
    generate(student, genForm)
    setGenOpen(false)
  }

  return (
    <div>
      <PageHeader eyebrow="Records" title="Student ID cards"
        subtitle={isStudent ? 'Your digital student identity card. Print it for school use.' : 'Generate, issue and print student identity cards.'}
        actions={
          <>
            <Button variant="outline" icon={Printer} onClick={() => viewing && printCard(viewing)} disabled={!viewing}>Print selected</Button>
            {!isStudent ? <Button variant="season" icon={Plus} onClick={() => { setGenForm({ studentId: students[0]?.id || '', validUntil: nextYear(), status: 'Issued' }); setErrors({}); setGenOpen(true) }}>Generate card</Button> : null}
          </>
        } />

      {!isStudent ? (
        <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={CreditCard} label="Cards issued" value={issued} hint="Active student cards" tone="green" />
          <StatCard icon={ShieldCheck} label="Pending" value={pending} hint="Awaiting issue" tone="gold" />
          <StatCard icon={Users} label="Not generated" value={missing} hint="Students without a card" tone="rose" />
          <StatCard icon={IdCard} label="Total students" value={students.length} hint="Eligible for ID cards" tone="navy" />
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
            <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1) }} placeholder="Search student or card number…" className="flex-1" />
            {!isStudent ? <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} placeholder="All statuses" options={['Issued', 'Pending', 'Not generated']} className="w-auto w-[145px] py-2 text-xs" /> : null}
          </div>
          <Table
            columns={[
              { key: 'name', label: 'Student', primary: true, sub: 'rollNo' },
              { key: 'class', label: 'Class', render: (_, row) => `${row.grade}-${row.section}` },
              { key: 'cardNo', label: 'Card number' },
              { key: 'validUntil', label: 'Valid until', format: 'date' },
              { key: 'cardStatus', label: 'Status', format: 'badge' },
            ]}
            rows={pageRows}
            onRowClick={setViewing}
            empty={<EmptyState icon={Search} title="No cards found" message="Try another search or generate a card." />}
            actions={(row) => (
              <div className="flex items-center justify-end gap-0.5">
                <IconButton icon={Eye} label="View card" onClick={() => setViewing(row)} />
                {row.card ? <IconButton icon={Printer} label="Print card" onClick={() => printCard(row)} /> : null}
                {!isStudent && !row.card ? <IconButton icon={Plus} label="Generate card" className="text-emerald-600 hover:bg-emerald-50" onClick={() => generate(row)} /> : null}
                {!isStudent && row.card && row.card.status !== 'Issued' ? (
                  <IconButton icon={ShieldCheck} label="Mark issued" className="text-emerald-600 hover:bg-emerald-50" onClick={() => { update('idcards', row.card.id, { status: 'Issued', issuedDate: todayISO() }); toast.success('Card marked as issued.', 'Updated') }} />
                ) : null}
              </div>
            )}
          />
          {filtered.length > perPage ? <Pagination page={page} totalPages={Math.ceil(filtered.length / perPage)} total={filtered.length} perPage={perPage} onPage={setPage} onPerPage={(n) => { setPerPage(n); setPage(1) }} /> : null}
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-extrabold text-navy-900">Card preview</h2>
          {viewing ? (
            <>
              <CardPreview student={viewing} card={viewing.card} />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {viewing.card ? <Button variant="season" icon={Printer} onClick={() => printCard(viewing)}>Print card</Button> : null}
                {!viewing.card ? <Button variant="season" icon={Plus} onClick={() => { generate(viewing); setViewing({ ...viewing, card: { cardNo: 'Generating…', validUntil: nextYear(), status: 'Issued', issuedDate: todayISO() } }) }}>Generate card</Button> : null}
                <Button variant="outline" onClick={() => setViewing(null)}>Clear</Button>
              </div>
              {viewing.card ? <p className="mt-3 text-center text-[10px] text-slate-400">Issued {formatDate(viewing.card.issuedDate)} · Valid until {formatDate(viewing.card.validUntil)}</p> : null}
            </>
          ) : (
            <div className="py-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><IdCard size={24} /></span>
              <p className="mt-3 text-sm font-bold text-navy-900">Select a student</p>
              <p className="mt-1 text-xs text-slate-500">Choose a row to preview their ID card, then print it.</p>
            </div>
          )}
        </Card>
      </div>

      <Modal open={genOpen} onClose={() => setGenOpen(false)} title="Generate student ID card" subtitle="Issue a new card for a student without one." size="sm"
        footer={<><Button variant="outline" onClick={() => setGenOpen(false)}>Cancel</Button><Button variant="season" icon={CreditCard} onClick={submitGenerate}>Generate card</Button></>}>
        <form onSubmit={submitGenerate} className="space-y-4" noValidate>
          <Field label="Student" required error={errors.studentId}>
            <Select value={genForm.studentId} onChange={(e) => setGenForm((p) => ({ ...p, studentId: e.target.value }))}
              options={students.filter((s) => !cards.some((c) => c.studentId === s.id)).map((s) => ({ value: s.id, label: `${s.name} · ${s.grade}-${s.section}` }))} error={errors.studentId} />
          </Field>
          <Field label="Valid until"><Input type="date" value={genForm.validUntil} onChange={(e) => setGenForm((p) => ({ ...p, validUntil: e.target.value }))} /></Field>
          <Field label="Initial status"><Select value={genForm.status} onChange={(e) => setGenForm((p) => ({ ...p, status: e.target.value }))} options={['Issued', 'Pending']} /></Field>
          <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
        </form>
      </Modal>
    </div>
  )
}
