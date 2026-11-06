import { useEffect, useMemo, useState } from 'react'
import {
  CalendarDays, CheckCheck, ClipboardCheck, Download, Printer, Save, UserCheck, Users,
} from 'lucide-react'
import {
  Badge, Button, Card, EmptyState, Field, PageHeader, ProgressBar, Select, StatCard, Tabs,
} from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { displayTeacher } from '../../data/mockData'
import { downloadCSV, formatDate, percentage, todayISO, uid } from '../../lib/utils'
import { printTable } from '../../lib/print'

const STATUSES = ['Present', 'Late', 'Leave', 'Absent']
const statusStyles = {
  Present: 'bg-emerald-600 text-white border-emerald-600',
  Late: 'bg-amber-500 text-white border-amber-500',
  Leave: 'bg-sky-500 text-white border-sky-500',
  Absent: 'bg-rose-600 text-white border-rose-600',
}
const dotStyles = { Present: 'bg-emerald-500', Late: 'bg-amber-500', Leave: 'bg-sky-500', Absent: 'bg-rose-500' }

function StatusPill({ status }) {
  return <Badge tone={status === 'Present' ? 'green' : status === 'Late' ? 'amber' : status === 'Leave' ? 'blue' : 'red'}>{status}</Badge>
}

/* --------------------------- Student / parent view --------------------------- */
function StudentAttendance({ student }) {
  const { db } = useData()
  const rows = (db.attendance || []).filter((a) => a.studentId === student.id)
  const months = [...new Set(rows.map((r) => r.date.slice(0, 7)))].sort()
  const [month, setMonth] = useState(months[months.length - 1] || todayISO().slice(0, 7))
  const monthRows = rows.filter((r) => r.date.startsWith(month)).sort((a, b) => a.date.localeCompare(b.date))
  const present = monthRows.filter((r) => r.status === 'Present').length
  const late = monthRows.filter((r) => r.status === 'Late').length
  const leave = monthRows.filter((r) => r.status === 'Leave').length
  const absent = monthRows.filter((r) => r.status === 'Absent').length
  const rate = percentage(present + late, monthRows.length)

  const [year, monthNumber] = month.split('-').map(Number)
  const firstDay = new Date(year, monthNumber - 1, 1).getDay()
  const daysInMonth = new Date(year, monthNumber, 0).getDate()
  const byDate = Object.fromEntries(monthRows.map((r) => [r.date, r.status]))
  const cells = [...Array.from({ length: firstDay }, () => null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const printReport = () => {
    printTable('Monthly Attendance Report', [
      { key: 'date', label: 'Date' },
      { key: 'day', label: 'Day' },
      { key: 'status', label: 'Status' },
      { key: 'remark', label: 'Remark' },
    ], monthRows.map((r) => ({
      date: formatDate(r.date),
      day: new Date(r.date).toLocaleDateString('en-GB', { weekday: 'long' }),
      status: r.status,
      remark: r.remark || '—',
    })), [
      ['Student', student.name],
      ['Class', `${student.grade}-${student.section}`],
      ['Roll number', student.rollNo],
      ['Month', month],
      ['Attendance', `${rate}% (${present + late}/${monthRows.length})`],
    ])
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardCheck} label="Attendance rate" value={`${rate}%`} hint={`${present + late} of ${monthRows.length} days`} tone="green" />
        <StatCard icon={UserCheck} label="Present" value={present} hint={`${late} late arrivals`} tone="sky" />
        <StatCard icon={CalendarDays} label="Leave approved" value={leave} hint="Approved family or medical leave" tone="navy" />
        <StatCard icon={Users} label="Absent" value={absent} hint="Unexcused absences" tone="rose" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
            <div>
              <h2 className="text-sm font-extrabold text-navy-900">Attendance calendar</h2>
              <p className="text-[11px] text-slate-400">{student.name} · Class {student.grade}-{student.section}</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
                className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-600" aria-label="Attendance month" />
              <Button variant="outline" size="sm" icon={Printer} onClick={printReport}>Print</Button>
            </div>
          </div>
          <div className="p-5">
            <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((day, i) => {
                if (!day) return <span key={`empty-${i}`} />
                const date = `${month}-${String(day).padStart(2, '0')}`
                const status = byDate[date]
                return (
                  <div key={date} className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-[11px] ${status ? `${dotStyles[status]} border-transparent text-white` : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                    title={status ? `${formatDate(date)}: ${status}` : formatDate(date)}>
                    <span className="font-bold">{day}</span>
                    {status ? <span className="text-[8px] uppercase">{status.slice(0, 1)}</span> : null}
                  </div>
                )
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-[10px] text-slate-500">
              {STATUSES.map((s) => <span key={s} className="flex items-center gap-1.5"><span className={`h-2 w-2 rounded-full ${dotStyles[s]}`} /> {s}</span>)}
            </div>
          </div>
        </Card>

        <Card>
          <div className="border-b border-slate-100 px-5 py-3.5">
            <h2 className="text-sm font-extrabold text-navy-900">Daily record</h2>
            <p className="text-[11px] text-slate-400">{monthRows.length} school days recorded</p>
          </div>
          {monthRows.length ? (
            <div className="max-h-[360px] divide-y divide-slate-100 overflow-y-auto">
              {[...monthRows].reverse().map((r) => (
                <div key={r.id} className="flex items-center gap-3 px-5 py-2.5">
                  <span className="w-20 shrink-0 text-[11px] font-semibold text-slate-600">{formatDate(r.date)}</span>
                  <span className="flex-1 text-[10px] text-slate-400">{new Date(r.date).toLocaleDateString('en-GB', { weekday: 'long' })}</span>
                  <StatusPill status={r.status} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={CalendarDays} title="No attendance recorded" message={`There are no attendance entries for ${month}.`} />
          )}
        </Card>
      </div>
    </div>
  )
}

/* --------------------------- Teacher / admin register --------------------------- */
export default function AttendancePage() {
  const { user, linkedStudent, children: myChildren } = useAuth()
  const { db, bulkUpsert } = useData()
  const toast = useToast()
  const role = user?.roleKey
  const isStudentView = role === 'student'
  const isParentView = role === 'parent'

  const students = db.students || []
  const attendance = db.attendance || []
  const classOptions = useMemo(
    () => [...new Set(students.map((s) => `${s.grade}-${s.section}`))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    [students],
  )
  const dates = useMemo(() => [...new Set(attendance.map((a) => a.date))].sort(), [attendance])
  const latest = dates[dates.length - 1]
  const [classKey, setClassKey] = useState('10-A')
  const [date, setDate] = useState(latest || todayISO())
  const [view, setView] = useState('daily')
  const [marks, setMarks] = useState({})
  const [saving, setSaving] = useState(false)
  const [selectedChild, setSelectedChild] = useState(myChildren[0]?.id || linkedStudent?.id || students[0]?.id)

  const classStudents = useMemo(
    () => students.filter((s) => `${s.grade}-${s.section}` === classKey).sort((a, b) => a.rollNo.localeCompare(b.rollNo)),
    [students, classKey],
  )

  useEffect(() => {
    const existing = attendance.filter((a) => a.grade === classKey && a.date === date)
    const next = {}
    classStudents.forEach((s) => {
      next[s.id] = existing.find((a) => a.studentId === s.id)?.status || 'Present'
    })
    setMarks(next)
  }, [classKey, date, attendance, classStudents])

  if (isStudentView) {
    const student = linkedStudent || students[0]
    return (
      <div>
        <PageHeader eyebrow="Academics" title="My attendance" subtitle="Your daily attendance record for the current session. Approved leave is shown separately from unexcused absence." />
        {student ? <StudentAttendance student={student} /> : <EmptyState title="Student record not found" />}
      </div>
    )
  }

  if (isParentView) {
    const child = myChildren.find((c) => c.id === selectedChild) || myChildren[0] || students[0]
    return (
      <div>
        <PageHeader eyebrow="Academics" title="Children’s attendance"
          subtitle="View daily attendance for each of your children."
          actions={
            myChildren.length > 1 ? (
              <Select value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)}
                options={myChildren.map((c) => ({ value: c.id, label: `${c.name} · Grade ${c.grade}-${c.section}` }))} className="w-64" />
            ) : null
          } />
        {child ? <StudentAttendance student={child} /> : <EmptyState title="No linked children found" />}
      </div>
    )
  }

  const counts = STATUSES.reduce((acc, status) => ({ ...acc, [status]: classStudents.filter((s) => marks[s.id] === status).length }), {})
  const rate = percentage((counts.Present || 0) + (counts.Late || 0), classStudents.length)
  const monthRows = attendance.filter((a) => a.grade === classKey && a.date.startsWith(date.slice(0, 7)))

  const setAll = (status) => {
    const next = {}
    classStudents.forEach((s) => { next[s.id] = status })
    setMarks(next)
    toast.info(`All students marked ${status.toLowerCase()}. Remember to save.`, 'Register updated')
  }

  const save = () => {
    if (!classStudents.length) {
      toast.error('There are no students in this class.', 'Nothing to save')
      return
    }
    setSaving(true)
    const records = classStudents.map((s) => {
      const existing = attendance.find((a) => a.date === date && a.studentId === s.id)
      return {
        id: existing?.id || uid('ATT'),
        date,
        studentId: s.id,
        studentName: s.name,
        grade: classKey,
        classId: `G${s.grade}-${s.section}`,
        status: marks[s.id] || 'Present',
        markedBy: displayTeacher(user?.name),
        remark: existing?.remark || '',
      }
    })
    window.setTimeout(() => {
      bulkUpsert('attendance', records)
      setSaving(false)
      toast.success(`Attendance saved for ${classKey} on ${formatDate(date)}.`, 'Register saved')
    }, 350)
  }

  const printRegister = () => {
    printTable('Daily Attendance Register', [
      { key: 'rollNo', label: 'Roll No' },
      { key: 'name', label: 'Student' },
      { key: 'status', label: 'Status' },
      { key: 'remark', label: 'Remark' },
    ], classStudents.map((s) => ({
      rollNo: s.rollNo,
      name: s.name,
      status: marks[s.id] || 'Present',
      remark: marks[s.id] === 'Leave' ? 'Approved leave' : marks[s.id] === 'Absent' ? 'Unexcused' : '—',
    })), [
      ['Class', classKey],
      ['Date', formatDate(date)],
      ['Marked by', displayTeacher(user?.name)],
      ['Attendance', `${rate}%`],
    ])
  }

  const exportCsv = () => {
    downloadCSV(`attendance-${classKey}-${date}.csv`, classStudents.map((s) => ({
      rollNo: s.rollNo, name: s.name, status: marks[s.id] || 'Present',
    })), [{ key: 'rollNo', label: 'Roll No' }, { key: 'name', label: 'Student' }, { key: 'status', label: 'Status' }])
    toast.success('Attendance register exported.', 'CSV ready')
  }

  const summaryRows = classStudents.map((s) => {
    const rows = monthRows.filter((r) => r.studentId === s.id)
    const p = rows.filter((r) => r.status === 'Present').length
    const l = rows.filter((r) => r.status === 'Late').length
    const lv = rows.filter((r) => r.status === 'Leave').length
    const a = rows.filter((r) => r.status === 'Absent').length
    return { ...s, present: p, late: l, leave: lv, absent: a, rate: percentage(p + l, rows.length) }
  })

  return (
    <div>
      <PageHeader
        eyebrow="Academics"
        title="Attendance register"
        subtitle="Mark daily attendance, review monthly summaries and print official registers."
        actions={
          <>
            <Button variant="outline" size="sm" icon={Download} onClick={exportCsv}>Export</Button>
            <Button variant="outline" size="sm" icon={Printer} onClick={printRegister}>Print register</Button>
            <Button variant="season" icon={Save} loading={saving} onClick={save}>Save attendance</Button>
          </>
        }
      />

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Students in class" value={classStudents.length} hint={`Class ${classKey}`} tone="navy" />
        <StatCard icon={CheckCheck} label="Present + late" value={`${(counts.Present || 0) + (counts.Late || 0)}`} hint={`${rate}% attendance`} tone="green" />
        <StatCard icon={CalendarDays} label="Leave approved" value={counts.Leave || 0} hint="Marked as approved leave" tone="sky" />
        <StatCard icon={UserCheck} label="Absent" value={counts.Absent || 0} hint="Unexcused absence" tone="rose" />
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field label="Class & section" className="sm:w-44">
              <Select value={classKey} onChange={(e) => setClassKey(e.target.value)} options={classOptions} />
            </Field>
            <Field label="Date" className="sm:w-44">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-base" aria-label="Attendance date" />
            </Field>
            <Field label="View" className="sm:w-44">
              <Select value={view} onChange={(e) => setView(e.target.value)} options={[{ value: 'daily', label: 'Daily register' }, { value: 'monthly', label: 'Monthly summary' }]} />
            </Field>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setAll('Present')}>Mark all present</Button>
            <Button variant="ghost" size="sm" onClick={() => setAll('Absent')}>Mark all absent</Button>
          </div>
        </div>

        {view === 'daily' ? (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 py-2 text-[11px] text-slate-500">
              <span>{formatDate(date)} · {new Date(date).toLocaleDateString('en-GB', { weekday: 'long' })} · {classStudents.length} students</span>
              <span className="hidden sm:inline">Changes are saved only when you click “Save attendance”.</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full overflow-x-auto text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Roll no</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Mark attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((s, i) => (
                    <tr key={s.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2.5 text-xs text-slate-400">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-100 text-[10px] font-bold text-navy-800">{s.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span>
                          <span className="font-semibold text-navy-900">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-slate-500">{s.rollNo}</td>
                      <td className="px-4 py-2.5"><StatusPill status={marks[s.id] || 'Present'} /></td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {STATUSES.map((status) => (
                            <button key={status} type="button" onClick={() => setMarks((prev) => ({ ...prev, [s.id]: status }))}
                              className={`rounded-md border px-2.5 py-1 text-[10px] font-bold transition ${marks[s.id] === status ? statusStyles[status] : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}>
                              {status}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <ProgressBar value={rate} className="w-40" showLabel />
                <span className="text-[11px] text-slate-400">{counts.Present} present · {counts.Late} late · {counts.Leave} leave · {counts.Absent} absent</span>
              </div>
              <Button variant="season" icon={Save} loading={saving} onClick={save}>Save attendance</Button>
            </div>
          </>
        ) : (
          <div>
            <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-2 text-[11px] text-slate-500">
              Monthly summary for {date.slice(0, 7)} · {monthRows.length} attendance records
            </div>
            <div className="overflow-x-auto">
              <table className="w-full overflow-x-auto text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Present</th>
                    <th className="px-4 py-3">Late</th>
                    <th className="px-4 py-3">Leave</th>
                    <th className="px-4 py-3">Absent</th>
                    <th className="px-4 py-3">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryRows.map((s) => (
                    <tr key={s.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2.5 font-semibold text-navy-900">{s.name}</td>
                      <td className="px-4 py-2.5 text-emerald-600">{s.present}</td>
                      <td className="px-4 py-2.5 text-amber-600">{s.late}</td>
                      <td className="px-4 py-2.5 text-sky-600">{s.leave}</td>
                      <td className="px-4 py-2.5 text-rose-600">{s.absent}</td>
                      <td className="px-4 py-2.5"><ProgressBar value={s.rate} className="w-24" showLabel /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-4 py-3">
              <Button variant="outline" size="sm" icon={Printer} onClick={() => printTable('Monthly Attendance Summary', [
                { key: 'name', label: 'Student' }, { key: 'present', label: 'Present' }, { key: 'late', label: 'Late' },
                { key: 'leave', label: 'Leave' }, { key: 'absent', label: 'Absent' }, { key: 'rate', label: 'Rate' },
              ], summaryRows, [['Class', classKey], ['Month', date.slice(0, 7)]])}>Print summary</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
