import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, BookOpen, GraduationCap, Mail, MessageSquare, Phone, Search,
  ShieldCheck, Star, Users, X,
} from 'lucide-react'
import PublicPageHero from '../../components/PublicPageHero'
import CTASection from '../../components/CTASection'
import { Avatar, Badge, Button, Card, Field, Modal, SearchInput, SectionHeading, Select } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { IMG } from '../../data/images'
import { displayTeacher, school, subjects, teachers } from '../../data/mockData'
import { formatDate } from '../../lib/utils'

const subjectOptions = ['All subjects', ...Array.from(new Set(subjects.map((s) => s.name)))]

export default function Teachers() {
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('All subjects')
  const [selected, setSelected] = useState(null)
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return teachers.filter((t) => {
      const matchesQuery = !q || [t.name, t.designation, t.subject, t.qualification].join(' ').toLowerCase().includes(q)
      const matchesSubject = subject === 'All subjects' || t.subject === subject
      return matchesQuery && matchesSubject
    })
  }, [query, subject])

  const messageTeacher = (teacher) => {
    if (!user) {
      toast.info('Please log in with a parent or student account to message a teacher.', 'Login required')
      navigate('/login')
      return
    }
    toast.success(`Your message window with ${displayTeacher(teacher.name)} is available in the portal.`, 'Opening messages')
    navigate('/dashboard/messages')
  }

  const detailValue = (value, fallback = 'To be updated') => (value && String(value).trim() ? value : fallback)

  return (
    <div>
      <PublicPageHero
        eyebrow="Our faculty"
        title="Teachers who know every student by name."
        subtitle="Our faculty includes subject specialists, class teachers, coordinators and support staff. Individual staff profiles will be published as school records are confirmed."
        image={IMG.schoolAssembly}
        crumbs={['Teachers']}
      >
        <a href="#directory" className="btn-gold">Meet the faculty <ArrowRight size={15} /></a>
      </PublicPageHero>

      <section className="container-page -mt-8 relative z-10">
        <Card className="grid grid-cols-2 gap-5 p-5 sm:grid-cols-4">
          {[
            { icon: Users, value: String(teachers.length), label: 'Teacher records' },
            { icon: GraduationCap, value: 'Pending', label: 'Profile status' },
            { icon: Star, value: '—', label: 'Average experience' },
            { icon: ShieldCheck, value: '—', label: 'Student–teacher ratio' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--season-badge)] text-[var(--season-accent)]"><item.icon size={18} /></span>
              <div>
                <p className="text-lg font-extrabold leading-none text-navy-900">{item.value}</p>
                <p className="mt-1 text-[10px] font-medium text-slate-500">{item.label}</p>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* Directory */}
      <section id="directory" className="section-pad scroll-mt-24">
        <div className="container-page">
          <SectionHeading eyebrow="Faculty directory" title="Meet our teaching team."
            subtitle="Search by name or filter by subject. Staff profiles are being prepared and will show full details once confirmed." />
          <div className="mb-6 flex flex-col gap-2.5 sm:flex-row">
            <SearchInput value={query} onChange={setQuery} placeholder="Search teachers by name, subject or qualification…" className="flex-1" />
            <Select value={subject} onChange={(e) => setSubject(e.target.value)} options={subjectOptions} className="sm:w-56" aria-label="Filter by subject" />
          </div>

          {filtered.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((teacher) => (
                <button key={teacher.id} type="button" onClick={() => setSelected(teacher)} className="group text-left">
                  <Card hover className="h-full overflow-hidden">
                    <div className="relative">
                      <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-navy-800 via-navy-700 to-gov-700">
                        <GraduationCap size={52} className="text-gold-300/80" />
                      </div>
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-900 shadow">
                        {teacher.subject || 'Subject pending'}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-extrabold text-navy-900 group-hover:text-[var(--season-accent)]">{displayTeacher(teacher.name)}</h3>
                      <p className="mt-0.5 text-[11px] text-slate-500">{teacher.designation || 'Role will be updated soon'}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[10px] text-slate-400">
                        <span>{teacher.experience ? `${teacher.experience} years’ experience` : 'Profile pending'}</span>
                        <span className="font-semibold text-[var(--season-accent)]">View profile →</span>
                      </div>
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center">
              <Search size={28} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm font-bold text-navy-900">No teachers match your search.</p>
              <p className="mt-1 text-xs text-slate-500">Staff records are still being completed. Try “All subjects” or clear your search.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setQuery(''); setSubject('All subjects') }}>Clear filters</Button>
            </Card>
          )}
        </div>
      </section>

      {/* Approach */}
      <section className="bg-navy-900 py-16 text-white">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading light eyebrow="Our teaching approach" title="Great teaching is a team sport."
              subtitle="Teachers plan together, observe each other’s lessons and review student data every month. Professional development is built into the school week, not an afterthought." />
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Weekly subject planning', 'Departments meet every Monday to align lessons and assessments.'],
                ['Peer observation', 'Each teacher observes and gives feedback to a colleague every term.'],
                ['Data-informed support', 'Attendance and assessment data identify students who need help early.'],
                ['Mentoring', 'Senior teachers mentor new faculty through their first two years.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-bold text-white">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/55">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={IMG.kpkCampus} alt="The school campus at GHS Narwa Bajmore" loading="lazy" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl" />
            <div className="absolute -bottom-4 -left-3 rounded-xl bg-gold-400 px-4 py-3 text-navy-950 shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-wider">Faculty</p>
              <p className="text-sm font-extrabold">Staff profiles coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Join us */}
      <section className="section-pad">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gov-50 text-gov-700"><BookOpen size={20} /></span>
            <h2 className="mt-4 text-xl font-extrabold text-navy-900">Interested in teaching with us?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              We recruit qualified teachers through the Elementary & Secondary Education Department, Khyber Pakhtunkhwa
              and occasional school-based contracts. Send your CV and a short cover note to the principal’s office.
            </p>
            <a href={`mailto:${school.email}?subject=Teaching%20application`} className="btn-primary mt-4">
              <Mail size={15} /> Email your CV
            </a>
          </Card>
          <Card className="p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-700"><MessageSquare size={20} /></span>
            <h2 className="mt-4 text-xl font-extrabold text-navy-900">Need to speak to a teacher?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Parents can message class teachers through the portal or book a slot at the next Parent–Teacher Meeting.
              Messages are answered within one working day.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/login" className="btn-outline"><MessageSquare size={15} /> Open portal</Link>
              <Link to="/contact" className="btn-ghost">Contact the office</Link>
            </div>
          </Card>
        </div>
      </section>

      <CTASection title="Come and meet our teachers in person." primary="Book a campus visit" secondary="Contact the school" />

      {/* Teacher modal */}
      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Teacher profile" size="md">
        {selected ? (
          <div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-gov-700 text-gold-300">
                <GraduationCap size={40} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-navy-900">{displayTeacher(selected.name)}</h3>
                <p className="text-sm text-slate-500">{selected.designation || 'Role will be updated soon'}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge tone="navy">{selected.subject || 'Subject pending'}</Badge>
                  <Badge tone="green">{selected.status}</Badge>
                  <Badge tone="gold">{selected.experience ? `${selected.experience} years` : 'Experience pending'}</Badge>
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ['Qualification', detailValue(selected.qualification)],
                ['Classes taught', detailValue(selected.classes)],
                ['Joined GHS Narwa Bajmore', selected.joiningDate ? formatDate(selected.joiningDate) : 'To be updated'],
                ['Employee ID', selected.id],
                ['Email', detailValue(selected.email)],
                ['Phone', detailValue(selected.phone)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-slate-50 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                  <p className="text-sm font-semibold text-navy-900 break-words">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="season" icon={MessageSquare} onClick={() => { setSelected(null); messageTeacher(selected) }}>Send a message</Button>
              {selected.email ? <a href={`mailto:${selected.email}`} className="btn-outline"><Mail size={15} /> Email</a> : null}
              {selected.phone ? <a href={`tel:${selected.phone.replace(/\s/g, '')}`} className="btn-ghost"><Phone size={15} /> Call</a> : null}
            </div>
            <p className="mt-3 text-[10px] text-slate-400">For safeguarding reasons, direct contact details are for official school communication only.</p>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
