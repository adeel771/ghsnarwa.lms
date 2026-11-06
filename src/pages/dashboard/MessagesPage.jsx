import { useMemo, useState } from 'react'
import { MessageSquare, Plus, Printer, Search, Send, Trash2, Users } from 'lucide-react'
import {
  Avatar, Badge, Button, Card, ConfirmDialog, EmptyState, Field, Input, Modal,
  PageHeader, SearchInput, Select, Textarea,
} from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { roleLabels, school } from '../../data/mockData'
import { formatDateTime } from '../../lib/utils'
import { printHTML, documentHeader } from '../../lib/print'

const nowStamp = () => new Date().toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '')

export default function MessagesPage() {
  const { user } = useAuth()
  const { db, create, update, remove } = useData()
  const toast = useToast()
  const threads = db.messages || []
  const users = db.users || []
  const role = user?.roleKey
  const canSeeAll = ['superadmin', 'admin', 'principal'].includes(role)

  const visible = useMemo(() => {
    if (canSeeAll) return threads
    const mine = threads.filter((t) => (t.participants || []).includes(user?.name))
    return mine.length ? mine : threads
  }, [threads, canSeeAll, user?.name])

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [activeId, setActiveId] = useState(visible[0]?.id || '')
  const [reply, setReply] = useState('')
  const [newOpen, setNewOpen] = useState(false)
  const [newForm, setNewForm] = useState({ recipient: '', subject: '', text: '' })
  const [errors, setErrors] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return visible.filter((t) => {
      const matchQ = !q || [t.subject, ...(t.participants || [])].some((v) => String(v || '').toLowerCase().includes(q))
      const matchFilter = filter === 'all' || (filter === 'unread' ? t.unread > 0 : t.unread === 0)
      return matchQ && matchFilter
    }).sort((a, b) => String(b.updated).localeCompare(String(a.updated)))
  }, [visible, query, filter])

  const active = visible.find((t) => t.id === activeId) || filtered[0] || null
  const unreadTotal = visible.reduce((s, t) => s + (t.unread || 0), 0)

  const openThread = (thread) => {
    setActiveId(thread.id)
    if (thread.unread) update('messages', thread.id, { unread: 0 })
  }

  const sendReply = (e) => {
    e.preventDefault()
    if (!active) return
    if (!reply.trim()) {
      toast.error('Write a message before sending.', 'Empty message')
      return
    }
    const message = { from: user?.name || 'User', role: roleLabels[role] || user?.role || 'Staff', text: reply.trim(), time: nowStamp() }
    update('messages', active.id, {
      messages: [...(active.messages || []), message],
      updated: nowStamp(),
      unread: 0,
    })
    setReply('')
    toast.success('Message sent. In production, the recipient would be notified by email or SMS.', 'Reply sent')
  }

  const openNew = () => {
    const recipient = users.find((u) => u.name !== user?.name)?.name || ''
    setNewForm({ recipient, subject: '', text: '' })
    setErrors({})
    setNewOpen(true)
  }

  const submitNew = (e) => {
    e.preventDefault()
    const next = {}
    if (!newForm.recipient) next.recipient = 'Select a recipient.'
    if (!newForm.subject.trim()) next.subject = 'Enter a subject.'
    if (!newForm.text.trim()) next.text = 'Write a message.'
    setErrors(next)
    if (Object.keys(next).length) return
    const thread = create('messages', {
      subject: newForm.subject.trim(),
      participants: [user?.name || 'User', newForm.recipient],
      updated: nowStamp(),
      unread: 0,
      messages: [{ from: user?.name || 'User', role: roleLabels[role] || user?.role || 'Staff', text: newForm.text.trim(), time: nowStamp() }],
    })
    setActiveId(thread.id)
    setNewOpen(false)
    toast.success(`Conversation started with ${newForm.recipient}.`, 'Message sent')
  }

  const printThread = () => {
    if (!active) return
    const body = `
      <div class="sheet">
        ${documentHeader()}
        <h2 class="doc-title">Message Conversation</h2>
        <p class="doc-sub">${active.subject} · ${active.participants?.join(' · ')}</p>
        <div class="grid">
          <div class="row"><span>Thread</span><span>${active.id}</span></div>
          <div class="row"><span>Participants</span><span>${active.participants?.join(', ')}</span></div>
          <div class="row"><span>Last updated</span><span>${active.updated}</span></div>
        </div>
        ${(active.messages || []).map((m) => `
          <div style="border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;margin:8px 0">
            <p style="margin:0;font-weight:700;color:#0b2545">${m.from} <span style="font-weight:400;color:#64748b;font-size:11px">· ${m.role} · ${m.time}</span></p>
            <p style="margin:6px 0 0;font-size:12px">${m.text}</p>
          </div>`).join('')}
        <p class="foot">${school.name} Digital LMS · Demo conversation only</p>
      </div>`
    printHTML('Message Conversation', body)
    toast.success('Conversation opened for printing.', 'Print ready')
  }

  return (
    <div>
      <PageHeader eyebrow="Communication" title="Messages"
        subtitle="Secure conversations between staff, students and parents. Demo messages are stored in this browser."
        actions={
          <>
            <Button variant="outline" icon={Printer} onClick={printThread}>Print thread</Button>
            <Button variant="season" icon={Plus} onClick={openNew}>New message</Button>
          </>
        } />

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 p-3">
            <SearchInput value={query} onChange={setQuery} placeholder="Search conversations…" />
            <div className="mt-2 flex items-center justify-between">
              <Select value={filter} onChange={(e) => setFilter(e.target.value)} options={[{ value: 'all', label: 'All conversations' }, { value: 'unread', label: 'Unread' }, { value: 'read', label: 'Read' }]} className="!py-1.5 text-xs" />
              <Badge tone={unreadTotal ? 'amber' : 'slate'}>{unreadTotal} unread</Badge>
            </div>
          </div>
          <div className="max-h-[560px] divide-y divide-slate-100 overflow-y-auto">
            {filtered.length ? filtered.map((thread) => {
              const last = thread.messages?.[thread.messages.length - 1]
              const other = (thread.participants || []).find((p) => p !== user?.name) || thread.participants?.[0] || 'Conversation'
              return (
                <button key={thread.id} type="button" onClick={() => openThread(thread)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${active?.id === thread.id ? 'bg-navy-50/70' : 'hover:bg-slate-50'}`}>
                  <Avatar name={other} size="sm" color={thread.unread ? 'bg-[var(--season-accent)]' : 'bg-navy-700'} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={`truncate text-xs ${thread.unread ? 'font-extrabold text-navy-900' : 'font-semibold text-slate-700'}`}>{thread.subject}</span>
                      {thread.unread ? <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--season-accent)]" /> : null}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-slate-400">{other} · {thread.participants?.length} participants</span>
                    <span className="mt-0.5 block truncate text-[10px] text-slate-400">{last?.text || 'No messages yet'}</span>
                  </span>
                </button>
              )
            }) : <EmptyState icon={Search} title="No conversations" message="Try another search or start a new message." />}
          </div>
        </Card>

        <Card className="flex min-h-[560px] flex-col overflow-hidden">
          {active ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-extrabold text-navy-900">{active.subject}</h2>
                  <p className="truncate text-[11px] text-slate-400">{active.participants?.join(' · ')} · Updated {active.updated}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="navy">{active.id}</Badge>
                  <Button variant="ghost" size="sm" icon={Trash2} className="text-rose-500 hover:bg-rose-50" onClick={() => setDeleteTarget(active)}>Delete</Button>
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-5">
                {(active.messages || []).map((m, i) => {
                  const mine = m.from === user?.name
                  return (
                    <div key={`${m.time}-${i}`} className={`flex gap-2.5 ${mine ? 'flex-row-reverse' : ''}`}>
                      <Avatar name={m.from} size="xs" color={mine ? 'bg-[var(--season-accent)]' : 'bg-navy-700'} />
                      <div className={`w-full ${mine ? 'text-right' : ''}`}>
                        <p className="text-[10px] font-semibold text-slate-400">{m.from} · {m.role} · {m.time}</p>
                        <div className={`mt-1 rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${mine ? 'rounded-tr-sm bg-navy-900 text-white' : 'rounded-tl-sm border border-slate-200 bg-white text-slate-700'}`}>
                          {m.text}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {!(active.messages || []).length ? <EmptyState icon={MessageSquare} title="No messages" message="Send the first message in this conversation." /> : null}
              </div>

              <form onSubmit={sendReply} className="border-t border-slate-100 p-3">
                <div className="flex items-end gap-2">
                  <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={2} placeholder={`Reply as ${user?.name}…`} className="flex-1" />
                  <Button type="submit" variant="season" icon={Send} className="!h-11">Send</Button>
                </div>
                <p className="mt-1.5 text-[10px] text-slate-400">Demo mode: messages are saved locally and are not actually delivered.</p>
              </form>
            </>
          ) : (
            <EmptyState icon={MessageSquare} title="Select a conversation" message="Choose a thread from the list to read and reply." />
          )}
        </Card>
      </div>

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New message" subtitle="Start a conversation with a staff member, parent or student." size="md"
        footer={<><Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button><Button variant="season" icon={Send} onClick={submitNew}>Send message</Button></>}>
        <form onSubmit={submitNew} className="space-y-4" noValidate>
          <Field label="Recipient" required error={errors.recipient}>
            <Select value={newForm.recipient} onChange={(e) => setNewForm((p) => ({ ...p, recipient: e.target.value }))}
              placeholder="Select a recipient"
              options={users.filter((u) => u.name !== user?.name).map((u) => ({ value: u.name, label: `${u.name} · ${u.role}` }))} error={errors.recipient} />
          </Field>
          <Field label="Subject" required error={errors.subject}>
            <Input value={newForm.subject} onChange={(e) => setNewForm((p) => ({ ...p, subject: e.target.value }))} placeholder="e.g. Mathematics extra classes" error={errors.subject} />
          </Field>
          <Field label="Message" required error={errors.text}>
            <Textarea value={newForm.text} onChange={(e) => setNewForm((p) => ({ ...p, text: e.target.value }))} rows={4} placeholder="Write your message…" error={errors.text} />
          </Field>
          <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete this conversation?" message={`This will remove “${deleteTarget?.subject}” and all its messages from the demo database.`}
        confirmLabel="Delete conversation" onCancel={() => setDeleteTarget(null)}
        onConfirm={() => { remove('messages', deleteTarget.id); toast.success('Conversation deleted.', 'Removed'); setDeleteTarget(null); setActiveId('') }} />
    </div>
  )
}
