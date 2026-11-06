import { useMemo, useState } from 'react'
import {
  CalendarDays, ChevronLeft, ChevronRight, Clock, Pencil, Plus, Printer, Trash2,
} from 'lucide-react'
import {
  Badge, Button, Card, ConfirmDialog, EmptyState, Field, IconButton, Input, Modal,
  PageHeader, Select, Textarea,
} from '../../components/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { formatDate, monthNames, todayISO } from '../../lib/utils'
import { printTable } from '../../lib/print'

const TYPES = ['Event', 'Exam', 'PTM', 'Holiday', 'Sports', 'Meeting']
const AUDIENCES = ['All', 'Students', 'Parents', 'Teachers', 'Grades 9–10', 'Grade 10']
const typeTone = { Event: 'navy', Exam: 'red', PTM: 'amber', Holiday: 'blue', Sports: 'green', Meeting: 'purple' }
const typeDot = { Event: 'bg-navy-600', Exam: 'bg-rose-500', PTM: 'bg-amber-500', Holiday: 'bg-sky-500', Sports: 'bg-emerald-500', Meeting: 'bg-purple-500' }

export default function CalendarPage() {
  const { db, create, update, remove } = useData()
  const toast = useToast()
  const events = db.calendar || []
  const holidays = db.holidays || []
  const now = new Date()
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() })
  const [typeFilter, setTypeFilter] = useState('')
  const [dayModal, setDayModal] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [detail, setDetail] = useState(null)

  const monthStart = new Date(cursor.year, cursor.month, 1)
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()
  const firstDay = monthStart.getDay()
  const monthKey = `${cursor.year}-${String(cursor.month + 1).padStart(2, '0')}`

  const allItems = useMemo(() => [
    ...events.map((e) => ({ ...e, kind: 'event', type: e.type || 'Event' })),
    ...holidays.map((h) => ({ ...h, kind: 'holiday', type: 'Holiday', audience: 'All' })),
  ], [events, holidays])

  const overlapsMonth = (item) => {
    const start = item.date
    const end = item.endDate || item.date
    return start <= `${monthKey}-31` && end >= `${monthKey}-01`
  }

  const monthItems = allItems.filter((item) => overlapsMonth(item) && (!typeFilter || item.type === typeFilter))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))

  const itemsOn = (date) => monthItems.filter((item) => {
    const end = item.endDate || item.date
    return item.date <= date && end >= date
  })

  const cells = [...Array.from({ length: firstDay }, () => null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const moveMonth = (delta) => {
    setCursor((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  const openAdd = (date) => {
    setEditing(null)
    setForm({ title: '', date: date || `${monthKey}-01`, endDate: '', type: 'Event', audience: 'All', description: '' })
    setErrors({})
    setDayModal(null)
    setFormOpen(true)
  }

  const openEdit = (item) => {
    if (item.kind === 'holiday') {
      toast.info('Public holidays are managed in the Holidays module.', 'Holiday')
      return
    }
    setEditing(item)
    setForm({ ...item })
    setErrors({})
    setDetail(null)
    setFormOpen(true)
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.title?.trim()) next.title = 'Enter an event title.'
    if (!form.date) next.date = 'Select a start date.'
    if (form.endDate && form.endDate < form.date) next.endDate = 'End date cannot be before the start date.'
    setErrors(next)
    if (Object.keys(next).length) return
    const payload = {
      title: form.title.trim(), date: form.date, endDate: form.endDate || '', type: form.type,
      audience: form.audience, description: form.description || '',
    }
    if (editing) {
      update('calendar', editing.id, payload)
      toast.success('Calendar event updated.', 'Saved')
    } else {
      create('calendar', payload)
      toast.success('Calendar event added.', 'Created')
    }
    setFormOpen(false)
  }

  const printMonth = () => {
    printTable(`${monthNames[cursor.month]} ${cursor.year} — School Calendar`, [
      { key: 'date', label: 'Date' }, { key: 'title', label: 'Event' }, { key: 'type', label: 'Type' },
      { key: 'audience', label: 'Audience' }, { key: 'description', label: 'Details' },
    ], monthItems.map((item) => ({ ...item, date: formatDate(item.date), description: item.description || '—' })),
    [['Month', `${monthNames[cursor.month]} ${cursor.year}`], ['Events', monthItems.length]])
  }

  return (
    <div>
      <PageHeader eyebrow="Records" title="School calendar"
        subtitle="Academic events, examinations, meetings and public holidays in one calendar."
        actions={
          <>
            <Button variant="outline" icon={Printer} onClick={printMonth}>Print month</Button>
            <Button variant="season" icon={Plus} onClick={() => openAdd()}>Add event</Button>
          </>
        } />

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" icon={ChevronLeft} onClick={() => moveMonth(-1)}>Prev</Button>
              <div className="min-w-40 text-center">
                <p className="text-sm font-extrabold text-navy-900">{monthNames[cursor.month]} {cursor.year}</p>
                <p className="text-[10px] text-slate-400">{monthItems.length} calendar items</p>
              </div>
              <Button variant="outline" size="sm" icon={ChevronRight} onClick={() => moveMonth(1)}>Next</Button>
            </div>
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} placeholder="All types"
                options={TYPES} className="w-auto w-[130px] py-1.5 text-xs" />
              <Button variant="ghost" size="sm" onClick={() => setCursor({ year: now.getFullYear(), month: now.getMonth() })}>Today</Button>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((day, i) => {
                if (!day) return <span key={`empty-${i}`} />
                const date = `${monthKey}-${String(day).padStart(2, '0')}`
                const dayItems = itemsOn(date)
                const isToday = date === todayISO()
                return (
                  <button key={date} type="button" onClick={() => setDayModal({ date, items: dayItems })}
                    className={`min-h-[78px] rounded-lg border p-1.5 text-left transition hover:border-[var(--season-accent)] hover:bg-[var(--season-badge)]/40 ${isToday ? 'border-[var(--season-accent)] bg-[var(--season-badge)]' : 'border-slate-100 bg-white'}`}>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${isToday ? 'bg-[var(--season-accent)] text-white' : 'text-slate-500'}`}>{day}</span>
                    <span className="mt-1 block space-y-0.5">
                      {dayItems.slice(0, 2).map((item) => (
                        <span key={`${item.kind}-${item.id}`} className="flex items-center gap-1">
                          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${typeDot[item.type] || 'bg-slate-400'}`} />
                          <span className="truncate text-[9px] font-medium text-slate-600">{item.title}</span>
                        </span>
                      ))}
                      {dayItems.length > 2 ? <span className="block text-[8px] font-bold text-slate-400">+{dayItems.length - 2} more</span> : null}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-500">
              {TYPES.map((t) => <span key={t} className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${typeDot[t]}`} /> {t}</span>)}
            </div>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="border-b border-slate-100 px-5 py-3.5">
            <h2 className="text-sm font-extrabold text-navy-900">This month</h2>
            <p className="text-[11px] text-slate-400">{monthNames[cursor.month]} {cursor.year} · {monthItems.length} items</p>
          </div>
          <div className="max-h-[520px] flex-1 divide-y divide-slate-100 overflow-y-auto">
            {monthItems.length ? monthItems.map((item) => (
              <button key={`${item.kind}-${item.id}`} type="button" onClick={() => setDetail(item)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50">
                <span className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-navy-900 text-white">
                  <span className="text-sm font-extrabold leading-none">{Number(item.date.slice(8, 10))}</span>
                  <span className="text-[8px] uppercase text-gold-400">{monthNames[Number(item.date.slice(5, 7)) - 1].slice(0, 3)}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-slate-700">{item.title}</span>
                  <span className="mt-0.5 block text-[10px] text-slate-400">{item.audience || 'All'} · {item.kind === 'holiday' ? 'Public holiday' : item.type}</span>
                </span>
                <Badge tone={typeTone[item.type] || 'slate'}>{item.type}</Badge>
              </button>
            )) : <EmptyState icon={CalendarDays} title="No events this month" message="Add an event or move to another month." />}
          </div>
        </Card>
      </div>

      {/* Day detail */}
      <Modal open={Boolean(dayModal)} onClose={() => setDayModal(null)} title={dayModal ? formatDate(dayModal.date) : ''} subtitle="Events and holidays on this day" size="sm"
        footer={<><Button variant="outline" onClick={() => setDayModal(null)}>Close</Button><Button variant="season" icon={Plus} onClick={() => openAdd(dayModal.date)}>Add event</Button></>}>
        {dayModal ? (
          <div className="space-y-2">
            {dayModal.items.length ? dayModal.items.map((item) => (
              <button key={`${item.kind}-${item.id}`} type="button" onClick={() => setDetail(item)}
                className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${typeDot[item.type] || 'bg-slate-400'}`} />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-slate-700">{item.title}</span>
                  <span className="block text-[10px] text-slate-400">{item.kind === 'holiday' ? 'Public holiday' : `${item.type} · ${item.audience}`}</span>
                </span>
                <Badge tone={typeTone[item.type] || 'slate'}>{item.type}</Badge>
              </button>
            )) : <EmptyState icon={CalendarDays} title="Nothing scheduled" message="No events or holidays on this day." />}
          </div>
        ) : null}
      </Modal>

      {/* Event detail */}
      <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title={detail?.title || 'Event'} subtitle={detail ? `${formatDate(detail.date)}${detail.endDate ? ` – ${formatDate(detail.endDate)}` : ''}` : ''} size="sm"
        footer={detail ? (
          <>
            {detail.kind === 'event' ? <Button variant="outline" icon={Trash2} className="text-rose-600" onClick={() => { setDeleteTarget(detail); setDetail(null) }}>Delete</Button> : null}
            {detail.kind === 'event' ? <Button variant="outline" icon={Pencil} onClick={() => openEdit(detail)}>Edit</Button> : null}
            <Button variant="primary" onClick={() => setDetail(null)}>Close</Button>
          </>
        ) : null}>
        {detail ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge tone={typeTone[detail.type] || 'slate'}>{detail.type}</Badge>
              <Badge tone="slate">{detail.audience || 'All'}</Badge>
              {detail.kind === 'holiday' ? <Badge tone="blue">Public holiday</Badge> : null}
            </div>
            <p className="text-sm leading-relaxed text-slate-600">{detail.description || 'No further details provided.'}</p>
            <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><Clock size={12} /> {formatDate(detail.date)}{detail.endDate ? ` – ${formatDate(detail.endDate)}` : ''}</p>
            {detail.kind === 'holiday' ? <p className="text-[11px] text-slate-400">Holidays can be edited in Records → Holidays.</p> : null}
          </div>
        ) : null}
      </Modal>

      {/* Add / edit event */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit calendar event' : 'Add calendar event'} subtitle={editing ? editing.id : 'Schedule an event for the school community.'} size="md"
        footer={<><Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button variant="season" icon={editing ? Pencil : Plus} onClick={submit}>{editing ? 'Save changes' : 'Add event'}</Button></>}>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
          <Field label="Event title" required error={errors.title} className="sm:col-span-2">
            <Input value={form.title || ''} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Annual Prize Distribution" error={errors.title} />
          </Field>
          <Field label="Start date" required error={errors.date}><Input type="date" value={form.date || ''} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} /></Field>
          <Field label="End date" error={errors.endDate}><Input type="date" value={form.endDate || ''} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} /></Field>
          <Field label="Type"><Select value={form.type || 'Event'} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} options={TYPES} /></Field>
          <Field label="Audience"><Select value={form.audience || 'All'} onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value }))} options={AUDIENCES} /></Field>
          <Field label="Description" className="sm:col-span-2"><Textarea value={form.description || ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Details, venue and timing…" /></Field>
          <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete calendar event?" message={`“${deleteTarget?.title}” will be removed from the school calendar.`}
        confirmLabel="Delete event" onCancel={() => setDeleteTarget(null)}
        onConfirm={() => { remove('calendar', deleteTarget.id); toast.success('Calendar event deleted.', 'Removed'); setDeleteTarget(null) }} />
    </div>
  )
}
