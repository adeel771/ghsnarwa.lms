import { useMemo, useState } from 'react'
import { Bell, BellRing, CheckCheck, Plus, Printer, Search, Trash2 } from 'lucide-react'
import {
  Badge, Button, Card, ConfirmDialog, EmptyState, Field, Input, Modal, PageHeader,
  SearchInput, Select, StatCard, Textarea,
} from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { formatDate } from '../../lib/utils'
import { printTable } from '../../lib/print'

const TYPES = ['Notice', 'Fee', 'Result', 'PTM', 'Achievement', 'HR', 'Event', 'General']
const AUDIENCES = ['All', 'Students', 'Parents', 'Teachers', 'Principal', 'Staff']

export default function NotificationsPage() {
  const { user } = useAuth()
  const { db, markNotificationRead, markAllNotificationsRead, addNotification, update, remove } = useData()
  const toast = useToast()
  const notifications = db.notifications || []
  const canPost = ['superadmin', 'admin', 'principal'].includes(user?.roleKey)

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [audience, setAudience] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ title: '', message: '', audience: 'All', type: 'Notice' })
  const [errors, setErrors] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return notifications.filter((n) => {
      const matchQ = !q || [n.title, n.message, n.type].some((v) => String(v || '').toLowerCase().includes(q))
      const matchFilter = filter === 'all' || (filter === 'unread' ? !n.read : n.read)
      return matchQ && matchFilter && (!audience || n.audience === audience)
    }).sort((a, b) => String(b.date).localeCompare(String(a.date)))
  }, [notifications, query, filter, audience])

  const unread = notifications.filter((n) => !n.read).length
  const today = notifications.filter((n) => n.date === new Date().toISOString().slice(0, 10)).length

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.title.trim()) next.title = 'Enter a title.'
    if (!form.message.trim()) next.message = 'Write the notification message.'
    setErrors(next)
    if (Object.keys(next).length) return
    addNotification({ ...form, title: form.title.trim(), message: form.message.trim() })
    setFormOpen(false)
    toast.success('Notification published to the demo notice board.', 'Published')
  }

  const printList = () => {
    printTable('Notifications & Notices', [
      { key: 'title', label: 'Title' }, { key: 'message', label: 'Message' }, { key: 'audience', label: 'Audience' },
      { key: 'type', label: 'Type' }, { key: 'date', label: 'Date' }, { key: 'status', label: 'Status' },
    ], filtered.map((n) => ({ ...n, status: n.read ? 'Read' : 'Unread' })), [['Total', filtered.length], ['Unread', filtered.filter((n) => !n.read).length]])
  }

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Notifications"
        subtitle="School notices, fee reminders, result announcements and system alerts."
        actions={
          <>
            <Button variant="outline" icon={Printer} onClick={printList}>Print</Button>
            <Button variant="outline" icon={CheckCheck} onClick={() => { markAllNotificationsRead(); toast.success('All notifications marked as read.', 'Inbox cleared') }}>Mark all read</Button>
            {canPost ? <Button variant="season" icon={Plus} onClick={() => { setForm({ title: '', message: '', audience: 'All', type: 'Notice' }); setErrors({}); setFormOpen(true) }}>New notification</Button> : null}
          </>
        } />

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Bell} label="Total notifications" value={notifications.length} hint="All announcements" tone="navy" />
        <StatCard icon={BellRing} label="Unread" value={unread} hint="Requires attention" tone="gold" />
        <StatCard icon={CheckCheck} label="Read" value={notifications.length - unread} hint="Already reviewed" tone="green" />
        <StatCard icon={Bell} label="Today" value={today} hint="Published today" tone="sky" />
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
          <SearchInput value={query} onChange={setQuery} placeholder="Search notifications…" className="flex-1" />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={filter} onChange={(e) => setFilter(e.target.value)} options={[{ value: 'all', label: 'All' }, { value: 'unread', label: 'Unread' }, { value: 'read', label: 'Read' }]} className="w-auto w-[120px] py-2 text-xs" />
            <Select value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="All audiences" options={AUDIENCES} className="w-auto w-[140px] py-2 text-xs" />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.length ? filtered.map((n) => (
            <div key={n.id} className={`flex items-start gap-3 px-5 py-4 transition hover:bg-slate-50/60 ${!n.read ? 'bg-[var(--season-badge)]/30' : ''}`}>
              <span className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${n.read ? 'bg-slate-100 text-slate-400' : 'bg-[var(--season-badge)] text-[var(--season-accent)]'}`}>
                {n.read ? <CheckCheck size={16} /> : <BellRing size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`text-sm ${n.read ? 'font-semibold text-slate-700' : 'font-extrabold text-navy-900'}`}>{n.title}</p>
                  <Badge tone={n.type === 'Fee' ? 'gold' : n.type === 'Result' ? 'green' : n.type === 'HR' ? 'purple' : 'navy'}>{n.type}</Badge>
                  <Badge tone="slate">{n.audience}</Badge>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{n.message}</p>
                <p className="mt-1 text-[10px] text-slate-400">{n.id} · {formatDate(n.date)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {!n.read ? <Button variant="ghost" size="sm" onClick={() => { markNotificationRead(n.id); toast.success('Marked as read.', 'Notification') }}>Mark read</Button>
                  : <Button variant="ghost" size="sm" onClick={() => update('notifications', n.id, { read: false })}>Mark unread</Button>}
                {canPost ? <Button variant="ghost" size="sm" className="text-rose-500 hover:bg-rose-50" onClick={() => setDeleteTarget(n)}><Trash2 size={14} /></Button> : null}
              </div>
            </div>
          )) : (
            <EmptyState icon={Search} title="No notifications found" message="Try a different filter or search term." />
          )}
        </div>
      </Card>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title="Publish notification" subtitle="Send a notice to the school community." size="md"
        footer={<><Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button variant="season" icon={Bell} onClick={submit}>Publish</Button></>}>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="Title" required error={errors.title}>
            <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Winter timings begin 1 November" error={errors.title} />
          </Field>
          <Field label="Message" required error={errors.message}>
            <Textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} rows={4} placeholder="Write the announcement…" error={errors.message} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Audience"><Select value={form.audience} onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))} options={AUDIENCES} /></Field>
            <Field label="Type"><Select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} options={TYPES} /></Field>
          </div>
          <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete notification?" message={`“${deleteTarget?.title}” will be removed from the demo notice board.`}
        confirmLabel="Delete" onCancel={() => setDeleteTarget(null)}
        onConfirm={() => { remove('notifications', deleteTarget.id); toast.success('Notification deleted.', 'Removed'); setDeleteTarget(null) }} />
    </div>
  )
}
