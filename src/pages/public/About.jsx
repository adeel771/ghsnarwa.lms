import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, BookOpen, Building2, CalendarDays, CheckCircle2, GraduationCap,
  HeartHandshake, Landmark, MapPin, Quote, ShieldCheck, Target, Trophy, UserRound, Users,
} from 'lucide-react'
import PublicPageHero from '../../components/PublicPageHero'
import CTASection from '../../components/CTASection'
import { Card, SectionHeading, Badge } from '../../components/ui'
import { IMG } from '../../data/images'
import { school } from '../../data/mockData'

const values = [
  { icon: BookOpen, title: 'Knowledge', text: 'A rigorous, inquiry-led curriculum that rewards curiosity and independent thought.' },
  { icon: ShieldCheck, title: 'Character', text: 'Discipline, honesty and respect are taught through example, not just instruction.' },
  { icon: HeartHandshake, title: 'Service', text: 'Students learn to give back through community service, charity drives and peer mentoring.' },
  { icon: Trophy, title: 'Excellence', text: 'We set high expectations and provide the support every student needs to meet them.' },
  { icon: Users, title: 'Inclusion', text: 'Every child is welcome, regardless of family income, background or ability.' },
  { icon: BadgeCheck, title: 'Integrity', text: 'Transparent admissions, fair assessment and accountable use of public resources.' },
]

const timeline = [
  { year: '1984', title: 'The school is founded', text: 'Government High School Narwa Bajmore opens its doors to 180 students in a modest six-room building in Shohal Mazullah Khan.' },
  { year: '1998', title: 'Science wing added', text: 'Physics, chemistry and biology laboratories are constructed with support from the Khyber Pakhtunkhwa Education Department.' },
  { year: '2010', title: 'Girls’ academic block', text: 'A dedicated girls’ block is inaugurated, expanding access to secondary education for the neighbourhood.' },
  { year: '2018', title: 'ICT laboratory', text: 'A 40-workstation computer lab and broadband connectivity bring digital literacy to every grade.' },
  { year: '2024', title: 'Smart classrooms', text: 'Projectors, interactive boards and a refreshed library modernise teaching across the senior school.' },
  { year: '2026', title: 'Digital LMS launched', text: 'Attendance, results, fees and communication move online for students, parents and staff.' },
]

export default function About() {
  const leadership = [
    { name: school.principal, role: 'Principal' },
    { name: school.vicePrincipal, role: 'Vice Principal' },
    { name: '', role: 'Head of Mathematics' },
    { name: '', role: 'Head of Science' },
  ]

  return (
    <div>
      <PublicPageHero
        eyebrow="Our story"
        title="Four decades of public service through education."
        subtitle="Government High School Narwa Bajmore has been part of Balakot’s educational landscape since 1984 — a school built by the community, for the community."
        image={IMG.girlsBuilding}
        crumbs={['About']}
      >
        <Link to="/admissions" className="btn-gold">Join our school <ArrowRight size={15} /></Link>
        <Link to="/contact" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
          Visit the campus
        </Link>
      </PublicPageHero>

      {/* Overview */}
      <section className="section-pad">
        <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Who we are"
              title="A government school with a deep sense of purpose."
              subtitle="We are a co-educational, BISE Abbottabad-affiliated high school serving Grades 1 to 10. Our students come from Narwa Bajmore, Shohal Mazullah Khan, Bajmore, Kaghan Road and the surrounding valleys. Many are the first in their families to reach Matriculation."
            />
            <p className="text-sm leading-relaxed text-slate-600">
              Our approach is simple: teach well, care deeply and hold every student to a high standard. We combine
              the values and accessibility of a public school with the facilities, teaching quality and ambition
              usually associated with private institutions. No child is turned away because of their family’s income.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ['Established', `${school.established}`],
                ['Grades offered', '1 – 10 (SSC)'],
                ['Affiliation', 'BISE Abbottabad'],
                ['Medium of instruction', 'English & Urdu'],
                ['Academic year', school.academicYear],
                ['School type', 'Government · Co-educational'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start gap-2.5 rounded-xl bg-slate-50 px-3.5 py-2.5">
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[var(--season-accent)]" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className="text-sm font-semibold text-navy-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={IMG.girlsGate} alt="The school gate" loading="lazy" className="aspect-[4/5] w-full rounded-3xl object-cover shadow-xl" />
            <div className="absolute -bottom-5 -left-4 rounded-2xl bg-navy-900 p-4 text-white shadow-xl max-w-xs">
              <Landmark size={20} className="text-gold-400" />
              <p className="mt-2 text-sm font-bold">Registered with the Elementary & Secondary Education Department, Khyber Pakhtunkhwa</p>
              <p className="mt-1 text-[10px] text-white/60">{school.registration}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="bg-white py-16">
        <div className="container-page grid gap-5 md:grid-cols-3">
          <Card className="p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400"><Target size={20} /></span>
            <h3 className="mt-4 text-lg font-extrabold text-navy-900">Our mission</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              To provide every child in our community with a high-quality, values-based education that prepares them
              for higher study, dignified work and responsible citizenship.
            </p>
          </Card>
          <Card className="p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gov-600 text-white"><GraduationCap size={20} /></span>
            <h3 className="mt-4 text-lg font-extrabold text-navy-900">Our vision</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              A model government school where technology, great teaching and community partnership combine to close
              the opportunity gap for Balakot’s children.
            </p>
          </Card>
          <Card className="p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-400 text-navy-950"><HeartHandshake size={20} /></span>
            <h3 className="mt-4 text-lg font-extrabold text-navy-900">Our promise</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Free, transparent admissions. A safe campus. Teachers who know every student by name. And a school
              that listens to parents.
            </p>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="What we stand for" title="Six values, taught every day." align="center"
            subtitle="Our motto — Knowledge, Character, Service — is not a slogan. It is the framework for how we teach, assess and relate to one another." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title} hover className="p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--season-badge)] text-[var(--season-accent)]">
                    <value.icon size={18} />
                  </span>
                  <h3 className="text-base font-extrabold text-navy-900">{value.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{value.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-navy-900 py-16 text-white">
        <div className="container-page">
          <SectionHeading light eyebrow="Our journey" title="Milestones that shaped GHS Narwa Bajmore."
            subtitle="From a six-room building to a digitally connected campus — a history of steady, community-driven progress." />
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/15 sm:left-1/2" />
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <div key={item.year} className={`relative flex gap-5 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-10' : 'sm:ml-auto sm:pl-10'}`}>
                  <span className={`absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold-400 bg-navy-900 text-[10px] font-extrabold text-gold-400 sm:left-auto ${i % 2 === 0 ? 'sm:-right-4' : 'sm:-left-4'}`}>
                    {item.year.slice(2)}
                  </span>
                  <div className="ml-12 rounded-2xl border border-white/10 bg-white/5 p-5 sm:ml-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gold-400">{item.year}</p>
                    <h3 className="mt-1 text-base font-bold text-white">{item.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/60">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Principal message */}
      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div className="mx-auto flex aspect-[4/5] w-full max-w-sm flex-col items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-navy-800 via-navy-700 to-gov-700 px-6 text-center shadow-xl">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-gold-300 ring-1 ring-white/20">
              <UserRound size={30} />
            </span>
            <p className="text-sm font-semibold text-white/80">Principal information will be updated soon</p>
          </div>
          <div>
            <span className="eyebrow"><Quote size={12} /> Principal’s message</span>
            <h2 className="mt-4 text-2xl font-extrabold text-navy-900 sm:text-3xl">“Every child carries the promise of this community.”</h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
              <p>
                When a student joins Government High School Narwa Bajmore, they join a family. Our teachers know their
                students not only by roll number, but by name, strength and ambition. We celebrate their successes
                and stand with them through difficulty.
              </p>
              <p>
                This digital learning management system is the latest step in our journey. It gives parents real-time
                visibility, gives teachers more time to teach, and gives students the tools to take charge of their
                own learning.
              </p>
              <p>
                I invite every parent to visit us, ask questions and hold us accountable. A school is strongest when
                its community is involved.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-4">
              <div>
                <p className="text-sm font-extrabold text-navy-900">{school.principal || 'Principal information will be updated soon'}</p>
                <p className="text-xs text-slate-500">Principal · Government High School Narwa Bajmore</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Leadership" title="The people who guide our school." align="center"
            subtitle="Leadership and departmental positions are listed below. Staff names, qualifications and photographs will be published as they are confirmed." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((person) => (
              <Card key={person.role} className="overflow-hidden">
                <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-navy-800 to-gov-700 text-gold-300">
                  <UserRound size={46} />
                </div>
                <div className="p-4">
                  <Badge tone="navy">{person.role}</Badge>
                  <h3 className="mt-2 text-sm font-extrabold text-navy-900">{person.name || 'Leadership information will be updated soon'}</h3>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section-pad">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Find us" title="In the heart of Balakot." subtitle="Our campus is easily accessible by road, with a dedicated school bus service covering Narwa Bajmore, Shohal Mazullah Khan and nearby valleys." />
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[var(--season-accent)]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Address</p>
                  <p className="text-sm font-semibold text-navy-900">{school.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <CalendarDays size={18} className="mt-0.5 shrink-0 text-[var(--season-accent)]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Visiting hours</p>
                  <p className="text-sm font-semibold text-navy-900">Monday – Saturday, 9:00 am – 12:00 pm (by appointment)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <Building2 size={18} className="mt-0.5 shrink-0 text-[var(--season-accent)]" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">District & board</p>
                  <p className="text-sm font-semibold text-navy-900">{school.district} · {school.board}</p>
                </div>
              </div>
            </div>
            <Link to="/contact" className="btn-primary mt-5">Contact the office <ArrowRight size={15} /></Link>
          </div>
          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <iframe
              title="Map showing Government High School Narwa Bajmore, Balakot"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(school.mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              className="h-full min-h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <CTASection title="Come and see what a great government school looks like." primary="Book a campus visit" secondary="Contact us" />
    </div>
  )
}
