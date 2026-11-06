import { useMemo, useState } from 'react'
import {
  Banknote, CheckCircle2, Download, Eye, Plus, Printer, Receipt, Search, Trash2,
  Wallet, AlertTriangle, Users, Pencil,
} from 'lucide-react'
import {
  Badge, Button, Card, ConfirmDialog, EmptyState, Field, IconButton, Input, Modal,
  PageHeader, Pagination, SearchInput, Select, StatCard, Table,
} from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { school } from '../../data/mockData'
import { downloadCSV, formatDate, formatPKR, paginate, todayISO, uid } from '../../lib/utils'
import { printReceipt, printHTML, documentHeader } from '../../lib/print'

const MONTHS = ['August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April', 'May', 'June']
const METHODS = ['Cash', 'Bank Transfer', 'EasyPaisa', 'JazzCash', 'Cheque']
const payable = (fee) => Number(fee?.amount || 0) + Number(fee?.fine || 0) - Number(fee?.discount || 0)

export default function FeesPage() {
  const { user, linkedStudent, children: myChildren } = useAuth()
  const { db, create, update, remove } = useData()
  const toast = useToast()
  const role = user?.roleKey
  const isLearner = role === 'student' || role === 'parent'
  const fees = db.fees || []
  const students = db.students || []

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [month, setMonth] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(8)
  const [viewing, setViewing] = useState(null)
  const [paying, setPaying] = useState(null)
  const [payForm, setPayForm] = useState({ method: 'Cash', paidDate: todayISO(), receivedBy: user?.name || '' })
  const [payError, setPayError] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({})
  const [addErrors, setAddErrors] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [selectedChild, setSelectedChild] = useState(myChildren[0]?.id || linkedStudent?.id || '')

  const learnerStudent = role === 'parent'
    ? (myChildren.find((c) => c.id === selectedChild) || myChildren[0])
    : (linkedStudent || students[0])

  const scoped = isLearner
    ? fees.filter((f) => f.studentId === learnerStudent?.id)
    : fees

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return scoped.filter((f) => {
      const matchQ = !q || [f.studentName, f.voucherNo, f.studentId, f.grade, f.month].some((v) => String(v || '').toLowerCase().includes(q))
      return matchQ && (!status || f.status === status) && (!month || f.month === month)
    })
  }, [scoped, query, status, month])

  const sorted = useMemo(() => [...filtered].sort((a, b) => String(b.dueDate).localeCompare(String(a.dueDate))), [filtered])
  const pageRows = paginate(sorted, page, perPage)
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage))

  const paid = scoped.filter((f) => f.status === 'Paid')
  const unpaid = scoped.filter((f) => f.status !== 'Paid')
  const collected = paid.reduce((s, f) => s + payable(f), 0)
  const outstanding = unpaid.reduce((s, f) => s + payable(f), 0)

  const openPay = (fee) => {
    setPaying(fee)
    setPayError('')
    setPayForm({ method: 'Cash', paidDate: todayISO(), receivedBy: user?.name || '' })
  }

  const submitPayment = (e) => {
    e.preventDefault()
    if (!payForm.method) { setPayError('Select a payment method.'); return }
    if (!payForm.paidDate) { setPayError('Select the payment date.'); return }
    update('fees', paying.id, {
      status: 'Paid',
      method: payForm.method,
      paidDate: payForm.paidDate,
      receivedBy: payForm.receivedBy || user?.name || 'Accounts Office',
    })
    toast.success(`Payment of ${formatPKR(payable(paying))} recorded for ${paying.studentName}.`, 'Receipt issued')
    setPaying(null)
  }

  const openAdd = () => {
    setAddForm({ studentId: students[0]?.id || '', month: 'November', amount: 2500, fine: 0, discount: 0, dueDate: '2026-11-10', status: 'Unpaid' })
    setAddErrors({})
    setAddOpen(true)
  }

  const submitAdd = (e) => {
    e.preventDefault()
    const next = {}
    if (!addForm.studentId) next.studentId = 'Select a student.'
    if (!addForm.amount || Number(addForm.amount) <= 0) next.amount = 'Enter an amount greater than zero.'
    if (!addForm.dueDate) next.dueDate = 'Select a due date.'
    setAddErrors(next)
    if (Object.keys(next).length) return
    const student = students.find((s) => s.id === addForm.studentId)
    create('fees', {
      voucherNo: `V-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: student.id,
      studentName: student.name,
      grade: `${student.grade}-${student.section}`,
      month: addForm.month,
      amount: Number(addForm.amount),
      fine: Number(addForm.fine) || 0,
      discount: Number(addForm.discount) || 0,
      status: addForm.status,
      dueDate: addForm.dueDate,
      paidDate: addForm.status === 'Paid' ? todayISO() : '',
      method: addForm.status === 'Paid' ? 'Cash' : '',
      receivedBy: addForm.status === 'Paid' ? user?.name || 'Accounts Office' : '',
    })
    toast.success(`Fee voucher created for ${student.name}.`, 'Voucher generated')
    setAddOpen(false)
  }

  const printVoucher = (fee) => {
    printHTML('Fee Voucher', `
      <div class="sheet">
        ${documentHeader()}
        <h2 class="doc-title">Fee Voucher</h2>
        <p class="doc-sub">Academic Year 2026–27 · Due ${formatDate(fee.dueDate)}</p>
        <div class="grid">
          <div class="row"><span>Voucher no</span><span>${fee.voucherNo}</span></div>
          <div class="row"><span>Student</span><span>${fee.studentName}</span></div>
          <div class="row"><span>Class</span><span>${fee.grade}</span></div>
          <div class="row"><span>Month</span><span>${fee.month} 2026</span></div>
          <div class="row"><span>Tuition fee</span><span>${formatPKR(fee.amount)}</span></div>
          <div class="row"><span>Late fee</span><span>${formatPKR(fee.fine || 0)}</span></div>
          <div class="row"><span>Discount</span><span>${formatPKR(fee.discount || 0)}</span></div>
          <div class="row"><span>Payable</span><span>${formatPKR(payable(fee))}</span></div>
          <div class="row"><span>Status</span><span>${fee.status}</span></div>
        </div>
        <p class="muted" style="font-size:11px;margin-top:12px">Pay at the school accounts office, any Bank of Khyber branch, or via EasyPaisa/JazzCash using the school account. Keep this voucher as proof of payment.</p>
        <div class="sign"><div>Parent / Guardian</div><div>Accounts Officer</div><div>Principal</div></div>
        <p class="foot">Computer-generated fee voucher · ${school.name} · Demo data only</p>
      </div>`)
    toast.success('Fee voucher opened for printing.', 'Print ready')
  }

  const printFeeReceipt = (fee) => {
    printReceipt({
      title: 'Fee Payment Receipt',
      rows: [
        ['Receipt / voucher', fee.voucherNo],
        ['Student', fee.studentName],
        ['Class', fee.grade],
        ['Month', `${fee.month} 2026`],
        ['Tuition fee', formatPKR(fee.amount)],
        ['Late fee', formatPKR(fee.fine || 0)],
        ['Discount', formatPKR(fee.discount || 0)],
        ['Amount paid', formatPKR(payable(fee))],
        ['Payment method', fee.method || '—'],
        ['Paid on', formatDate(fee.paidDate)],
        ['Received by', fee.receivedBy || 'Accounts Office'],
      ],
      footerNote: 'This is a computer-generated receipt. Demo payments do not transfer real money.',
    })
    toast.success('Fee receipt opened for printing.', 'Print ready')
  }

  const exportCsv = () => {
    downloadCSV(`fees-${todayISO()}.csv`, sorted, [
      { key: 'voucherNo', label: 'Voucher' }, { key: 'studentName', label: 'Student' }, { key: 'grade', label: 'Class' },
      { key: 'month', label: 'Month' }, { key: 'amount', label: 'Amount' }, { key: 'fine', label: 'Fine' },
      { key: 'discount', label: 'Discount' }, { key: 'status', label: 'Status' }, { key: 'dueDate', label: 'Due date' },
    ])
    toast.success(`${sorted.length} fee records exported.`, 'CSV ready')
  }

  return (
    <div>
      <PageHeader eyebrow="Finance" title={isLearner ? 'Fees & vouchers' : 'Fees & vouchers'}
        subtitle={isLearner ? 'View your monthly fee vouchers, payment status and printable receipts.' : 'Collect fees, generate vouchers, record payments and print official receipts.'}
        actions={
          <>
            <Button variant="outline" icon={Download} onClick={exportCsv}>Export</Button>
            {!isLearner ? <Button variant="season" icon={Plus} onClick={openAdd}>Generate voucher</Button> : null}
          </>
        } />

      {role === 'parent' && myChildren.length > 1 ? (
        <div className="mb-4">
          <Select value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)} className="w-72"
            options={myChildren.map((c) => ({ value: c.id, label: `${c.name} · Grade ${c.grade}-${c.section}` }))} />
        </div>
      ) : null}

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Total collected" value={formatPKR(collected)} hint={`${paid.length} paid vouchers`} tone="green" />
        <StatCard icon={AlertTriangle} label="Outstanding" value={formatPKR(outstanding)} hint={`${unpaid.length} unpaid or overdue`} tone="gold" />
        <StatCard icon={Receipt} label="Vouchers" value={scoped.length} hint={isLearner ? 'This session' : 'All students'} tone="navy" />
        <StatCard icon={Users} label="Paid ratio" value={`${scoped.length ? Math.round((paid.length / scoped.length) * 100) : 0}%`} hint="Cleared invoices" tone="sky" />
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
          <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1) }} placeholder="Search by student, voucher or class…" className="flex-1" />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} placeholder="All statuses"
              options={['Paid', 'Unpaid', 'Overdue', 'Partial']} className="w-auto w-[135px] py-2 text-xs" />
            <Select value={month} onChange={(e) => { setMonth(e.target.value); setPage(1) }} placeholder="All months"
              options={MONTHS} className="w-auto w-[130px] py-2 text-xs" />
            {(query || status || month) ? <Button variant="ghost" size="sm" onClick={() => { setQuery(''); setStatus(''); setMonth('') }}>Clear</Button> : null}
          </div>
        </div>

        <Table
          columns={[
            { key: 'voucherNo', label: 'Voucher', primary: true, sub: 'studentName' },
            { key: 'grade', label: 'Class' },
            { key: 'month', label: 'Month' },
            { key: 'amount', label: 'Amount', format: 'currency' },
            { key: 'dueDate', label: 'Due date', format: 'date' },
            { key: 'status', label: 'Status', format: 'badge' },
          ]}
          rows={pageRows}
          onRowClick={setViewing}
          empty={<EmptyState icon={Receipt} title="No vouchers found" message="Try clearing the filters or generate a new voucher." />}
          actions={(row) => (
            <div className="flex items-center justify-end gap-0.5">
              <IconButton icon={Eye} label="View voucher" onClick={() => setViewing(row)} />
              <IconButton icon={Printer} label={row.status === 'Paid' ? 'Print receipt' : 'Print voucher'}
                onClick={() => (row.status === 'Paid' ? printFeeReceipt(row) : printVoucher(row))} />
              {!isLearner && row.status !== 'Paid' ? <IconButton icon={Banknote} label="Record payment" className="text-emerald-600 hover:bg-emerald-50" onClick={() => openPay(row)} /> : null}
              {!isLearner ? <IconButton icon={Trash2} label="Delete voucher" className="text-rose-500 hover:bg-rose-50" onClick={() => setDeleteTarget(row)} /> : null}
            </div>
          )}
        />
        <Pagination page={page} totalPages={totalPages} total={sorted.length} perPage={perPage}
          onPage={(p) => setPage(Math.min(totalPages, Math.max(1, p)))} onPerPage={(n) => { setPerPage(n); setPage(1) }} />
      </Card>

      {/* View voucher */}
      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Fee voucher" subtitle={viewing?.voucherNo} size="md"
        footer={viewing ? (
          <>
            <Button variant="outline" icon={Printer} onClick={() => printVoucher(viewing)}>Print voucher</Button>
            {viewing.status === 'Paid' ? <Button variant="outline" icon={Receipt} onClick={() => printFeeReceipt(viewing)}>Print receipt</Button> : null}
            {!isLearner && viewing.status !== 'Paid' ? <Button variant="season" icon={Banknote} onClick={() => { setViewing(null); openPay(viewing) }}>Record payment</Button> : null}
            <Button variant="primary" onClick={() => setViewing(null)}>Close</Button>
          </>
        ) : null}>
        {viewing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</p>
                <p className="text-base font-extrabold text-navy-900">{viewing.studentName}</p>
                <p className="text-xs text-slate-500">Class {viewing.grade} · {viewing.month} 2026</p>
              </div>
              <Badge tone={viewing.status === 'Paid' ? 'green' : viewing.status === 'Overdue' ? 'red' : 'amber'}>{viewing.status}</Badge>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                ['Tuition fee', formatPKR(viewing.amount)],
                ['Late fee', formatPKR(viewing.fine || 0)],
                ['Discount', formatPKR(viewing.discount || 0)],
                ['Total payable', formatPKR(payable(viewing))],
                ['Due date', formatDate(viewing.dueDate)],
                ['Paid on', viewing.paidDate ? formatDate(viewing.paidDate) : '—'],
                ['Payment method', viewing.method || '—'],
                ['Received by', viewing.receivedBy || '—'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-100 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-700">{value}</p>
                </div>
              ))}
            </div>
            {viewing.status !== 'Paid' ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-800">
                <p className="font-bold">How to pay</p>
                <p className="mt-1">Pay at the school accounts office (Monday–Saturday, 8:30 am – 1:30 pm), at any Bank of Khyber branch, or via EasyPaisa/JazzCash to the school account. This demo does not process real payments — recording a payment only updates the local demo database.</p>
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[11px] text-emerald-800">
                <p className="font-bold">Payment cleared</p>
                <p className="mt-1">This invoice has been paid. You can print a receipt for your records.</p>
              </div>
            )}
          </div>
        ) : null}
      </Modal>

      {/* Record payment */}
      <Modal open={Boolean(paying)} onClose={() => setPaying(null)} title="Record fee payment"
        subtitle={paying ? `${paying.studentName} · ${paying.month} · ${formatPKR(payable(paying))}` : ''} size="sm"
        footer={<><Button variant="outline" onClick={() => setPaying(null)}>Cancel</Button><Button variant="season" icon={CheckCircle2} onClick={submitPayment}>Confirm payment</Button></>}>
        <form onSubmit={submitPayment} className="space-y-4" noValidate>
          <Field label="Payment method" required>
            <Select value={payForm.method} onChange={(e) => setPayForm((p) => ({ ...p, method: e.target.value }))} options={METHODS} />
          </Field>
          <Field label="Payment date" required error={payError}>
            <Input type="date" value={payForm.paidDate} onChange={(e) => setPayForm((p) => ({ ...p, paidDate: e.target.value }))} />
          </Field>
          <Field label="Received by">
            <Input value={payForm.receivedBy} onChange={(e) => setPayForm((p) => ({ ...p, receivedBy: e.target.value }))} />
          </Field>
          <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            <p className="flex justify-between"><span>Amount</span><span className="font-semibold">{formatPKR(paying?.amount)}</span></p>
            <p className="flex justify-between"><span>Fine</span><span>{formatPKR(paying?.fine || 0)}</span></p>
            <p className="flex justify-between"><span>Discount</span><span>-{formatPKR(paying?.discount || 0)}</span></p>
            <p className="mt-1 flex justify-between border-t border-slate-200 pt-1 text-sm font-extrabold text-navy-900"><span>Total</span><span>{formatPKR(payable(paying))}</span></p>
          </div>
          <p className="text-[11px] text-slate-400">Demo mode: confirming updates the local database only. No money is transferred.</p>
          <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
        </form>
      </Modal>

      {/* Generate voucher */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Generate fee voucher" subtitle="Create a monthly invoice for a student." size="md"
        footer={<><Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button><Button variant="season" icon={Plus} onClick={submitAdd}>Generate voucher</Button></>}>
        <form onSubmit={submitAdd} className="grid gap-4 sm:grid-cols-2" noValidate>
          <Field label="Student" required error={addErrors.studentId} className="sm:col-span-2">
            <Select value={addForm.studentId || ''} onChange={(e) => setAddForm((p) => ({ ...p, studentId: e.target.value }))}
              options={students.map((s) => ({ value: s.id, label: `${s.name} · ${s.grade}-${s.section}` }))} error={addErrors.studentId} />
          </Field>
          <Field label="Month"><Select value={addForm.month || 'November'} onChange={(e) => setAddForm((p) => ({ ...p, month: e.target.value }))} options={MONTHS} /></Field>
          <Field label="Due date" required error={addErrors.dueDate}><Input type="date" value={addForm.dueDate || ''} onChange={(e) => setAddForm((p) => ({ ...p, dueDate: e.target.value }))} /></Field>
          <Field label="Tuition fee (PKR)" required error={addErrors.amount}><Input type="number" min="0" value={addForm.amount ?? ''} onChange={(e) => setAddForm((p) => ({ ...p, amount: e.target.value }))} /></Field>
          <Field label="Late fee (PKR)"><Input type="number" min="0" value={addForm.fine ?? 0} onChange={(e) => setAddForm((p) => ({ ...p, fine: e.target.value }))} /></Field>
          <Field label="Discount (PKR)"><Input type="number" min="0" value={addForm.discount ?? 0} onChange={(e) => setAddForm((p) => ({ ...p, discount: e.target.value }))} /></Field>
          <Field label="Status"><Select value={addForm.status || 'Unpaid'} onChange={(e) => setAddForm((p) => ({ ...p, status: e.target.value }))} options={['Unpaid', 'Paid', 'Overdue', 'Partial']} /></Field>
          <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete this voucher?" message={`This will permanently remove ${deleteTarget?.voucherNo} for ${deleteTarget?.studentName}.`}
        confirmLabel="Delete voucher" onCancel={() => setDeleteTarget(null)}
        onConfirm={() => { remove('fees', deleteTarget.id); toast.success('Fee voucher deleted.', 'Removed'); setDeleteTarget(null) }} />
    </div>
  )
}
