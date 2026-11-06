import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BookOpen, CalendarDays, CheckCircle2, ClipboardCheck, FlaskConical,
  GraduationCap, Library, Microscope, Monitor, NotebookPen, Palette, Trophy, Users,
} from 'lucide-react'
import PublicPageHero from '../../components/PublicPageHero'
import CTASection from '../../components/CTASection'
import { Card, SectionHeading, Tabs, Badge } from '../../components/ui'
import { IMG } from '../../data/images'
import { calendarEvents, displayTeacher, periodTimes, subjects, timetable } from '../../data/mockData'

const levels = {
  primary: {
    title: 'Primary School',
    grades: 'Grades 1 – 5',
    image: IMG.girlsStudying,
    intro: 'A warm, activity-based foundation where children learn to read, write, count and ask good questions.',
    subjects: ['English', 'Urdu', 'Mathematics', 'Islamiyat', 'General Science', 'Art & Design', 'Physical Education'],
    features: ['Phonics and guided reading every day', 'Hands-on mathematics with manipulatives', 'Monthly activity-based assessment', 'No more than 40 students per class'],
  },
  middle: {
    title: 'Middle School',
    grades: 'Grades 6 – 8',
    image: IMG.boysClassroom,
    intro: 'Subject-specialist teaching that develops analytical thinking, digital confidence and independent study habits.',
    subjects: ['English', 'Urdu', 'Mathematics', 'Islamiyat', 'General Science', 'Pakistan Studies', 'Computer Science', 'Art & Design', 'Physical Education'],
    features: ['Science and computer laboratory sessions', 'Weekly library and reading periods', 'Debates, quizzes and public speaking', 'Career awareness and study-skills workshops'],
  },
  high: {
    title: 'High School & Matriculation',
    grades: 'Grades 9 – 10 · SSC',
    image: IMG.scienceLab,
    intro: 'BISE Abbottabad-affiliated Matriculation in Science and Arts groups, with structured board examination preparation.',
    subjects: ['English', 'Urdu', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Islamiyat', 'Pakistan Studies'],
    features: ['Science and Arts group pathways', 'Pre-board and monthly board-pattern tests', 'Free past papers, tutorials and revision guides', 'Individual academic counselling for board candidates'],
  },
}

const grading = [
  ['A+', '90 – 100%', 'Outstanding'],
  ['A', '80 – 89%', 'Excellent'],
  ['B', '70 – 79%', 'Very good'],
  ['C', '60 – 69%', 'Good'],
  ['D', '50 – 59%', 'Satisfactory'],
  ['E', '40 – 49%', 'Needs improvement'],
  ['F', 'Below 40%', 'Fail — remedial support required'],
]

export default function Academics() {
  const [level, setLevel] = useState('high')
  const [ttClass, setTtClass] = useState('10-A')
  const active = levels[level]
  const days = Object.keys(timetable[ttClass] || timetable['10-A'])

  return (
    <div>
      <PublicPageHero
        eyebrow="Academics"
        title="A curriculum built for the real world."
        subtitle="Aligned with the Khyber Pakhtunkhwa Textbook Board and BISE Abbottabad, our academic programme combines strong fundamentals with digital skills and character education."
        image={IMG.computerLab}
        crumbs={['Academics']}
      >
        <Link to="/admissions" className="btn-gold">Apply for admission <ArrowRight size={15} /></Link>
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
          Speak to the academic office
        </Link>
      </PublicPageHero>

      {/* Levels */}
      <section className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="Our academic stages" title="Three stages. One continuous journey." align="center"
            subtitle="Every stage builds on the last — from foundational literacy to board-ready Matriculation." />
          <div className="mb-6 flex justify-center">
            <Tabs
              tabs={[
                { key: 'primary', label: 'Primary · 1–5' },
                { key: 'middle', label: 'Middle · 6–8' },
                { key: 'high', label: 'High · 9–10' },
              ]}
              active={level}
              onChange={setLevel}
            />
          </div>
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <img src={active.image} alt={active.title} loading="lazy" className="h-64 w-full object-cover lg:h-full" />
              <div className="p-6 sm:p-8">
                <Badge tone="gold">{active.grades}</Badge>
                <h2 className="mt-3 text-2xl font-extrabold text-navy-900">{active.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{active.intro}</p>
                <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">Subjects offered</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {active.subjects.map((subject) => (
                    <span key={subject} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{subject}</span>
                  ))}
                </div>
                <h3 className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">What makes it different</h3>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {active.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[var(--season-accent)]" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Subjects */}
      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Subject offering" title="Taught by specialists, in English and Urdu."
            subtitle="Our subject teachers hold relevant master’s degrees and are supported by regular professional development." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <Card key={subject.id} hover className="flex items-start gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--season-badge)] text-[var(--season-accent)]">
                  <BookOpen size={19} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-extrabold text-navy-900">{subject.name}</h3>
                    <span className="text-[10px] font-bold text-slate-400">{subject.code}</span>
                  </div>
                  <p className="font-urdu text-sm text-slate-500" dir="rtl">{subject.urdu}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{displayTeacher(subject.teacher)}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge tone={subject.type === 'Compulsory' ? 'navy' : 'gold'}>{subject.type}</Badge>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">Grades {subject.classes}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Matric groups */}
      <section className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="Matriculation" title="Choose the group that fits your future."
            subtitle="Both groups lead to the BISE Abbottabad SSC certificate and open pathways to intermediate study, technical education and employment." />
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="overflow-hidden">
              <div className="relative">
                <img src={IMG.scienceLab} alt="Science group" loading="lazy" className="aspect-[16/9] w-full object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gov-700 shadow">Science Group</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-extrabold text-navy-900">Science Group</h3>
                <p className="mt-2 text-sm text-slate-500">For students aiming at medicine, engineering, computing and the pure sciences.</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science', 'English', 'Urdu', 'Islamiyat', 'Pakistan Studies'].map((s) => (
                    <span key={s} className="flex items-center gap-1.5 text-xs text-slate-600"><FlaskConical size={12} className="text-gov-600" /> {s}</span>
                  ))}
                </div>
                <p className="mt-4 rounded-lg bg-gov-50 px-3 py-2 text-[11px] font-semibold text-gov-700">Pathways: F.Sc. Pre-Medical / Pre-Engineering, ICS, B.Sc., medical and engineering universities.</p>
              </div>
            </Card>
            <Card className="overflow-hidden">
              <div className="relative">
                <img src={IMG.outdoorEducation} alt="Arts group" loading="lazy" className="aspect-[16/9] w-full object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-700 shadow">Arts / Humanities</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-extrabold text-navy-900">Arts & Humanities Group</h3>
                <p className="mt-2 text-sm text-slate-500">For students interested in languages, social sciences, law, education and public service.</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {['English', 'Urdu', 'Islamiyat', 'Pakistan Studies', 'History', 'Geography', 'Civics', 'Economics', 'Art & Design'].map((s) => (
                    <span key={s} className="flex items-center gap-1.5 text-xs text-slate-600"><BookOpen size={12} className="text-gold-600" /> {s}</span>
                  ))}
                </div>
                <p className="mt-4 rounded-lg bg-gold-50 px-3 py-2 text-[11px] font-semibold text-gold-700">Pathways: F.A., I.Com., law, education, journalism, civil services and social sciences.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Assessment */}
      <section className="bg-navy-900 py-16 text-white">
        <div className="container-page grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionHeading light eyebrow="Assessment & reporting" title="Clear expectations. Fair assessment."
              subtitle="Students are assessed continuously throughout the year, not only in a final examination. Parents receive a full report card each term." />
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: NotebookPen, title: 'Class work & homework', value: '20%' },
                { icon: ClipboardCheck, title: 'Monthly tests', value: '20%' },
                { icon: Microscope, title: 'Practical work', value: '10%' },
                { icon: GraduationCap, title: 'Term examination', value: '50%' },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <item.icon size={18} className="text-gold-400" />
                  <div className="flex-1">
                    <p className="text-xs text-white/60">{item.title}</p>
                    <p className="text-lg font-extrabold text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/50">
              Report cards are issued through the Parent Portal and at the termly Parent–Teacher Meeting. Marks,
              attendance and teacher comments are visible to both students and parents.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-bold text-white">Grading scale</h3>
            <table className="mt-3 w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-white/40">
                  <th className="py-2">Grade</th>
                  <th className="py-2">Marks</th>
                  <th className="py-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {grading.map(([grade, marks, desc]) => (
                  <tr key={grade} className="border-b border-white/5 last:border-0">
                    <td className="py-2 font-extrabold text-gold-400">{grade}</td>
                    <td className="py-2 text-white/80">{marks}</td>
                    <td className="py-2 text-white/50">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Timetable */}
      <section className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="Sample timetable" title="A structured day, every day."
            subtitle="Seven teaching periods, a morning assembly and dedicated library and sports time. Parents can view their child’s full timetable in the portal."
            action={<Link to="/login" className="btn-outline">View in portal <ArrowRight size={15} /></Link>}
          />
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-[var(--season-accent)]" />
                <span className="text-sm font-bold text-navy-900">Weekly timetable</span>
              </div>
              <div className="flex gap-2">
                {['10-A', '9-A'].map((c) => (
                  <button key={c} type="button" onClick={() => setTtClass(c)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${ttClass === c ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                    Grade {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                    <th className="px-3 py-2.5">Day</th>
                    {periodTimes.map((p) => <th key={p.period} className="px-3 py-2.5">P{p.period}<span className="ml-1 font-normal normal-case text-slate-300">{p.time}</span></th>)}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => (
                    <tr key={day} className="border-b border-slate-100 last:border-0">
                      <td className="whitespace-nowrap px-3 py-2.5 font-bold text-navy-900">{day}</td>
                      {(timetable[ttClass][day] || []).map((subject, i) => (
                        <td key={`${day}-${i}`} className="px-3 py-2.5">
                          <span className={`inline-block rounded-md px-2 py-1 font-semibold ${['Assembly', 'Sports', 'Library', 'Tutorial'].includes(subject) ? 'bg-gold-50 text-gold-700' : 'bg-slate-50 text-slate-600'}`}>
                            {subject}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Calendar */}
      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Academic calendar" title="Key dates for the year ahead."
            action={<Link to="/news" className="btn-outline">All notices <ArrowRight size={15} /></Link>} />
          <div className="grid gap-3 sm:grid-cols-2">
            {calendarEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-navy-900 text-white">
                  <span className="text-lg font-extrabold leading-none">{new Date(event.date).getDate()}</span>
                  <span className="text-[9px] uppercase tracking-wider text-gold-400">{new Date(event.date).toLocaleDateString('en-GB', { month: 'short' })}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={event.type === 'Exam' ? 'red' : event.type === 'Holiday' ? 'green' : event.type === 'PTM' ? 'purple' : 'gold'}>{event.type}</Badge>
                    {event.endDate ? <span className="text-[10px] text-slate-400">until {new Date(event.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span> : null}
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-navy-900">{event.title}</h3>
                  <p className="text-xs text-slate-500">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="Learning support" title="Nobody is left to struggle alone." align="center" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, title: 'Tutorial groups', text: 'Saturday tutorials and small-group support for students who need extra help.' },
              { icon: Library, title: 'Library & resources', text: '8,000+ titles, past papers, reference books and a quiet reading room.' },
              { icon: Monitor, title: 'Digital learning', text: 'ICT lab access and online resources through the school LMS.' },
              { icon: Trophy, title: 'Co-curricular', text: 'Sports, debates, art and science clubs that build confidence beyond the classroom.' },
            ].map((item) => (
              <Card key={item.title} className="p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-700"><item.icon size={18} /></span>
                <h3 className="mt-3 text-sm font-extrabold text-navy-900">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Ready to join the GHS Narwa Bajmore family?" primary="Start your application" secondary="Ask a question" />
    </div>
  )
}
