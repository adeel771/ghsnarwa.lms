import { useMemo, useState } from 'react'
import { CalendarClock, Pencil, Printer, Save, Sparkles } from 'lucide-react'
import {
  Badge, Button, Card, EmptyState, Field, Modal, PageHeader, Select,
} from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { periodTimes, subjects as seedSubjects, timetable as seedTimetable } from '../../data/mockData'
import { printTable } from '../../lib/print'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SPECIALS = ['Assembly', 'Library', 'Sports', 'Tutorial', 'Break']
const todayName = () => {
  const d = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  return DAYS.includes(d) ? d : 'Monday'
}
const subjectColor = (subject) => {
  if (subject === 'Assembly' || subject === 'Break') return 'bg-slate-100 text-slate-600'
  if (subject === 'Library') return 'bg-amber-50 text-amber-800'
  if (subject === 'Sports') return 'bg-emerald-50 text-emerald-800'
  if (subject === 'Tutorial') return 'bg-purple-50 text-purple-800'
  if (['Physics', 'Chemistry', 'Biology'].includes(subject)) return 'bg-sky-50 text-sky-800'
  if (['Mathematics'].includes(subject)) return 'bg-rose-50 text-rose-800'
  if (['Urdu', 'Islamiyat', 'Pakistan Studies'].includes(subject)) return 'bg-gov-50 text-gov-800'
  return 'bg-navy-50 text-navy-800'
}

export default function TimetablePage() {
  const { user, linkedStudent, children: myChildren } = useAuth()
  const { db, setTimetable } = useData()
  const toast = useToast()
  const role = user?.roleKey
  const isLearner = role === 'student' || role === 'parent'
  const students = db.students || []
  const subjectList = useMemo(() => [...new Set([...(db.subjects || seedSubjects).map((s) => s.name), ...SPECIALS])], [db.subjects])
  const data = db.timetable || seedTimetable
  const classOptions = useMemo(() => [...new Set(students.map((s) => `${s.grade}-${s.section}`))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })), [students])

  const [classKey, setClassKey] = useState(() => {
    if (linkedStudent) return `${linkedStudent.grade}-${linkedStudent.section}`
    if (role === 'parent' && myChildren[0]) return `${myChildren[0].grade}-${myChildren[0].section}`
    return '10-A'
  })
  const [selectedChild, setSelectedChild] = useState(myChildren[0]?.id || '')
  const [editing, setEditing] = useState(null)
  const [subject, setSubject] = useState('')
  const today = todayName()
  const week = data[classKey] || {}

  const openCell = (day, index) => {
    setEditing({ day, index })
    setSubject(week[day]?.[index] || '')
  }

  const saveCell = () => {
    if (!editing) return
    const next = JSON.parse(JSON.stringify(data))
    if (!next[classKey]) next[classKey] = {}
    if (!next[classKey][editing.day]) next[classKey][editing.day] = Array.from({ length: periodTimes.length }, () => '')
    next[classKey][editing.day][editing.index] = subject || 'Free Period'
    setTimetable(next)
    toast.success(`${editing.day}, period ${editing.index + 1} set to ${subject || 'Free Period'}.`, 'Timetable updated')
    setEditing(null)
  }

  const printTimetable = () => {
    const rows = periodTimes.map((p, i) => {
      const row = { period: `P${p.period}`, time: p.time }
      DAYS.forEach((day) => { row[day] = week[day]?.[i] || '—' })
      return row
    })
    printTable('Class Timetable', [
      { key: 'period', label: 'Period' }, { key: 'time', label: 'Time' },
      ...DAYS.map((day) => ({ key: day, label: day.slice(0, 3) })),
    ], rows, [['Class', classKey], ['Academic year', db.settings?.academicYear], ['Periods per day', periodTimes.length]])
    toast.success('Timetable opened for printing.', 'Print ready')
  }

  return (
    <div>
      <PageHeader eyebrow="Academics" title="Class timetable"
        subtitle="Weekly period schedule, subject allocation and room timings for the current session."
        actions={
          <>
            <Button variant="outline" icon={Printer} onClick={printTimetable}>Print timetable</Button>
            {!isLearner ? <Badge tone="amber" className="!py-2">Click any cell to edit</Badge> : null}
          </>
        } />

      <div className="mb-4 flex flex-wrap items-end gap-2">
        {isLearner ? (
          role === 'parent' && myChildren.length > 1 ? (
            <Select value={selectedChild} onChange={(e) => {
              setSelectedChild(e.target.value)
              const c = myChildren.find((x) => x.id === e.target.value)
              if (c) setClassKey(`${c.grade}-${c.section}`)
            }} className="w-72" options={myChildren.map((c) => ({ value: c.id, label: `${c.name} · Grade ${c.grade}-${c.section}` }))} />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-900">
              Class {classKey} · {linkedStudent?.name || myChildren[0]?.name}
            </div>
          )
        ) : (
          <Field label="Class & section" className="w-48">
            <Select value={classKey} onChange={(e) => setClassKey(e.target.value)} options={classOptions} />
          </Field>
        )}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500">
          <CalendarClock size={14} className="mr-1.5 inline text-[var(--season-accent)]" />
          {periodTimes.length} periods · Monday to Saturday
        </div>
      </div>

      {!week.Monday ? (
        <EmptyState icon={CalendarClock} title="No timetable for this class" message="The timetable has not been configured yet." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full overflow-x-auto border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="w-24 px-4 py-3">Period</th>
                  <th className="w-28 px-4 py-3">Time</th>
                  {DAYS.map((day) => (
                    <th key={day} className={`px-3 py-3 ${day === today ? 'bg-[var(--season-badge)] text-[var(--season-accent)]' : ''}`}>
                      {day.slice(0, 3)} {day === today ? '· today' : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {periodTimes.map((p, i) => (
                  <tr key={p.period} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2.5 text-xs font-bold text-slate-500">P{p.period}</td>
                    <td className="px-4 py-2.5 text-[10px] text-slate-400">{p.time}</td>
                    {DAYS.map((day) => {
                      const value = week[day]?.[i] || 'Free Period'
                      return (
                        <td key={day} className={`px-2 py-2 ${day === today ? 'bg-[var(--season-badge)]/40' : ''}`}>
                          <button type="button" onClick={() => !isLearner && openCell(day, i)} disabled={isLearner}
                            className={`w-full rounded-lg px-2.5 py-2 text-left text-[11px] font-semibold transition ${subjectColor(value)} ${isLearner ? 'cursor-default' : 'hover:ring-2 hover:ring-[var(--season-accent)]/40'}`}>
                            <span className="flex items-center justify-between gap-1">
                              <span className="truncate">{value}</span>
                              {!isLearner ? <Pencil size={10} className="shrink-0 opacity-50" /> : null}
                            </span>
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3 text-[11px] text-slate-500">
            <span>Class {classKey} · {db.settings?.academicYear} · Timings {db.settings?.winterStartMonth === 11 ? '8:30 am – 1:30 pm' : '7:45 am – 1:45 pm'}</span>
            <span className="flex items-center gap-1.5"><Sparkles size={12} className="text-[var(--season-accent)]" /> {isLearner ? 'Read-only view' : 'Changes save instantly'}</span>
          </div>
        </Card>
      )}

      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit timetable period"
        subtitle={editing ? `${classKey} · ${editing.day} · Period ${editing.index + 1} (${periodTimes[editing.index]?.time})` : ''} size="sm"
        footer={<><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button variant="season" icon={Save} onClick={saveCell}>Save period</Button></>}>
        <Field label="Subject" hint="Choose a curriculum subject or a special period.">
          <Select value={subject} onChange={(e) => setSubject(e.target.value)} options={subjectList} placeholder="Select subject" />
        </Field>
      </Modal>
    </div>
  )
}
