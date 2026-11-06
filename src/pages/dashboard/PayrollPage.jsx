import { useMemo, useState } from 'react'
import {
  Banknote, CheckCircle2, Download, Eye, Pencil, Plus, Printer, Search, Users, Wallet,
} from 'lucide-react'
import {
  Badge, Button, Card, EmptyState, Field, IconButton, Input, Modal, PageHeader,
  Pagination, SearchInput, Select, StatCard, Table,
} from '../../components/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { displayTeacher } from '../../data/mockData'
import { downloadCSV, formatDate, formatPKR, paginate, todayISO } from '../../lib/utils'
import { printReceipt, printTable } from '../../lib/print'

const MONTHS = ['September 2026', 'October 2026', 'November 2026', 'December 2026']

export default function PayrollPage() {
  const { db, create, update } = useData()
  const toast = useToast()
  const payroll = db.payroll || []
  const teachers = db.teachers || []

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [month, setMonth] = useState('October 2026')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(8)
  const [viewing, setViewing] = useState(null)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return payroll.filter((p) => {
      const matchQ = !q || [p.name, p.employeeId, p.designation].some((v) => String(v || '').toLowerCase().includes(q))
      return matchQ && (!status || p.status === status) && (!month || p.month === month)
    })
  }, [payroll, query, status, month])
  const sorted = useMemo(() => [...filtered].sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''))), [filtered])
  const pageRows = paginate(sorted, page, perPage)
  const displayRow = (row) => ({ ...row, name: displayTeacher(row.name), designation: displayTeacher(row.designation) })
  const displayRows = sorted.map(displayRow)
  const displayPageRows = pageRows.map(displayRow)

  const totalNet = sorted.reduce((s, p) => s + Number(p.net || 0), 0)
  const paidRows = sorted.filter((p) => p.status === 'Paid')
  const pendingRows = sorted.filter((p) => p.status !== 'Paid')
  const paidTotal = paidRows.reduce((s, p) => s + Number(p.net || 0), 0)

  const openEdit = (row) => {
    const source = payroll.find((p) => p.id === row.id) || row
    setEditing(source)
    setForm({ ...source })
    setErrors({})
    setFormOpen(true)
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ employeeId: teachers[0]?.id || '', name: displayTeacher(teachers[0]?.name), designation: displayTeacher(teachers[0]?.designation), basic: 45000, allowances: 10000, deductions: 3000, month: 'November 2026', status: 'Pending', paidDate: '', method: 'Bank Transfer', bank: 'Bank of Khyber', account: '' })
    setErrors({})
    setFormOpen(true)
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.name) next.name = 'Select or enter an employee name.'
    if (!form.basic || Number(form.basic) <= 0) next.basic = 'Enter a valid basic salary.'
    setErrors(next)
    if (Object.keys(next).length) return
    const basic = Number(form.basic)
    const allowances = Number(form.allowances) || 0
    const deductions = Number(form.deductions) || 0
    const payload = {
      ...form,
      basic,
      allowances,
      deductions,
      net: basic + allowances - deductions,
      paidDate: form.status === 'Paid' ? (form.paidDate || todayISO()) : '',
    }
    if (editing) {
      update('payroll', editing.id, payload)
      toast.success(`Payroll record for ${payload.name} updated.`, 'Saved')
    } else {
      create('payroll', payload)
      toast.success(`Payroll record added for ${payload.name}.`, 'Created')
    }
    setFormOpen(false)
  }

  const markPaid = (row) => {
    update('payroll', row.id, { status: 'Paid', paidDate: todayISO(), method: row.method || 'Bank Transfer' })
    toast.success(`${displayTeacher(row.name)} marked as paid for ${row.month}.`, 'Salary disbursed')
  }

  const printPayslip = (row) => {
    printReceipt({
      title: 'Salary Payslip',
      rows: [
        ['Employee', displayTeacher(row.name)],
        ['Employee ID', row.employeeId],
        ['Designation', displayTeacher(row.designation)],
        ['Pay month', row.month],
        ['Basic salary', formatPKR(row.basic)],
        ['Allowances', formatPKR(row.allowances)],
        ['Deductions', formatPKR(row.deductions)],
        ['Net salary', formatPKR(row.net)],
        ['Payment method', row.method || 'Bank Transfer'],
        ['Bank / account', `${row.bank || '—'} · ${row.account || '—'}`],
        ['Status', row.status],
        ['Paid on', row.paidDate ? formatDate(row.paidDate) : '—'],
      ],
      footerNote: 'Confidential salary document. Demo data only — no real disbursement has occurred.',
    })
    toast.success('Payslip opened for printing.', 'Print ready')
  }

  const printRegister = () => {
    printTable('Payroll Register', [
      { key: 'employeeId', label: 'Employee ID' }, { key: 'name', label: 'Employee' }, { key: 'designation', label: 'Designation' },
      { key: 'basic', label: 'Basic' }, { key: 'allowances', label: 'Allowances' }, { key: 'deductions', label: 'Deductions' },
      { key: 'net', label: 'Net' }, { key: 'status', label: 'Status' },
    ], displayRows.map((p) => ({ ...p, basic: formatPKR(p.basic), allowances: formatPKR(p.allowances), deductions: formatPKR(p.deductions), net: formatPKR(p.net) })),
    [['Month', month], ['Employees', sorted.length], ['Total payroll', formatPKR(totalNet)]])
  }

  const exportCsv = () => {
    downloadCSV(`payroll-${month.replace(/\s/g, '-')}.csv`, displayRows, [
      { key: 'employeeId', label: 'Employee ID' }, { key: 'name', label: 'Employee' }, { key: 'designation', label: 'Designation' },
      { key: 'basic', label: 'Basic' }, { key: 'allowances', label: 'Allowances' }, { key: 'deductions', label: 'Deductions' },
      { key: 'net', label: 'Net salary' }, { key: 'status', label: 'Status' }, { key: 'paidDate', label: 'Paid date' },
    ])
    toast.success(`${sorted.length} payroll records exported.`, 'CSV ready')
  }

  return (
    <div>
      <PageHeader eyebrow="Finance" title="Payroll" subtitle="Monthly staff salaries, allowances, deductions and payslips."
        actions={
          <>
            <Button variant="outline" icon={Printer} onClick={printRegister}>Print register</Button>
            <Button variant="outline" icon={Download} onClick={exportCsv}>Export</Button>
            <Button variant="season" icon={Plus} onClick={openAdd}>Add payroll</Button>
          </>
        } />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Total payroll" value={formatPKR(totalNet)} hint={`${sorted.length} staff · ${month}`} tone="navy" />
        <StatCard icon={CheckCircle2} label="Paid" value={formatPKR(paidTotal)} hint={`${paidRows.length} payslips disbursed`} tone="green" />
        <StatCard icon={Banknote} label="Pending" value={formatPKR(totalNet - paidTotal)} hint={`${pendingRows.length} awaiting payment`} tone="gold" />
        <StatCard icon={Users} label="Average salary" value={formatPKR(sorted.length ? Math.round(totalNet / sorted.length) : 0)} hint="Net per employee" tone="sky" />
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
          <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1) }} placeholder="Search employee or designation…" className="flex-1" />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={month} onChange={(e) => { setMonth(e.target.value); setPage(1) }} options={MONTHS} className="w-auto w-[150px] py-2 text-xs" />
            <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} placeholder="All statuses" options={['Paid', 'Pending']} className="w-auto w-[130px] py-2 text-xs" />
          </div>
        </div>

        <Table
          columns={[
            { key: 'name', label: 'Employee', primary: true, sub: 'designation' },
            { key: 'basic', label: 'Basic', format: 'currency' },
            { key: 'allowances', label: 'Allowances', format: 'currency' },
            { key: 'deductions', label: 'Deductions', format: 'currency' },
            { key: 'net', label: 'Net salary', format: 'currency' },
            { key: 'status', label: 'Status', format: 'badge' },
          ]}
          rows={displayPageRows}
          onRowClick={setViewing}
          empty={<EmptyState icon={Banknote} title="No payroll records" message="Try another month or add a payroll record." />}
          actions={(row) => (
            <div className="flex items-center justify-end gap-0.5">
              <IconButton icon={Eye} label="View payslip" onClick={() => setViewing(row)} />
              <IconButton icon={Printer} label="Print payslip" onClick={() => printPayslip(row)} />
              <IconButton icon={Pencil} label="Edit payroll" onClick={() => openEdit(row)} />
              {row.status !== 'Paid' ? <IconButton icon={CheckCircle2} label="Mark as paid" className="text-emerald-600 hover:bg-emerald-50" onClick={() => markPaid(row)} /> : null}
            </div>
          )}
        />
        <Pagination page={page} totalPages={Math.max(1, Math.ceil(sorted.length / perPage))} total={sorted.length}
          perPage={perPage} onPage={setPage} onPerPage={(n) => { setPerPage(n); setPage(1) }} />
      </Card>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Salary payslip" subtitle={viewing ? `${viewing.name} · ${viewing.month}` : ''} size="md"
        footer={viewing ? (
          <>
            <Button variant="outline" icon={Printer} onClick={() => printPayslip(viewing)}>Print payslip</Button>
            {viewing.status !== 'Paid' ? <Button variant="season" icon={CheckCircle2} onClick={() => { markPaid(viewing); setViewing(null) }}>Mark as paid</Button> : null}
            <Button variant="primary" onClick={() => setViewing(null)}>Close</Button>
          </>
        ) : null}>
        {viewing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-base font-extrabold text-navy-900">{viewing.name}</p>
                <p className="text-xs text-slate-500">{viewing.designation} · {viewing.employeeId}</p>
              </div>
              <Badge tone={viewing.status === 'Paid' ? 'green' : 'amber'}>{viewing.status}</Badge>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[
                ['Basic salary', formatPKR(viewing.basic)],
                ['Allowances', formatPKR(viewing.allowances)],
                ['Deductions', formatPKR(viewing.deductions)],
                ['Net salary', formatPKR(viewing.net)],
                ['Pay month', viewing.month],
                ['Payment method', viewing.method || 'Bank Transfer'],
                ['Bank', viewing.bank || '—'],
                ['Account', viewing.account || '—'],
                ['Paid on', viewing.paidDate ? formatDate(viewing.paidDate) : '—'],
                ['Status', viewing.status],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-100 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-700">{value}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">Demo payroll only. No salary is transferred.</p>
          </div>
        ) : null}
      </Modal>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit payroll record' : 'Add payroll record'}
        subtitle={editing ? editing.id : 'Create a monthly salary record.'} size="md"
        footer={<><Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button variant="season" icon={Pencil} onClick={submit}>{editing ? 'Save changes' : 'Add record'}</Button></>}>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
          <Field label="Employee" required error={errors.name} className="sm:col-span-2">
            <Select value={form.employeeId || ''} onChange={(e) => {
              const t = teachers.find((x) => x.id === e.target.value)
              setForm((p) => ({ ...p, employeeId: e.target.value, name: displayTeacher(t?.name), designation: displayTeacher(t?.designation) }))
            }} options={teachers.map((t) => ({ value: t.id, label: `${displayTeacher(t.name)} · ${displayTeacher(t.designation)}` }))} error={errors.name} />
          </Field>
          <Field label="Basic salary (PKR)" required error={errors.basic}><Input type="number" min="0" value={form.basic ?? ''} onChange={(e) => setForm((p) => ({ ...p, basic: e.target.value }))} /></Field>
          <Field label="Allowances (PKR)"><Input type="number" min="0" value={form.allowances ?? 0} onChange={(e) => setForm((p) => ({ ...p, allowances: e.target.value }))} /></Field>
          <Field label="Deductions (PKR)"><Input type="number" min="0" value={form.deductions ?? 0} onChange={(e) => setForm((p) => ({ ...p, deductions: e.target.value }))} /></Field>
          <Field label="Pay month"><Select value={form.month || 'November 2026'} onChange={(e) => setForm((p) => ({ ...p, month: e.target.value }))} options={MONTHS} /></Field>
          <Field label="Status"><Select value={form.status || 'Pending'} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} options={['Pending', 'Paid']} /></Field>
          <Field label="Payment method"><Select value={form.method || 'Bank Transfer'} onChange={(e) => setForm((p) => ({ ...p, method: e.target.value }))} options={['Bank Transfer', 'Cash', 'Cheque']} /></Field>
          <div className="sm:col-span-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            <span className="font-semibold">Net salary:</span> {formatPKR((Number(form.basic) || 0) + (Number(form.allowances) || 0) - (Number(form.deductions) || 0))}
          </div>
          <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
        </form>
      </Modal>
    </div>
  )
}
