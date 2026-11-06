import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Award, BarChart3, Download, FileBadge, Pencil, Plus, Printer, Save, Search,
  Trash2, TrendingUp, Users,
} from 'lucide-react'
import { BarChart } from '../../components/Charts'
import {
  Badge, Button, Card, ConfirmDialog, EmptyState, Field, IconButton, Input, Modal,
  PageHeader, Pagination, ProgressBar, SearchInput, Select, StatCard, Table, Tabs,
} from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { displayTeacher } from '../../data/mockData'
import { resourceConfigs } from '../../data/resourceConfigs'
import { downloadCSV, formatDate, gradeFromMarks, paginate, percentage, sortRows, todayISO, uid } from '../../lib/utils'
import { printTable } from '../../lib/print'

const TERMS = ['First Term', 'Second Term', 'Pre-Board', 'Annual']
const SUBJECTS = ['English', 'Urdu', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Islamiyat', 'Pakistan Studies']
const CODES = { English: 'ENG', Urdu: 'URD', Mathematics: 'MATH', Physics: 'PHY', Chemistry: 'CHEM', Biology: 'BIO', Islamiyat: 'ISL', 'Pakistan Studies': 'PST' }
const letterTone = (letter) => (['A+', 'A'].includes(letter) ? 'green' : ['B', 'C'].includes(letter) ? 'amber' : 'red')

function SummaryCard({ label, value, hint, tone = 'navy' }) {
  return <StatCard icon={Award} label={label} value={value} hint={hint} tone={tone} />
}

function LearnerResults({ student, term, setTerm, childrenList, selectedChild, setSelectedChild }) {
  const { db } = useData()
  const rows = (db.results || []).filter((r) => r.studentId === student?.id && r.term === term)
  const total = rows.reduce((s, r) => s + Number(r.obtained || 0), 0)
  const max = rows.reduce((s, r) => s + Number(r.total || 100), 0)
  const pct = percentage(total, max)
  const best = rows.length ? [...rows].sort((a, b) => b.obtained - a.obtained)[0] : null
  const weakest = rows.length ? [...rows].sort((a, b) => a.obtained - b.obtained)[0] : null
  const classRows = (db.results || []).filter((r) => r.grade === `${student?.grade}-${student?.section}` && r.term === term)

  const printResult = () => {
    printTable('First Term Result Sheet', [
      { key: 'subject', label: 'Subject' },
      { key: 'code', label: 'Code' },
      { key: 'total', label: 'Total' },
      { key: 'obtained', label: 'Obtained' },
      { key: 'gradeLetter', label: 'Grade' },
      { key: 'teacher', label: 'Teacher' },
    ], rows.map((r) => ({ ...r, teacher: displayTeacher(r.teacher) })), [
      ['Student', student?.name],
      ['Class', `${student?.grade}-${student?.section}`],
      ['Roll number', student?.rollNo],
      ['Term', term],
      ['Marks', `${total} / ${max} (${pct}%)`],
      ['Overall grade', gradeFromMarks(total, max)],
    ])
  }

  if (!student) return <EmptyState title="Student record not found" message="Ask the school office to link your account to a student record." />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {childrenList?.length > 1 ? (
          <Select value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)} className="w-64"
            options={childrenList.map((c) => ({ value: c.id, label: `${c.name} · Grade ${c.grade}-${c.section}` }))} />
        ) : null}
        <Select value={term} onChange={(e) => setTerm(e.target.value)} options={TERMS} className="w-44" />
        <Button variant="outline" icon={Printer} onClick={printResult}>Print result sheet</Button>
        <Link to="/dashboard/report-cards" className="btn-season !py-2.5 !text-sm"><FileBadge size={15} /> Report card</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={TrendingUp} label="Overall percentage" value={`${pct}%`} hint={`${total} of ${max} marks`} tone="navy" />
        <StatCard icon={Award} label="Overall grade" value={rows.length ? gradeFromMarks(total, max) : '—'} hint={`${rows.length} subjects assessed`} tone="green" />
        <StatCard icon={BarChart3} label="Best subject" value={best?.subject || '—'} hint={best ? `${best.obtained}/100 · ${best.gradeLetter}` : 'No marks yet'} tone="gold" />
        <StatCard icon={Users} label="Class results" value={classRows.length} hint={`${student.name} · ${student.grade}-${student.section}`} tone="sky" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
            <div>
              <h2 className="text-sm font-extrabold text-navy-900">Subject-wise result</h2>
              <p className="text-[11px] text-slate-400">{term} · {student.name} · Class {student.grade}-{student.section}</p>
            </div>
            <Badge tone={letterTone(gradeFromMarks(total, max))}>{gradeFromMarks(total, max)}</Badge>
          </div>
          {rows.length ? (
            <div className="overflow-x-auto">
              <table className="w-full overflow-x-auto text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Obtained</th>
                    <th className="px-4 py-3">Percentage</th>
                    <th className="px-4 py-3">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-navy-900">{r.subject}</p>
                        <p className="text-[10px] text-slate-400">{r.code} · {displayTeacher(r.teacher)}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{r.total}</td>
                      <td className="px-4 py-3 font-bold text-navy-900">{r.obtained}</td>
                      <td className="px-4 py-3"><ProgressBar value={percentage(r.obtained, r.total)} className="w-24" showLabel /></td>
                      <td className="px-4 py-3"><Badge tone={letterTone(r.gradeLetter)}>{r.gradeLetter}</Badge></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold text-navy-900">
                    <td className="px-4 py-3">Total</td>
                    <td className="px-4 py-3">{max}</td>
                    <td className="px-4 py-3">{total}</td>
                    <td className="px-4 py-3">{pct}%</td>
                    <td className="px-4 py-3">{gradeFromMarks(total, max)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <EmptyState icon={Award} title="No results published" message={`No ${term.toLowerCase()} results have been entered for this student yet.`} />
          )}
        </Card>

        <div className="space-y-5">
          <Card>
            <div className="border-b border-slate-100 px-5 py-3.5">
              <h2 className="text-sm font-extrabold text-navy-900">Marks by subject</h2>
              <p className="text-[11px] text-slate-400">Out of 100 per subject</p>
            </div>
            <div className="p-5">
              {rows.length ? <BarChart data={rows.map((r) => ({ label: r.code || r.subject.slice(0, 4), value: r.obtained }))} suffix="%" color="#0f6b3d" /> : <p className="text-xs text-slate-400">No data.</p>}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-extrabold text-navy-900">Teacher’s note</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {pct >= 80
                ? 'Excellent performance. Keep revising past papers and maintain this consistency before the board examination.'
                : pct >= 60
                  ? 'A solid result. Focus on the weaker subjects identified above and attend the Saturday tutorial.'
                  : 'Additional support is recommended. Please contact the class teacher and book a parent–teacher meeting.'}
            </p>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500">
              <p><span className="font-semibold text-slate-700">Weakest subject:</span> {weakest ? `${weakest.subject} (${weakest.obtained}/100)` : '—'}</p>
              <p className="mt-1"><span className="font-semibold text-slate-700">Attendance:</span> {student.attendance}%</p>
            </div>
            <Link to="/dashboard/attendance" className="btn-outline mt-3 w-full !py-2 !text-xs">View attendance</Link>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const { user, linkedStudent, children: myChildren } = useAuth()
  const { db, bulkUpsert, create, update, remove } = useData()
  const toast = useToast()
  const role = user?.roleKey
  const isLearner = role === 'student' || role === 'parent'

  const [term, setTerm] = useState('First Term')
  const [selectedChild, setSelectedChild] = useState(myChildren[0]?.id || linkedStudent?.id || '')
  const [tab, setTab] = useState('overview')
  const [classKey, setClassKey] = useState('10-A')
  const [subject, setSubject] = useState('Mathematics')
  const [marks, setMarks] = useState({})
  const [saving, setSaving] = useState(false)
  const [manageQuery, setManageQuery] = useState('')
  const [manageSubject, setManageSubject] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(8)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [deleteTarget, setDeleteTarget] = useState(null)

  const students = db.students || []
  const results = db.results || []
  const classOptions = useMemo(() => [...new Set(students.map((s) => `${s.grade}-${s.section}`))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })), [students])
  const classStudents = useMemo(() => students.filter((s) => `${s.grade}-${s.section}` === classKey).sort((a, b) => a.rollNo.localeCompare(b.rollNo)), [students, classKey])
  const classResults = useMemo(() => results.filter((r) => r.grade === classKey && r.term === term), [results, classKey, term])
  const subjectNames = useMemo(() => [...new Set(classResults.map((r) => r.subject))], [classResults])
  const activeSubject = subjectNames.includes(subject) ? subject : (subjectNames[0] || subject)
  const filteredManage = useMemo(() => {
    const q = manageQuery.trim().toLowerCase()
    return results.filter((r) => {
      const matchQ = !q || [r.studentName, r.subject, r.grade, r.term].some((v) => String(v || '').toLowerCase().includes(q))
      const matchSubject = !manageSubject || r.subject === manageSubject
      return matchQ && matchSubject
    })
  }, [results, manageQuery, manageSubject])

  if (isLearner) {
    const student = role === 'parent'
      ? (myChildren.find((c) => c.id === selectedChild) || myChildren[0])
      : (linkedStudent || students[0])
    return (
      <div>
        <PageHeader eyebrow="Academics" title={role === 'parent' ? 'Children’s results' : 'My results'}
          subtitle="Term-wise marks, grades and subject performance for the current academic session." />
        <LearnerResults student={student} term={term} setTerm={setTerm} childrenList={role === 'parent' ? myChildren : []}
          selectedChild={selectedChild} setSelectedChild={setSelectedChild} />
      </div>
    )
  }

  const studentSummary = classStudents.map((s) => {
    const rows = classResults.filter((r) => r.studentId === s.id)
    const total = rows.reduce((sum, r) => sum + Number(r.obtained || 0), 0)
    const max = rows.reduce((sum, r) => sum + Number(r.total || 100), 0)
    return { ...s, total, max, pct: percentage(total, max), letter: rows.length ? gradeFromMarks(total, max) : '—', count: rows.length }
  }).sort((a, b) => b.pct - a.pct)
  const ranked = studentSummary.map((s, i) => ({ ...s, position: s.count ? i + 1 : '—' }))
  const classAverage = studentSummary.length ? Math.round(studentSummary.reduce((s, r) => s + r.pct, 0) / studentSummary.length) : 0
  const passRate = percentage(studentSummary.filter((s) => s.pct >= 40 && s.count).length, studentSummary.filter((s) => s.count).length)
  const topStudent = ranked[0]

  const initMarks = () => {
    const next = {}
    classStudents.forEach((s) => {
      const existing = classResults.find((r) => r.studentId === s.id && r.subject === activeSubject)
      next[s.id] = existing?.obtained ?? ''
    })
    setMarks(next)
  }

  const saveMarks = () => {
    if (!classStudents.length) {
      toast.error('There are no students in this class.', 'Nothing to save')
      return
    }
    const invalid = Object.values(marks).some((v) => v !== '' && (Number(v) < 0 || Number(v) > 100))
    if (invalid) {
      toast.error('Marks must be between 0 and 100.', 'Check the entries')
      return
    }
    setSaving(true)
    const records = classStudents.map((s) => {
      const existing = classResults.find((r) => r.studentId === s.id && r.subject === activeSubject)
      const obtained = marks[s.id] === '' || marks[s.id] == null ? 0 : Number(marks[s.id])
      return {
        id: existing?.id || uid('RES'),
        studentId: s.id,
        studentName: s.name,
        grade: classKey,
        term,
        subject: activeSubject,
        code: CODES[activeSubject] || activeSubject.slice(0, 4).toUpperCase(),
        total: 100,
        obtained,
        gradeLetter: gradeFromMarks(obtained, 100),
        teacher: existing?.teacher || displayTeacher((db.teachers || []).find((t) => t.subject === activeSubject)?.name),
        examDate: existing?.examDate || todayISO(),
      }
    })
    window.setTimeout(() => {
      bulkUpsert('results', records)
      setSaving(false)
      toast.success(`${activeSubject} marks saved for ${classKey} (${term}).`, 'Results saved')
    }, 350)
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ studentId: classStudents[0]?.id || '', subject: activeSubject, term, total: 100, obtained: '', teacher: '', examDate: todayISO() })
    setErrors({})
    setFormOpen(true)
  }

  const openEdit = (row) => {
    setEditing(row)
    setForm({ ...row })
    setErrors({})
    setFormOpen(true)
  }

  const submitRecord = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.studentId) next.studentId = 'Select a student.'
    if (!form.subject) next.subject = 'Select a subject.'
    if (form.obtained === '' || Number(form.obtained) < 0 || Number(form.obtained) > 100) next.obtained = 'Enter marks between 0 and 100.'
    setErrors(next)
    if (Object.keys(next).length) return
    const student = students.find((s) => s.id === form.studentId)
    const obtained = Number(form.obtained)
    const payload = {
      ...form,
      studentName: student?.name || form.studentName,
      grade: student ? `${student.grade}-${student.section}` : form.grade,
      code: CODES[form.subject] || form.subject.slice(0, 4).toUpperCase(),
      total: Number(form.total) || 100,
      obtained,
      gradeLetter: gradeFromMarks(obtained, Number(form.total) || 100),
    }
    if (editing) {
      update('results', editing.id, payload)
      toast.success('Result record updated.', 'Saved')
    } else {
      create('results', payload)
      toast.success('Result record added.', 'Created')
    }
    setFormOpen(false)
  }

  const sortedManage = sortRows(filteredManage, 'studentName', 'asc')
  const pageRows = paginate(sortedManage, page, perPage)

  const printClassResults = () => {
    printTable('Class Result Summary', [
      { key: 'position', label: 'Pos' },
      { key: 'rollNo', label: 'Roll No' },
      { key: 'name', label: 'Student' },
      { key: 'total', label: 'Marks' },
      { key: 'max', label: 'Out of' },
      { key: 'pct', label: '%' },
      { key: 'letter', label: 'Grade' },
    ], ranked, [['Class', classKey], ['Term', term], ['Class average', `${classAverage}%`], ['Pass rate', `${passRate}%`]])
  }

  const exportResults = () => {
    downloadCSV(`results-${classKey}-${term.replace(/\s/g, '-')}.csv`, sortedManage, [
      { key: 'studentName', label: 'Student' }, { key: 'grade', label: 'Class' }, { key: 'term', label: 'Term' },
      { key: 'subject', label: 'Subject' }, { key: 'obtained', label: 'Obtained' }, { key: 'total', label: 'Total' }, { key: 'gradeLetter', label: 'Grade' },
    ])
    toast.success(`${sortedManage.length} result records exported.`, 'CSV ready')
  }

  return (
    <div>
      <PageHeader eyebrow="Academics" title="Results & marks"
        subtitle="Review class performance, enter subject marks and manage published results."
        actions={
          <>
            <Button variant="outline" icon={Printer} onClick={printClassResults}>Print summary</Button>
            <Button variant="outline" icon={Download} onClick={exportResults}>Export</Button>
            <Button variant="season" icon={Plus} onClick={openAdd}>Add result</Button>
          </>
        } />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select value={classKey} onChange={(e) => { setClassKey(e.target.value); setPage(1) }} options={classOptions} className="w-40" />
        <Select value={term} onChange={(e) => setTerm(e.target.value)} options={TERMS} className="w-44" />
        <Tabs tabs={[{ key: 'overview', label: 'Class overview' }, { key: 'entry', label: 'Enter marks' }, { key: 'manage', label: 'All records' }]}
          active={tab} onChange={setTab} size="sm" />
      </div>

      {tab === 'overview' ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="Class average" value={`${classAverage}%`} hint={`${classKey} · ${term}`} tone="navy" />
            <SummaryCard label="Pass rate" value={`${passRate}%`} hint="Students scoring 40% or above" tone="green" />
            <SummaryCard label="Top student" value={topStudent?.count ? topStudent.name.split(' ')[0] : '—'} hint={topStudent?.count ? `${topStudent.pct}% · Grade ${topStudent.letter}` : 'No results yet'} tone="gold" />
            <SummaryCard label="Records" value={classResults.length} hint={`${classStudents.length} students in class`} tone="sky" />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <div className="border-b border-slate-100 px-5 py-3.5">
                <h2 className="text-sm font-extrabold text-navy-900">Class ranking</h2>
                <p className="text-[11px] text-slate-400">{classKey} · {term} · ranked by aggregate percentage</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full overflow-x-auto text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3">Pos</th>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Subjects</th>
                      <th className="px-4 py-3">Marks</th>
                      <th className="px-4 py-3">Percentage</th>
                      <th className="px-4 py-3">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranked.map((s) => (
                      <tr key={s.id} className="border-b border-slate-100 last:border-0">
                        <td className="px-4 py-2.5"><span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${s.position === 1 ? 'bg-gold-100 text-gold-800' : 'bg-slate-100 text-slate-500'}`}>{s.position}</span></td>
                        <td className="px-4 py-2.5">
                          <p className="font-semibold text-navy-900">{s.name}</p>
                          <p className="text-[10px] text-slate-400">Roll {s.rollNo}</p>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-slate-500">{s.count}</td>
                        <td className="px-4 py-2.5 text-xs text-slate-500">{s.total} / {s.max}</td>
                        <td className="px-4 py-2.5"><ProgressBar value={s.pct} className="w-24" showLabel /></td>
                        <td className="px-4 py-2.5">{s.count ? <Badge tone={letterTone(s.letter)}>{s.letter}</Badge> : <span className="text-xs text-slate-400">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card>
              <div className="border-b border-slate-100 px-5 py-3.5">
                <h2 className="text-sm font-extrabold text-navy-900">Subject averages</h2>
                <p className="text-[11px] text-slate-400">Average marks out of 100</p>
              </div>
              <div className="p-5">
                {subjectNames.length ? (
                  <BarChart data={subjectNames.map((name) => ({
                    label: CODES[name] || name.slice(0, 4),
                    value: Math.round(classResults.filter((r) => r.subject === name).reduce((s, r) => s + r.obtained, 0) / Math.max(1, classResults.filter((r) => r.subject === name).length)),
                  }))} suffix="%" color="#0f6b3d" />
                ) : <EmptyState icon={BarChart3} title="No subject data" message="Enter marks to see subject averages." />}
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {tab === 'entry' ? (
        <Card>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Field label="Class" className="sm:w-40"><Select value={classKey} onChange={(e) => { setClassKey(e.target.value); setMarks({}) }} options={classOptions} /></Field>
              <Field label="Term" className="sm:w-44"><Select value={term} onChange={(e) => { setTerm(e.target.value); setMarks({}) }} options={TERMS} /></Field>
              <Field label="Subject" className="sm:w-52"><Select value={activeSubject} onChange={(e) => { setSubject(e.target.value); setMarks({}) }} options={subjectNames.length ? subjectNames : SUBJECTS} /></Field>
              <Button variant="outline" onClick={initMarks}>Load existing marks</Button>
            </div>
            <Button variant="season" icon={Save} loading={saving} onClick={saveMarks}>Save marks</Button>
          </div>
          <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-2 text-[11px] text-slate-500">
            {classKey} · {activeSubject} · {term} · {classStudents.length} students. Marks must be between 0 and 100.
          </div>
          <div className="overflow-x-auto">
            <table className="w-full overflow-x-auto text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Roll no</th>
                  <th className="px-4 py-3">Marks / 100</th>
                  <th className="px-4 py-3">Grade</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((s, i) => {
                  const value = marks[s.id] ?? ''
                  return (
                    <tr key={s.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-4 py-2.5 text-xs text-slate-400">{i + 1}</td>
                      <td className="px-4 py-2.5 font-semibold text-navy-900">{s.name}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-500">{s.rollNo}</td>
                      <td className="px-4 py-2.5">
                        <Input type="number" min="0" max="100" value={value} placeholder="0"
                          onChange={(e) => setMarks((prev) => ({ ...prev, [s.id]: e.target.value }))} className="w-24 !py-1.5" aria-label={`Marks for ${s.name}`} />
                      </td>
                      <td className="px-4 py-2.5">{value === '' ? <span className="text-xs text-slate-400">—</span> : <Badge tone={letterTone(gradeFromMarks(Number(value), 100))}>{gradeFromMarks(Number(value), 100)}</Badge>}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {tab === 'manage' ? (
        <Card>
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
            <SearchInput value={manageQuery} onChange={(v) => { setManageQuery(v); setPage(1) }} placeholder="Search results…" className="flex-1" />
            <Select value={manageSubject} onChange={(e) => { setManageSubject(e.target.value); setPage(1) }} placeholder="All subjects" options={SUBJECTS} className="w-auto w-[150px] py-2 text-xs" />
            <Button variant="outline" size="sm" icon={Plus} onClick={openAdd}>Add</Button>
          </div>
          <Table
            columns={[
              { key: 'studentName', label: 'Student', primary: true, sub: 'grade' },
              { key: 'subject', label: 'Subject' },
              { key: 'term', label: 'Term' },
              { key: 'obtained', label: 'Marks', render: (value, row) => `${value ?? 0} / ${row.total ?? 100}` },
              { key: 'gradeLetter', label: 'Grade', format: 'badge' },
              { key: 'examDate', label: 'Exam date', format: 'date' },
            ]}
            rows={pageRows}
            empty={<EmptyState icon={Search} title="No results found" message="Try a different search or add a new result record." />}
            actions={(row) => (
              <div className="flex items-center justify-end gap-0.5">
                <IconButton icon={Pencil} label="Edit result" onClick={() => openEdit(row)} />
                <IconButton icon={Trash2} label="Delete result" className="text-rose-500 hover:bg-rose-50" onClick={() => setDeleteTarget(row)} />
              </div>
            )}
          />
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(sortedManage.length / perPage))} total={sortedManage.length}
            perPage={perPage} onPage={setPage} onPerPage={(n) => { setPerPage(n); setPage(1) }} />
        </Card>
      ) : null}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Edit result' : 'Add result record'}
        subtitle={editing ? editing.id : 'Enter a subject mark for a student.'} size="md"
        footer={<><Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button variant="season" icon={Save} onClick={submitRecord}>{editing ? 'Save changes' : 'Add result'}</Button></>}>
        <form onSubmit={submitRecord} noValidate className="grid gap-4 sm:grid-cols-2">
          <Field label="Student" required error={errors.studentId} className="sm:col-span-2">
            <Select value={form.studentId || ''} onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))}
              options={students.map((s) => ({ value: s.id, label: `${s.name} · ${s.grade}-${s.section} (${s.rollNo})` }))} error={errors.studentId} />
          </Field>
          <Field label="Subject" required error={errors.subject}>
            <Select value={form.subject || ''} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} options={SUBJECTS} error={errors.subject} />
          </Field>
          <Field label="Term">
            <Select value={form.term || 'First Term'} onChange={(e) => setForm((p) => ({ ...p, term: e.target.value }))} options={TERMS} />
          </Field>
          <Field label="Marks obtained" required error={errors.obtained}>
            <Input type="number" min="0" max="100" value={form.obtained ?? ''} onChange={(e) => setForm((p) => ({ ...p, obtained: e.target.value }))} error={errors.obtained} />
          </Field>
          <Field label="Total marks">
            <Input type="number" min="1" value={form.total ?? 100} onChange={(e) => setForm((p) => ({ ...p, total: e.target.value }))} />
          </Field>
          <Field label="Teacher"><Input value={form.teacher || ''} onChange={(e) => setForm((p) => ({ ...p, teacher: e.target.value }))} placeholder="Subject teacher" /></Field>
          <Field label="Exam date"><Input type="date" value={form.examDate || ''} onChange={(e) => setForm((p) => ({ ...p, examDate: e.target.value }))} /></Field>
          <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
        </form>
      </Modal>

      <ConfirmDialog open={Boolean(deleteTarget)} title="Delete this result?" message={`This will remove ${deleteTarget?.subject} marks for ${deleteTarget?.studentName}. This cannot be undone in the demo database.`}
        confirmLabel="Delete result" onCancel={() => setDeleteTarget(null)} onConfirm={() => { remove('results', deleteTarget.id); toast.success('Result record deleted.', 'Removed'); setDeleteTarget(null) }} />
    </div>
  )
}
