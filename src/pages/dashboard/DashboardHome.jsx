import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, Award, Banknote, Bell, BookOpen, Bus, CalendarClock,
  CalendarDays, CheckCheck, ClipboardCheck, ClipboardList, CreditCard, FileText,
  GraduationCap, Library, MessageSquare, NotebookPen, Package, Receipt, Settings,
  ShieldCheck, TrendingUp, Users, Wallet, Clock, Sparkles,
} from 'lucide-react'
import Icon from '../../components/Icon'
import { BarChart, DonutChart, LineChart } from '../../components/Charts'
import {
  Avatar, Badge, Button, Card, EmptyState, PageHeader, ProgressBar, StatCard,
} from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useSeason } from '../../context/SeasonContext'
import { displayTeacher, periodTimes, roleLabels, timetable } from '../../data/mockData'
import { formatDate, formatPKR, percentage } from '../../lib/utils'

const avg = (values) => (values.length ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length) : 0)
const isPresent = (status) => status === 'Present' || status === 'Late'

function schoolDayName() {
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  return day === 'Sunday' ? 'Monday' : day
}

function CardHead({ title, subtitle, action, icon: IconComponent }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        {IconComponent ? <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--season-badge)] text-[var(--season-accent)]"><IconComponent size={15} /></span> : null}
        <div>
          <h2 className="text-sm font-extrabold text-navy-900">{title}</h2>
          {subtitle ? <p className="text-[11px] text-slate-400">{subtitle}</p> : null}
        </div>
      </div>
      {action}
    </div>
  )
}

function QuickAction({ to, icon, label, text }) {
  return (
    <Link to={to} className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--season-badge)] text-[var(--season-accent)] transition group-hover:bg-[var(--season-accent)] group-hover:text-white">
        <Icon name={icon} size={17} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold text-navy-900">{label}</span>
        <span className="block text-[10px] leading-snug text-slate-400">{text}</span>
      </span>
      <ArrowUpRight size={13} className="ml-auto mt-0.5 shrink-0 text-slate-300 transition group-hover:text-[var(--season-accent)]" />
    </Link>
  )
}

function QuickActions({ items, title = 'Quick actions' }) {
  return (
    <Card>
      <CardHead title={title} icon={Sparkles} />
      <div className="grid gap-2.5 p-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => <QuickAction key={item.label} {...item} />)}
      </div>
    </Card>
  )
}

function Greeting() {
  const { user } = useAuth()
  const { season, currentMonth } = useSeason()
  const { db } = useData()
  const firstName = (user?.name || 'User').replace(/^(Prof\.|Ms\.|Mr\.|Engr\.|Dr\.)\s*/i, '').split(' ')[0]
  const role = user?.roleKey
  const subtitle = {
    superadmin: 'Full system overview — manage people, academics, finance and school settings.',
    admin: 'School-wide overview of enrolment, attendance, fees and pending approvals.',
    principal: 'A live view of academic performance, staff and student wellbeing.',
    teacher: `Your classes, attendance and assignments for ${season} term.`,
    student: 'Your attendance, results, timetable and fee status — all in one place.',
    parent: 'Your children’s progress, attendance, fees and school notices.',
    accountant: 'Fee collection, expenses and payroll at a glance.',
    librarian: 'Library circulation, availability and member activity.',
  }[role] || 'Welcome to your dashboard.'

  return (
    <PageHeader
      eyebrow={`${season} term · ${db.settings?.academicYear} · ${roleLabels[role] || ''}`}
      title={`Assalam-o-Alaikum, ${firstName}`}
      subtitle={subtitle}
      actions={
        <>
          <span className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-500 sm:flex">
            <CalendarDays size={13} className="text-[var(--season-accent)]" /> {currentMonth} · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short' })}
          </span>
          <Link to="/" className="btn-outline !py-2 !text-xs">View public site <ArrowUpRight size={13} /></Link>
        </>
      }
    />
  )
}

/* ------------------------------ Admin / Principal ------------------------------ */
function AdminHome() {
  const { db } = useData()
  const students = db.students || []
  const teachers = db.teachers || []
  const fees = db.fees || []
  const attendance = db.attendance || []
  const results = db.results || []
  const dates = [...new Set(attendance.map((a) => a.date))].sort()
  const latest = dates[dates.length - 1]
  const dayRows = attendance.filter((a) => a.date === latest)
  const present = dayRows.filter((a) => isPresent(a.status)).length
  const rate = percentage(present, dayRows.length)
  const paidTotal = fees.filter((f) => f.status === 'Paid').reduce((s, f) => s + f.amount + (f.fine || 0) - (f.discount || 0), 0)
  const outstanding = fees.filter((f) => f.status !== 'Paid').reduce((s, f) => s + f.amount + (f.fine || 0) - (f.discount || 0), 0)

  const gradeData = ['6', '7', '8', '9', '10'].map((g) => ({ label: `G${g}`, value: students.filter((s) => s.grade === g).length }))
  const months = ['August', 'September', 'October', 'November']
  const feeTrend = months.map((m) => ({
    label: m.slice(0, 3),
    value: fees.filter((f) => f.month === m && f.status === 'Paid').reduce((s, f) => s + f.amount, 0),
  }))
  const attendanceTrend = dates.slice(-8).map((date) => {
    const rows = attendance.filter((a) => a.date === date)
    return { label: date.slice(8), value: percentage(rows.filter((a) => isPresent(a.status)).length, rows.length) }
  })
  const statusSegments = [
    { label: 'Present', value: dayRows.filter((a) => a.status === 'Present').length, color: '#0f8a4f' },
    { label: 'Late', value: dayRows.filter((a) => a.status === 'Late').length, color: '#e0ac2b' },
    { label: 'Leave', value: dayRows.filter((a) => a.status === 'Leave').length, color: '#0ea5e9' },
    { label: 'Absent', value: dayRows.filter((a) => a.status === 'Absent').length, color: '#e11d48' },
  ]
  const letters = ['A+', 'A', 'B', 'C', 'D', 'E', 'F']
  const resultSegments = letters.map((letter, i) => ({
    label: letter,
    value: results.filter((r) => r.gradeLetter === letter).length,
    color: ['#0f8a4f', '#22c55e', '#84cc16', '#e0ac2b', '#f59e0b', '#f97316', '#e11d48'][i],
  })).filter((s) => s.value > 0)

  const pendingLeave = (db.leave || []).filter((l) => l.status === 'Pending').length
  const openComplaints = (db.complaints || []).filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length
  const pendingAdmissions = (db.admissions || []).filter((a) => a.status === 'Under Review' || a.status === 'Pending Documents').length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Students enrolled" value={students.length * 52} hint={`${students.length} records in the demo`} tone="navy" trend="+4.2% vs last term" />
        <StatCard icon={GraduationCap} label="Faculty & staff" value={teachers.length + 52} hint="64 teaching and support staff" tone="green" />
        <StatCard icon={ClipboardCheck} label="Attendance today" value={`${rate}%`} hint={`${present} of ${dayRows.length} marked present`} tone="sky" />
        <StatCard icon={Wallet} label="Fees outstanding" value={formatPKR(outstanding)} hint={`${formatPKR(paidTotal)} collected this session`} tone="gold" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHead title="Enrolment by grade" subtitle="Current demo cohort across Grades 6–10" icon={Users}
            action={<Link to="/dashboard/students" className="text-[11px] font-bold text-[var(--season-accent)] hover:underline">All students</Link>} />
          <div className="p-5"><BarChart data={gradeData} suffix=" students" /></div>
        </Card>
        <Card>
          <CardHead title="Attendance snapshot" subtitle={latest ? formatDate(latest) : 'Latest marked day'} icon={ClipboardCheck} />
          <div className="p-5">
            <DonutChart segments={statusSegments} centerValue={`${rate}%`} centerLabel="Present" />
            <Link to="/dashboard/attendance" className="btn-outline mt-4 w-full !py-2 !text-xs">Open attendance register <ArrowRight size={13} /></Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHead title="Fee collection trend" subtitle="Paid tuition by month, 2026–27" icon={TrendingUp} />
          <div className="p-5"><LineChart data={feeTrend} suffix="" color="#0f6b3d" /></div>
        </Card>
        <Card>
          <CardHead title="Result distribution" subtitle="First term, all subjects" icon={Award} />
          <div className="p-5"><DonutChart segments={resultSegments} centerLabel="Results" /></div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHead title="Recent activity" subtitle="Latest actions across the system" icon={Clock}
            action={<Link to="/dashboard/activity" className="text-[11px] font-bold text-[var(--season-accent)] hover:underline">Full log</Link>} />
          <div className="divide-y divide-slate-100">
            {(db.activity || []).slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-3 px-5 py-3">
                <Avatar name={log.user} size="xs" color="bg-navy-700" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-700">{log.action}</p>
                  <p className="text-[10px] text-slate-400">{log.user} · {log.module} · {log.date}</p>
                </div>
                <Badge tone="slate">{log.module}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="Needs your attention" subtitle="Pending approvals and requests" icon={Bell} />
          <div className="space-y-2.5 p-4">
            {[
              { label: 'Leave requests pending', value: pendingLeave, to: '/dashboard/leave', icon: CalendarClock, tone: 'amber' },
              { label: 'Open complaints', value: openComplaints, to: '/dashboard/complaints', icon: MessageSquare, tone: 'rose' },
              { label: 'Admissions under review', value: pendingAdmissions, to: '/dashboard/admissions', icon: FileText, tone: 'sky' },
              { label: 'Payroll pending', value: (db.payroll || []).filter((p) => p.status === 'Pending').length, to: '/dashboard/payroll', icon: Banknote, tone: 'green' },
            ].map((item) => (
              <Link key={item.label} to={item.to} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-navy-300 hover:bg-slate-50">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><item.icon size={16} /></span>
                <span className="flex-1 text-xs font-semibold text-slate-700">{item.label}</span>
                <span className="text-lg font-extrabold text-navy-900">{item.value}</span>
                <ArrowRight size={14} className="text-slate-300" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <QuickActions items={[
        { to: '/dashboard/students', icon: 'Users', label: 'Add a student', text: 'Enrol a new learner' },
        { to: '/dashboard/fees', icon: 'Receipt', label: 'Collect fees', text: 'Record a payment' },
        { to: '/dashboard/attendance', icon: 'ClipboardCheck', label: 'Attendance', text: 'Review today’s register' },
        { to: '/dashboard/settings', icon: 'Settings', label: 'School settings', text: 'Season, year & profile' },
      ]} />
    </div>
  )
}

/* ------------------------------ Teacher ------------------------------ */
function TeacherHome() {
  const { linkedTeacher, user } = useAuth()
  const { db } = useData()
  const teacher = linkedTeacher || (db.teachers || [])[0]
  const classKey = '10-A'
  const students = (db.students || []).filter((s) => `${s.grade}-${s.section}` === classKey)
  const attendance = db.attendance || []
  const dates = [...new Set(attendance.map((a) => a.date))].sort()
  const latest = dates[dates.length - 1]
  const classRows = attendance.filter((a) => a.date === latest && a.grade === classKey)
  const present = classRows.filter((a) => isPresent(a.status)).length
  const rate = percentage(present, classRows.length)
  const results = (db.results || []).filter((r) => r.grade === classKey)
  const subjectNames = [...new Set(results.map((r) => r.subject))]
  const subjectData = subjectNames.map((subject) => ({
    label: subject.length > 6 ? subject.slice(0, 5) : subject,
    value: avg(results.filter((r) => r.subject === subject).map((r) => r.obtained)),
  }))
  const assignments = (db.assignments || []).filter((a) => a.class === classKey)
  const teacherIdentities = [teacher?.name, user?.name, displayTeacher(teacher?.name)]
  const messages = (db.messages || []).filter((m) => (m.participants || []).some((p) => teacherIdentities.includes(p)))
  const day = schoolDayName()
  const periods = timetable[classKey]?.[day] || []

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="My students" value={students.length} hint={`Class ${classKey} · ${displayTeacher(teacher?.subject)}`} tone="navy" />
        <StatCard icon={ClipboardCheck} label="Class attendance" value={`${rate}%`} hint={`${present} of ${classRows.length} present`} tone="green" />
        <StatCard icon={NotebookPen} label="Open assignments" value={assignments.filter((a) => a.status === 'Open').length} hint={`${assignments.length} assigned this term`} tone="gold" />
        <StatCard icon={MessageSquare} label="Unread messages" value={messages.reduce((s, m) => s + (m.unread || 0), 0)} hint={`${messages.length} conversations`} tone="sky" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHead title={`${day}’s timetable`} subtitle={`Class ${classKey} · ${periodTimes.length} periods`} icon={CalendarClock}
            action={<Link to="/dashboard/timetable" className="text-[11px] font-bold text-[var(--season-accent)] hover:underline">Full week</Link>} />
          <div className="divide-y divide-slate-100">
            {periods.length ? periods.map((subject, i) => (
              <div key={`${subject}-${i}`} className="flex items-center gap-3 px-5 py-2.5">
                <span className="w-6 text-[10px] font-bold text-slate-400">P{i + 1}</span>
                <span className="flex-1 text-xs font-semibold text-slate-700">{subject}</span>
                <span className="text-[10px] text-slate-400">{periodTimes[i]?.time}</span>
              </div>
            )) : <p className="px-5 py-6 text-center text-xs text-slate-400">No timetable found for this class.</p>}
          </div>
        </Card>

        <Card>
          <CardHead title="Class performance" subtitle={`Average marks by subject · ${classKey}`} icon={TrendingUp}
            action={<Link to="/dashboard/results" className="text-[11px] font-bold text-[var(--season-accent)] hover:underline">Enter results</Link>} />
          <div className="p-5"><BarChart data={subjectData} suffix="%" color="#0f6b3d" /></div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHead title="Attendance register" subtitle={latest ? `Last marked: ${formatDate(latest)}` : 'No attendance yet'} icon={ClipboardCheck} />
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Present today</p>
                <p className="text-2xl font-extrabold text-navy-900">{present}<span className="text-sm text-slate-400"> / {classRows.length}</span></p>
              </div>
              <div className="flex gap-2 text-center">
                {['Present', 'Late', 'Absent'].map((s) => (
                  <div key={s} className="rounded-lg bg-white px-3 py-1.5 ring-1 ring-slate-200">
                    <p className="text-sm font-extrabold text-navy-900">{classRows.filter((r) => r.status === s).length}</p>
                    <p className="text-[9px] font-bold uppercase text-slate-400">{s}</p>
                  </div>
                ))}
              </div>
            </div>
            <ProgressBar value={rate} showLabel />
            <Link to="/dashboard/attendance" className="btn-season mt-4 w-full"><ClipboardCheck size={15} /> Mark attendance</Link>
          </div>
        </Card>

        <Card>
          <CardHead title="Assignments & messages" subtitle="Work due and recent conversations" icon={NotebookPen} />
          <div className="divide-y divide-slate-100">
            {assignments.slice(0, 2).map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-50 text-gold-700"><NotebookPen size={14} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-700">{a.title}</p>
                  <p className="text-[10px] text-slate-400">Due {formatDate(a.dueDate)} · {a.submissions}/{a.total} submitted</p>
                </div>
                <Badge tone={a.status === 'Open' ? 'green' : 'slate'}>{a.status}</Badge>
              </div>
            ))}
            {messages.slice(0, 2).map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700"><MessageSquare size={14} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-700">{m.subject}</p>
                  <p className="text-[10px] text-slate-400">{m.participants.join(' · ')}</p>
                </div>
                {m.unread ? <Badge tone="amber">{m.unread} new</Badge> : null}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 p-4">
            <Link to="/dashboard/messages" className="btn-outline w-full !py-2 !text-xs">Open messages</Link>
          </div>
        </Card>
      </div>

      <QuickActions items={[
        { to: '/dashboard/attendance', icon: 'ClipboardCheck', label: 'Mark attendance', text: 'Class 10-A register' },
        { to: '/dashboard/results', icon: 'BarChart3', label: 'Enter results', text: 'First term marks' },
        { to: '/dashboard/assignments', icon: 'NotebookPen', label: 'New assignment', text: 'Set homework' },
        { to: '/dashboard/messages', icon: 'MessageSquare', label: 'Message parents', text: 'Reply to families' },
      ]} />
    </div>
  )
}

/* ------------------------------ Student ------------------------------ */
function StudentHome() {
  const { linkedStudent } = useAuth()
  const { db } = useData()
  const student = linkedStudent || (db.students || [])[0]
  const classKey = student ? `${student.grade}-${student.section}` : '10-A'
  const myResults = (db.results || []).filter((r) => r.studentId === student?.id)
  const myFees = (db.fees || []).filter((f) => f.studentId === student?.id)
  const myAttendance = (db.attendance || []).filter((a) => a.studentId === student?.id)
  const average = myResults.length ? Math.round(myResults.reduce((s, r) => s + r.obtained, 0) / myResults.length) : 0
  const attendanceRate = myAttendance.length
    ? percentage(myAttendance.filter((a) => isPresent(a.status)).length, myAttendance.length)
    : student?.attendance || 0
  const unpaid = myFees.find((f) => f.status !== 'Paid')
  const day = schoolDayName()
  const periods = timetable[classKey]?.[day] || []
  const subjectData = myResults.map((r) => ({ label: r.code || r.subject.slice(0, 4), value: r.obtained }))
  const nextExam = (db.exams || []).find((e) => e.status === 'Scheduled')

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardCheck} label="My attendance" value={`${attendanceRate}%`} hint={`${myAttendance.length} days recorded`} tone="green" />
        <StatCard icon={TrendingUp} label="Term average" value={`${average}%`} hint={`${myResults.length} subjects assessed`} tone="navy" />
        <StatCard icon={Wallet} label="Fee status" value={unpaid ? 'Due' : 'Paid'} hint={unpaid ? `${unpaid.month} · ${formatPKR(unpaid.amount)}` : 'All dues cleared'} tone={unpaid ? 'gold' : 'green'} />
        <StatCard icon={CalendarDays} label="Next examination" value={nextExam ? nextExam.name.split(' ')[0] : '—'} hint={nextExam ? formatDate(nextExam.startDate) : 'No scheduled exam'} tone="sky" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHead title={`${day}’s timetable`} subtitle={`Class ${classKey}`} icon={CalendarClock}
            action={<Link to="/dashboard/timetable" className="text-[11px] font-bold text-[var(--season-accent)] hover:underline">Full week</Link>} />
          <div className="divide-y divide-slate-100">
            {periods.length ? periods.map((subject, i) => (
              <div key={`${subject}-${i}`} className="flex items-center gap-3 px-5 py-2.5">
                <span className="w-6 text-[10px] font-bold text-slate-400">P{i + 1}</span>
                <span className="flex-1 text-xs font-semibold text-slate-700">{subject}</span>
                <span className="text-[10px] text-slate-400">{periodTimes[i]?.time}</span>
              </div>
            )) : <p className="px-5 py-6 text-center text-xs text-slate-400">No classes scheduled today.</p>}
          </div>
        </Card>

        <Card>
          <CardHead title="Subject performance" subtitle="First term marks out of 100" icon={BarChart3Icon}
            action={<Link to="/dashboard/results" className="text-[11px] font-bold text-[var(--season-accent)] hover:underline">View results</Link>} />
          <div className="p-5"><BarChart data={subjectData} suffix="%" color="#0f6b3d" /></div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHead title="Recent results" subtitle="First term 2026" icon={Award}
            action={<Link to="/dashboard/report-cards" className="text-[11px] font-bold text-[var(--season-accent)] hover:underline">Report card</Link>} />
          <div className="divide-y divide-slate-100">
            {myResults.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-5 py-2.5">
                <span className="flex-1 text-xs font-semibold text-slate-700">{r.subject}</span>
                <span className="text-xs text-slate-400">{r.obtained}/100</span>
                <Badge tone={r.obtained >= 80 ? 'green' : r.obtained >= 60 ? 'amber' : 'red'}>{r.gradeLetter}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHead title="Fee & dues" subtitle="Session 2026–27" icon={Receipt}
            action={<Link to="/dashboard/fees" className="text-[11px] font-bold text-[var(--season-accent)] hover:underline">Open fees</Link>} />
          <div className="p-5">
            {unpaid ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Voucher due</p>
                    <p className="text-lg font-extrabold text-navy-900">{formatPKR(unpaid.amount + (unpaid.fine || 0))}</p>
                    <p className="text-[11px] text-amber-800">{unpaid.month} 2026 · due {formatDate(unpaid.dueDate)}</p>
                  </div>
                  <Badge tone="amber">{unpaid.status}</Badge>
                </div>
                <Link to="/dashboard/fees" className="btn-gold mt-3 w-full !py-2 !text-xs">View & print voucher</Link>
              </div>
            ) : (
              <EmptyState icon={CheckCheck} title="All fees cleared" message="Your fee account is up to date. Receipts are available in the fees section." />
            )}
            <div className="mt-3 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-slate-50 p-2.5">
                <p className="text-lg font-extrabold text-navy-900">{myFees.filter((f) => f.status === 'Paid').length}</p>
                <p className="text-[9px] font-bold uppercase text-slate-400">Paid months</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2.5">
                <p className="text-lg font-extrabold text-navy-900">{myFees.filter((f) => f.status !== 'Paid').length}</p>
                <p className="text-[9px] font-bold uppercase text-slate-400">Pending</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <QuickActions items={[
        { to: '/dashboard/report-cards', icon: 'FileBadge', label: 'Report card', text: 'Print term result' },
        { to: '/dashboard/attendance', icon: 'ClipboardCheck', label: 'My attendance', text: 'View daily record' },
        { to: '/dashboard/library', icon: 'Library', label: 'Library', text: 'Browse the catalogue' },
        { to: '/dashboard/id-cards', icon: 'CreditCard', label: 'ID card', text: 'View & print' },
      ]} />
    </div>
  )
}

function BarChart3Icon(props) {
  return <TrendingUp {...props} />
}

/* ------------------------------ Parent ------------------------------ */
function ParentHome() {
  const { linkedParent, children: myChildren } = useAuth()
  const { db } = useData()
  const kids = myChildren.length ? myChildren : (db.students || []).slice(0, 2)
  const childIds = kids.map((k) => k.id)
  const fees = (db.fees || []).filter((f) => childIds.includes(f.studentId))
  const unpaid = fees.filter((f) => f.status !== 'Paid')
  const outstanding = unpaid.reduce((s, f) => s + f.amount + (f.fine || 0) - (f.discount || 0), 0)
  const attendance = (db.attendance || []).filter((a) => childIds.includes(a.studentId))
  const dates = [...new Set(attendance.map((a) => a.date))].sort().slice(-8)
  const trend = dates.map((date) => {
    const rows = attendance.filter((a) => a.date === date)
    return { label: date.slice(8), value: percentage(rows.filter((a) => isPresent(a.status)).length, rows.length) }
  })
  const avgAttendance = avg(kids.map((k) => k.attendance || 0))
  const ptms = (db.ptms || []).filter((p) => p.parent === linkedParent?.name || childIds.some((id) => kids.find((k) => k.id === id)?.name === p.student))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="My children" value={kids.length} hint="Linked student records" tone="navy" />
        <StatCard icon={ClipboardCheck} label="Average attendance" value={`${avgAttendance}%`} hint="Across all children" tone="green" />
        <StatCard icon={Wallet} label="Outstanding fees" value={formatPKR(outstanding)} hint={`${unpaid.length} pending invoice${unpaid.length === 1 ? '' : 's'}`} tone="gold" />
        <StatCard icon={CalendarDays} label="Upcoming PTMs" value={ptms.filter((p) => p.status === 'Scheduled').length} hint="Parent–teacher meetings" tone="sky" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {kids.map((child) => {
          const childResults = (db.results || []).filter((r) => r.studentId === child.id)
          const childAvg = childResults.length ? Math.round(childResults.reduce((s, r) => s + r.obtained, 0) / childResults.length) : 0
          const childDue = fees.filter((f) => f.studentId === child.id && f.status !== 'Paid')
          return (
            <Card key={child.id} className="p-5">
              <div className="flex items-start gap-3">
                <Avatar name={child.name} size="md" color="bg-navy-800" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-extrabold text-navy-900">{child.name}</h3>
                  <p className="text-[11px] text-slate-500">Grade {child.grade}-{child.section} · {child.group} · Roll {child.rollNo}</p>
                </div>
                <Badge tone={childDue.length ? 'amber' : 'green'}>{childDue.length ? 'Fee due' : 'Fees paid'}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="text-base font-extrabold text-navy-900">{child.attendance}%</p>
                  <p className="text-[9px] font-bold uppercase text-slate-400">Attendance</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="text-base font-extrabold text-navy-900">{childAvg}%</p>
                  <p className="text-[9px] font-bold uppercase text-slate-400">Average</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="text-base font-extrabold text-navy-900">{child.house}</p>
                  <p className="text-[9px] font-bold uppercase text-slate-400">House</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Link to="/dashboard/results" className="chip">Results</Link>
                <Link to="/dashboard/attendance" className="chip">Attendance</Link>
                <Link to="/dashboard/fees" className="chip">Fees</Link>
                <Link to="/dashboard/report-cards" className="chip">Report card</Link>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHead title="Attendance trend" subtitle="Combined attendance, last 8 school days" icon={TrendingUp} />
          <div className="p-5"><LineChart data={trend} color="#0f6b3d" /></div>
        </Card>
        <Card>
          <CardHead title="Fee summary" subtitle="Session 2026–27" icon={Receipt}
            action={<Link to="/dashboard/fees" className="text-[11px] font-bold text-[var(--season-accent)] hover:underline">Pay / print</Link>} />
          <div className="p-5">
            <DonutChart
              segments={[
                { label: 'Paid', value: fees.filter((f) => f.status === 'Paid').length, color: '#0f8a4f' },
                { label: 'Unpaid', value: unpaid.length, color: '#e0ac2b' },
              ]}
              centerLabel="Invoices"
            />
            {unpaid.length ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-[11px] font-bold text-amber-800">Next due: {unpaid[0].month} 2026 · {formatPKR(unpaid[0].amount + (unpaid[0].fine || 0))}</p>
                <p className="text-[10px] text-amber-700">Due date {formatDate(unpaid[0].dueDate)}. Late fee applies after the due date.</p>
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHead title="Parent–Teacher Meetings" subtitle="Upcoming appointments" icon={CalendarDays}
            action={<Link to="/dashboard/ptms" className="text-[11px] font-bold text-[var(--season-accent)] hover:underline">All PTMs</Link>} />
          <div className="divide-y divide-slate-100">
            {ptms.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-navy-900 text-white">
                  <span className="text-sm font-extrabold leading-none">{new Date(p.date).getDate()}</span>
                  <span className="text-[8px] uppercase text-gold-400">{new Date(p.date).toLocaleDateString('en-GB', { month: 'short' })}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-700">{p.student} · {displayTeacher(p.teacher)}</p>
                  <p className="text-[10px] text-slate-400">{p.time} · {p.mode} · Class {p.class}</p>
                </div>
                <Badge tone={p.status === 'Scheduled' ? 'amber' : p.status === 'Completed' ? 'green' : 'red'}>{p.status}</Badge>
              </div>
            ))}
            {!ptms.length ? <p className="px-5 py-6 text-center text-xs text-slate-400">No meetings scheduled.</p> : null}
          </div>
        </Card>
        <Card>
          <CardHead title="Quick links for parents" subtitle="Everything you need" icon={Sparkles} />
          <div className="grid gap-2.5 p-4 sm:grid-cols-2">
            {[
              { to: '/dashboard/children', icon: 'Baby', label: 'My children', text: 'Full student profiles' },
              { to: '/dashboard/fees', icon: 'Receipt', label: 'Fees & vouchers', text: 'Pay and print receipts' },
              { to: '/dashboard/complaints', icon: 'MessageSquareWarning', label: 'Raise a concern', text: 'Track your ticket' },
              { to: '/dashboard/messages', icon: 'MessageSquare', label: 'Message teachers', text: 'Ask a question' },
            ].map((item) => <QuickAction key={item.label} {...item} />)}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------ Accountant ------------------------------ */
function AccountantHome() {
  const { db } = useData()
  const fees = db.fees || []
  const expenses = db.expenses || []
  const payroll = db.payroll || []
  const paidFees = fees.filter((f) => f.status === 'Paid')
  const collected = paidFees.reduce((s, f) => s + f.amount + (f.fine || 0) - (f.discount || 0), 0)
  const outstanding = fees.filter((f) => f.status !== 'Paid').reduce((s, f) => s + f.amount + (f.fine || 0) - (f.discount || 0), 0)
  const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0)
  const payrollPending = payroll.filter((p) => p.status === 'Pending').length
  const months = ['August', 'September', 'October', 'November']
  const collection = months.map((m) => ({
    label: m.slice(0, 3),
    value: fees.filter((f) => f.month === m && f.status === 'Paid').reduce((s, f) => s + f.amount, 0),
  }))
  const categories = [...new Set(expenses.map((e) => e.category))]
  const expenseSegments = categories.map((category, i) => ({
    label: category,
    value: expenses.filter((e) => e.category === category).reduce((s, e) => s + e.amount, 0),
    color: ['#0f6b3d', '#0b2545', '#e0ac2b', '#0ea5e9', '#e11d48', '#7c3aed'][i % 6],
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Wallet} label="Fees collected" value={formatPKR(collected)} hint={`${paidFees.length} paid invoices`} tone="green" />
        <StatCard icon={Receipt} label="Outstanding" value={formatPKR(outstanding)} hint={`${fees.filter((f) => f.status !== 'Paid').length} pending invoices`} tone="gold" />
        <StatCard icon={Banknote} label="Expenses recorded" value={formatPKR(expenseTotal)} hint={`${expenses.length} vouchers`} tone="navy" />
        <StatCard icon={Users} label="Payroll pending" value={payrollPending} hint={`${payroll.length} staff on payroll`} tone="sky" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHead title="Monthly fee collection" subtitle="Paid tuition by month" icon={TrendingUp} />
          <div className="p-5"><BarChart data={collection} color="#0f6b3d" /></div>
        </Card>
        <Card>
          <CardHead title="Expense breakdown" subtitle="Current session" icon={Wallet} />
          <div className="p-5"><DonutChart segments={expenseSegments} centerLabel="PKR" centerValue={Math.round(expenseTotal / 1000) + 'k'} /></div>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHead title="Recent payments" subtitle="Latest receipts issued" icon={Receipt}
            action={<Link to="/dashboard/fees" className="text-[11px] font-bold text-[var(--season-accent)] hover:underline">All fees</Link>} />
          <div className="divide-y divide-slate-100">
            {paidFees.slice(0, 6).map((f) => (
              <div key={f.id} className="flex items-center gap-3 px-5 py-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gov-50 text-gov-700"><Receipt size={14} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-700">{f.studentName} · {f.month}</p>
                  <p className="text-[10px] text-slate-400">{f.voucherNo} · {f.method || 'Cash'} · {formatDate(f.paidDate)}</p>
                </div>
                <span className="text-xs font-bold text-navy-900">{formatPKR(f.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHead title="Finance actions" subtitle="Common tasks" icon={Sparkles} />
          <div className="grid gap-2.5 p-4">
            {[
              { to: '/dashboard/fees', icon: 'Receipt', label: 'Collect a payment', text: 'Search student and issue a receipt' },
              { to: '/dashboard/payroll', icon: 'Banknote', label: 'Process payroll', text: 'Generate monthly payslips' },
              { to: '/dashboard/expenses', icon: 'Wallet', label: 'Record an expense', text: 'Add a vendor voucher' },
              { to: '/dashboard/reports', icon: 'TrendingUp', label: 'Financial reports', text: 'Print collection summaries' },
            ].map((item) => <QuickAction key={item.label} {...item} />)}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ------------------------------ Librarian ------------------------------ */
function LibrarianHome() {
  const { db } = useData()
  const books = db.library || []
  const totalCopies = books.reduce((s, b) => s + (b.copies || 0), 0)
  const available = books.reduce((s, b) => s + (b.available || 0), 0)
  const issued = totalCopies - available
  const categories = [...new Set(books.map((b) => b.category))]
  const segments = categories.map((category, i) => ({
    label: category,
    value: books.filter((b) => b.category === category).reduce((s, b) => s + (b.copies || 0), 0),
    color: ['#0f6b3d', '#0b2545', '#e0ac2b', '#0ea5e9', '#e11d48', '#7c3aed'][i % 6],
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Library} label="Titles catalogued" value={books.length} hint={`${totalCopies} total copies`} tone="navy" />
        <StatCard icon={BookOpen} label="Copies available" value={available} hint="Ready to issue" tone="green" />
        <StatCard icon={Users} label="Copies issued" value={issued} hint="Currently with members" tone="gold" />
        <StatCard icon={Package} label="Low availability" value={books.filter((b) => b.available <= 1).length} hint="Titles needing restock" tone="rose" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHead title="Collection by category" subtitle="Copies in the catalogue" icon={Library} />
          <div className="p-5"><DonutChart segments={segments} centerLabel="Copies" centerValue={totalCopies} /></div>
        </Card>
        <Card>
          <CardHead title="Needs attention" subtitle="Low or zero availability" icon={Package}
            action={<Link to="/dashboard/library" className="text-[11px] font-bold text-[var(--season-accent)] hover:underline">Manage library</Link>} />
          <div className="divide-y divide-slate-100">
            {books.filter((b) => b.available <= 2).slice(0, 6).map((b) => (
              <div key={b.id} className="flex items-center gap-3 px-5 py-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500"><BookOpen size={15} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-700">{b.title}</p>
                  <p className="text-[10px] text-slate-400">{b.author} · Shelf {b.shelf}</p>
                </div>
                <Badge tone={b.available === 0 ? 'red' : 'amber'}>{b.available} left</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <QuickActions items={[
        { to: '/dashboard/library', icon: 'Library', label: 'Add a book', text: 'Catalogue a new title' },
        { to: '/dashboard/library', icon: 'BookOpen', label: 'Issue / return', text: 'Update availability' },
        { to: '/dashboard/students', icon: 'Users', label: 'Member directory', text: 'Find a student' },
        { to: '/dashboard/inventory', icon: 'Package', label: 'Inventory', text: 'Check library stock' },
      ]} />
    </div>
  )
}

/* ------------------------------ Notices ------------------------------ */
function NoticesRow() {
  const { db, markNotificationRead, markAllNotificationsRead } = useData()
  const notifications = (db.notifications || []).slice(0, 4)
  return (
    <Card>
      <CardHead title="Notices & notifications" subtitle="Latest announcements from the school" icon={Bell}
        action={
          <div className="flex items-center gap-2">
            <button type="button" onClick={markAllNotificationsRead} className="text-[10px] font-bold text-slate-500 hover:text-navy-900">Mark all read</button>
            <Link to="/dashboard/notifications" className="text-[11px] font-bold text-[var(--season-accent)] hover:underline">View all</Link>
          </div>
        } />
      <div className="divide-y divide-slate-100">
        {notifications.map((n) => (
          <div key={n.id} className="flex items-start gap-3 px-5 py-3">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-slate-200' : 'bg-[var(--season-accent)]'}`} />
            <div className="min-w-0 flex-1">
              <p className={`text-xs ${n.read ? 'font-medium text-slate-600' : 'font-bold text-navy-900'}`}>{n.title}</p>
              <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">{n.message}</p>
            </div>
            <span className="shrink-0 text-[10px] text-slate-400">{formatDate(n.date)}</span>
            {!n.read ? (
              <button type="button" onClick={() => markNotificationRead(n.id)} className="shrink-0 text-[10px] font-bold text-[var(--season-accent)] hover:underline">Read</button>
            ) : null}
          </div>
        ))}
        {!notifications.length ? <p className="px-5 py-6 text-center text-xs text-slate-400">No notifications.</p> : null}
      </div>
    </Card>
  )
}

export default function DashboardHome() {
  const { user } = useAuth()
  const role = user?.roleKey
  return (
    <div className="space-y-6">
      <Greeting />
      {role === 'superadmin' || role === 'admin' || role === 'principal' ? <AdminHome /> : null}
      {role === 'teacher' ? <TeacherHome /> : null}
      {role === 'student' ? <StudentHome /> : null}
      {role === 'parent' ? <ParentHome /> : null}
      {role === 'accountant' ? <AccountantHome /> : null}
      {role === 'librarian' ? <LibrarianHome /> : null}
      <NoticesRow />
    </div>
  )
}
