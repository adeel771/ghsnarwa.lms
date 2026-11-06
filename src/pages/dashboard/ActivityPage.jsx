import { useMemo, useState } from 'react'
import { Activity, Download, Eye, History, Printer, Search, ShieldCheck, Users } from 'lucide-react'
import {
  Badge, Button, Card, EmptyState, IconButton, Modal, PageHeader, Pagination,
  SearchInput, Select, StatCard, Table,
} from '../../components/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { downloadCSV, formatDateTime, paginate, sortRows, todayISO } from '../../lib/utils'
import { printTable } from '../../lib/print'

const ROLE_OPTIONS = ['Super Admin', 'School Admin', 'Principal', 'Teacher', 'Student', 'Parent', 'Accountant', 'Librarian']

export default function ActivityPage() {
  const { db } = useData()
  const toast = useToast()
  const logs = db.activity || []
  const [query, setQuery] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [sort, setSort] = useState({ key: 'date', direction: 'desc' })
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [viewing, setViewing] = useState(null)

  const modules = useMemo(() => [...new Set(logs.map((l) => l.module).filter(Boolean))].sort(), [logs])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return logs.filter((l) => {
      const matchQ = !q || [l.user, l.action, l.module, l.role].some((v) => String(v || '').toLowerCase().includes(q))
      return matchQ && (!moduleFilter || l.module === moduleFilter) && (!roleFilter || l.role === roleFilter)
    })
  }, [logs, query, moduleFilter, roleFilter])

  const sorted = useMemo(() => sortRows(filtered, sort.key, sort.direction), [filtered, sort])
  const pageRows = paginate(sorted, page, perPage)
  const today = new Date().toISOString().slice(0, 10)

  const exportCsv = () => {
    downloadCSV(`activity-log-${todayISO()}.csv`, sorted, [
      { key: 'date', label: 'Date' }, { key: 'user', label: 'User' }, { key: 'role', label: 'Role' },
      { key: 'action', label: 'Action' }, { key: 'module', label: 'Module' }, { key: 'ip', label: 'IP address' },
    ])
    toast.success(`${sorted.length} log entries exported.`, 'CSV ready')
  }

  const printLogs = () => {
    printTable('System Activity Log', [
      { key: 'date', label: 'Date' }, { key: 'user', label: 'User' }, { key: 'role', label: 'Role' },
      { key: 'action', label: 'Action' }, { key: 'module', label: 'Module' }, { key: 'ip', label: 'IP' },
    ], sorted, [['Entries', sorted.length], ['Generated', new Date().toLocaleString('en-GB')]])
  }

  return (
    <div>
      <PageHeader eyebrow="System" title="Activity log"
        subtitle="Audit trail of actions performed across the demo LMS. New actions are appended automatically."
        actions={
          <>
            <Button variant="outline" icon={Printer} onClick={printLogs}>Print</Button>
            <Button variant="outline" icon={Download} onClick={exportCsv}>Export</Button>
          </>
        } />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={History} label="Log entries" value={logs.length} hint="Total recorded actions" tone="navy" />
        <StatCard icon={Activity} label="Today" value={logs.filter((l) => String(l.date).startsWith(today)).length} hint="Actions today" tone="green" />
        <StatCard icon={ShieldCheck} label="Modules" value={modules.length} hint="Areas with activity" tone="gold" />
        <StatCard icon={Users} label="Users" value={new Set(logs.map((l) => l.user)).size} hint="Distinct actors" tone="sky" />
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
          <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1) }} placeholder="Search by user, action or module…" className="flex-1" />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={moduleFilter} onChange={(e) => { setModuleFilter(e.target.value); setPage(1) }} placeholder="All modules" options={modules} className="w-auto w-[140px] py-2 text-xs" />
            <Select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }} placeholder="All roles" options={ROLE_OPTIONS} className="w-auto w-[140px] py-2 text-xs" />
            {(query || moduleFilter || roleFilter) ? <Button variant="ghost" size="sm" onClick={() => { setQuery(''); setModuleFilter(''); setRoleFilter('') }}>Clear</Button> : null}
          </div>
        </div>

        <Table
          columns={[
            { key: 'user', label: 'User', primary: true, sub: 'role' },
            { key: 'action', label: 'Action' },
            { key: 'module', label: 'Module', render: (v) => <Badge tone="navy">{v}</Badge> },
            { key: 'date', label: 'Timestamp' },
            { key: 'ip', label: 'IP address' },
          ]}
          rows={pageRows}
          sort={sort}
          onSort={(key) => setSort((prev) => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }))}
          onRowClick={setViewing}
          empty={<EmptyState icon={Search} title="No activity found" message="Try clearing the filters." />}
          actions={(row) => <IconButton icon={Eye} label="View log entry" onClick={() => setViewing(row)} />}
        />
        <Pagination page={page} totalPages={Math.max(1, Math.ceil(sorted.length / perPage))} total={sorted.length}
          perPage={perPage} onPage={setPage} onPerPage={(n) => { setPerPage(n); setPage(1) }} />
      </Card>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Activity log entry" subtitle={viewing?.id} size="sm"
        footer={<><Button variant="outline" icon={Printer} onClick={() => printTable('Activity Log Entry', [{ key: 'field', label: 'Field' }, { key: 'value', label: 'Value' }], viewing ? Object.entries(viewing).map(([field, value]) => ({ field, value: String(value) })) : [], [['Entry', viewing?.id]])}>Print</Button><Button variant="primary" onClick={() => setViewing(null)}>Close</Button></>}>
        {viewing ? (
          <div className="space-y-2.5">
            {Object.entries(viewing).map(([field, value]) => (
              <div key={field} className="rounded-lg border border-slate-100 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{field}</p>
                <p className="mt-0.5 text-sm font-semibold text-slate-700">{String(value)}</p>
              </div>
            ))}
            <p className="text-[11px] text-slate-400">Timestamps shown in local demo time. In production, immutable server-side audit logs would be retained.</p>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
