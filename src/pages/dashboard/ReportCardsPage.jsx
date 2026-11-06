import { useMemo, useState } from 'react'
import { Award, FileBadge, Printer, School, Users } from 'lucide-react'
import { Badge, Button, Card, EmptyState, PageHeader, ProgressBar, Select } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { displayTeacher, school } from '../../data/mockData'
import { escapeHtml, formatDate, gradeFromMarks, percentage } from '../../lib/utils'
import { printHTML } from '../../lib/print'

const TERMS = ['First Term', 'Second Term', 'Pre-Board', 'Annual']
const letterTone = (letter) => (['A+', 'A'].includes(letter) ? 'green' : ['B', 'C'].includes(letter) ? 'amber' : 'red')

export default function ReportCardsPage() {
  const { user, linkedStudent, children: myChildren } = useAuth()
  const { db } = useData()
  const toast = useToast()
  const role = user?.roleKey
  const isLearner = role === 'student' || role === 'parent'
  const students = db.students || []
  const results = db.results || []
  const attendance = db.attendance || []

  const [term, setTerm] = useState('First Term')
  const [classKey, setClassKey] = useState(linkedStudent ? `${linkedStudent.grade}-${linkedStudent.section}` : '10-A')
  const [selectedId, setSelectedId] = useState(linkedStudent?.id || myChildren[0]?.id || students[0]?.id || '')
  const classOptions = useMemo(() => [...new Set(students.map((s) => `${s.grade}-${s.section}`))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })), [students])
  const classStudents = students.filter((s) => `${s.grade}-${s.section}` === classKey)

  const student = isLearner
    ? (role === 'parent' ? (myChildren.find((c) => c.id === selectedId) || myChildren[0]) : (linkedStudent || students[0]))
    : students.find((s) => s.id === selectedId) || classStudents[0]

  const rows = results.filter((r) => r.studentId === student?.id && r.term === term)
  const total = rows.reduce((s, r) => s + Number(r.obtained || 0), 0)
  const max = rows.reduce((s, r) => s + Number(r.total || 100), 0)
  const pct = percentage(total, max)
  const letter = rows.length ? gradeFromMarks(total, max) : '—'

  const classAggregates = classStudents.map((s) => {
    const sr = results.filter((r) => r.studentId === s.id && r.term === term)
    return { id: s.id, pct: percentage(sr.reduce((sum, r) => sum + Number(r.obtained || 0), 0), sr.reduce((sum, r) => sum + Number(r.total || 100), 0)) }
  }).filter((x) => x.pct > 0).sort((a, b) => b.pct - a.pct)
  const position = classAggregates.findIndex((x) => x.id === student?.id) + 1
  const classSize = classAggregates.length

  const myAttendance = attendance.filter((a) => a.studentId === student?.id)
  const presentDays = myAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length
  const attendanceRate = myAttendance.length ? percentage(presentDays, myAttendance.length) : (student?.attendance || 0)

  const remarks = pct >= 85
    ? 'Outstanding performance. The student shows exceptional understanding and consistency across subjects.'
    : pct >= 70
      ? 'Good progress. With continued effort and regular revision, results can improve further.'
      : pct >= 50
        ? 'Satisfactory. The student should focus on weaker subjects and attend extra tutorial classes.'
        : 'Needs significant improvement. Parents are advised to meet the class teacher to plan additional support.'

  const printCard = () => {
    if (!student || !rows.length) {
      toast.error('There are no results to print for this selection.', 'Nothing to print')
      return
    }
    const body = `
      <div class="sheet">
        ${'<div class="doc-head"><div class="crest">G</div><div><h1>' + escapeHtml(school.name) + '</h1><p>' + escapeHtml(school.address) + '</p><p>' + escapeHtml(school.phone) + ' · ' + escapeHtml(school.email) + ' · ' + escapeHtml(school.board) + '</p></div></div>'}
        <h2 class="doc-title">Student Report Card</h2>
        <p class="doc-sub">${escapeHtml(term)} Examination · Academic Year ${escapeHtml(school.academicYear)}</p>
        <div class="grid">
          <div class="row"><span>Student name</span><span>${escapeHtml(student.name)}</span></div>
          <div class="row"><span>Father / guardian</span><span>${escapeHtml(student.fatherName)}</span></div>
          <div class="row"><span>Class & section</span><span>${escapeHtml(student.grade)}-${escapeHtml(student.section)}</span></div>
          <div class="row"><span>Roll number</span><span>${escapeHtml(student.rollNo)}</span></div>
          <div class="row"><span>Admission number</span><span>${escapeHtml(student.admissionNo)}</span></div>
          <div class="row"><span>Group</span><span>${escapeHtml(student.group)}</span></div>
        </div>
        <table>
          <thead><tr><th>Subject</th><th>Total</th><th>Obtained</th><th>%</th><th>Grade</th><th>Teacher</th></tr></thead>
          <tbody>${rows.map((r) => `<tr><td>${escapeHtml(r.subject)}</td><td>${r.total}</td><td>${r.obtained}</td><td>${percentage(r.obtained, r.total)}%</td><td>${escapeHtml(r.gradeLetter)}</td><td>${escapeHtml(displayTeacher(r.teacher))}</td></tr>`).join('')}</tbody>
          <tfoot><tr><td>Total</td><td>${max}</td><td>${total}</td><td>${pct}%</td><td>${escapeHtml(letter)}</td><td></td></tr></tfoot>
        </table>
        <div class="grid">
          <div class="row"><span>Aggregate</span><span>${total} / ${max} (${pct}%)</span></div>
          <div class="row"><span>Overall grade</span><span>${escapeHtml(letter)}</span></div>
          <div class="row"><span>Class position</span><span>${position || '—'} of ${classSize || '—'}</span></div>
          <div class="row"><span>Attendance</span><span>${attendanceRate}%</span></div>
        </div>
        <p style="margin-top:16px"><strong>Remarks:</strong> ${escapeHtml(remarks)}</p>
        <div class="sign"><div>Class Teacher</div><div>Parent / Guardian</div><div>Principal</div></div>
        <p class="foot">This report card is generated by the ${school.name} Digital LMS. Demo data only.</p>
      </div>`
    printHTML('Student Report Card', body)
    toast.success('Report card opened for printing.', 'Print ready')
  }

  if (!student) {
    return (
      <div>
        <PageHeader eyebrow="Academics" title="Report cards" subtitle="Printable term report cards for students." />
        <EmptyState icon={FileBadge} title="No student record" message="Link a student account or select a student to generate a report card." />
      </div>
    )
  }

  return (
    <div>
      <PageHeader eyebrow="Academics" title="Report cards" subtitle="Official term report cards with subject marks, class position, attendance and teacher remarks."
        actions={<Button variant="season" icon={Printer} onClick={printCard}>Print report card</Button>} />

      <div className="mb-5 flex flex-wrap items-end gap-2">
        {!isLearner ? (
          <>
            <Select value={classKey} onChange={(e) => { setClassKey(e.target.value); setSelectedId(students.find((s) => `${s.grade}-${s.section}` === e.target.value)?.id || '') }} options={classOptions} className="w-40" aria-label="Select class" />
            <Select value={student.id} onChange={(e) => setSelectedId(e.target.value)}
              options={classStudents.map((s) => ({ value: s.id, label: `${s.name} · ${s.rollNo}` }))} className="w-64" aria-label="Select student" />
          </>
        ) : role === 'parent' && myChildren.length > 1 ? (
          <Select value={student.id} onChange={(e) => setSelectedId(e.target.value)}
            options={myChildren.map((c) => ({ value: c.id, label: `${c.name} · Grade ${c.grade}-${c.section}` }))} className="w-64" />
        ) : null}
        <Select value={term} onChange={(e) => setTerm(e.target.value)} options={TERMS} className="w-44" aria-label="Select term" />
      </div>

      <Card className="overflow-hidden">
        <div className="border-b-4 border-navy-900 bg-gradient-to-r from-navy-950 to-navy-800 px-6 py-5 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl font-extrabold text-gold-400 ring-1 ring-white/20">G</span>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">{school.name}</h2>
                <p className="text-[11px] text-navy-200/80">{school.address}</p>
                <p className="text-[11px] text-navy-200/80">{school.board} · {school.registration}</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-400">Student Report Card</p>
              <p className="text-sm font-bold">{term} · {school.academicYear}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 border-b border-slate-100 bg-slate-50/60 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Student', student.name],
            ['Father / guardian', student.fatherName],
            ['Class & section', `${student.grade}-${student.section}`],
            ['Roll number', student.rollNo],
            ['Admission number', student.admissionNo],
            ['Group', student.group],
            ['House', student.house],
            ['Attendance', `${attendanceRate}%`],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
              <p className="mt-0.5 text-sm font-semibold text-navy-900">{value || '—'}</p>
            </div>
          ))}
        </div>

        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full overflow-x-auto text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">Subject</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Obtained</th>
                  <th className="px-4 py-3">Percentage</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-5 py-3">Teacher</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-3 font-semibold text-navy-900">{r.subject}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{r.code}</td>
                    <td className="px-4 py-3 text-slate-500">{r.total}</td>
                    <td className="px-4 py-3 font-bold text-navy-900">{r.obtained}</td>
                    <td className="px-4 py-3"><ProgressBar value={percentage(r.obtained, r.total)} className="w-24" showLabel /></td>
                    <td className="px-4 py-3"><Badge tone={letterTone(r.gradeLetter)}>{r.gradeLetter}</Badge></td>
                    <td className="px-5 py-3 text-xs text-slate-500">{displayTeacher(r.teacher)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold text-navy-900">
                  <td className="px-5 py-3">Total</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">{max}</td>
                  <td className="px-4 py-3">{total}</td>
                  <td className="px-4 py-3">{pct}%</td>
                  <td className="px-4 py-3">{letter}</td>
                  <td className="px-5 py-3">—</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <EmptyState icon={Award} title="No results for this term" message={`No ${term.toLowerCase()} marks have been recorded for ${student.name}.`} />
        )}

        <div className="grid gap-4 border-t border-slate-100 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Aggregate', value: `${total} / ${max}`, hint: `${pct}% overall`, icon: Award, tone: 'navy' },
            { label: 'Overall grade', value: letter, hint: 'Based on aggregate', icon: FileBadge, tone: 'green' },
            { label: 'Class position', value: position ? `${position} / ${classSize}` : '—', hint: 'Ranked by percentage', icon: Users, tone: 'gold' },
            { label: 'Attendance', value: `${attendanceRate}%`, hint: `${presentDays} present days`, icon: School, tone: 'sky' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><item.icon size={15} /></span>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
              </div>
              <p className="mt-2 text-xl font-extrabold text-navy-900">{item.value}</p>
              <p className="text-[11px] text-slate-400">{item.hint}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Teacher’s remarks</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{rows.length ? remarks : 'Remarks will appear once results are published.'}</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {['Class Teacher', 'Parent / Guardian', 'Principal'].map((label) => (
              <div key={label} className="border-t border-slate-300 pt-2 text-center text-[11px] text-slate-500">{label}</div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
