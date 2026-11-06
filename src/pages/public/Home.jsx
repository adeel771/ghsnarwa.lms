import { Link } from 'react-router-dom'
import {
  ArrowRight, ArrowUpRight, BadgeCheck, BookOpen, CalendarDays, CheckCircle2,
  FlaskConical, GraduationCap, HeartHandshake, Landmark, Monitor, Quote, ShieldCheck,
  Sparkles, Star, Trophy, Users,
} from 'lucide-react'
import ImageCarousel from '../../components/ImageCarousel'
import SeasonDecor from '../../components/SeasonDecor'
import CTASection from '../../components/CTASection'
import { Card, SectionHeading, Badge } from '../../components/ui'
import Icon from '../../components/Icon'
import { useSeason } from '../../context/SeasonContext'
import { useCountUp } from '../../lib/hooks'
import { campusSlides, facilityCards, galleryItems, heroSlides, IMG, newsItems, stats, testimonialItems } from '../../data/images'
import { school } from '../../data/mockData'

function StatValue({ value, label, icon }) {
  const { ref, display } = useCountUp(value)
  return (
    <div ref={ref} className="flex items-center gap-3.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--season-badge)] text-[var(--season-accent)]">
        <Icon name={icon} size={20} />
      </span>
      <div>
        <p className="text-xl font-extrabold leading-none text-navy-900 sm:text-2xl">{display}</p>
        <p className="mt-1 text-[11px] font-medium text-slate-500">{label}</p>
      </div>
    </div>
  )
}

const programmes = [
  {
    title: 'Primary School',
    grades: 'Grades 1 – 5',
    image: IMG.girlsStudying,
    text: 'A caring, activity-based foundation in literacy, numeracy, Islamiyat and general science.',
    points: ['Phonics & reading programme', 'Montessori-inspired activities', 'Weekly art, music & sports'],
  },
  {
    title: 'Middle School',
    grades: 'Grades 6 – 8',
    image: IMG.boysClassroom,
    text: 'Subject-based learning that builds analytical skills, digital literacy and confidence.',
    points: ['Science & computer labs', 'Debates and public speaking', 'Career awareness sessions'],
  },
  {
    title: 'High School & Matric',
    grades: 'Grades 9 – 10 · SSC',
    image: IMG.scienceLab,
    text: 'BISE Abbottabad-affiliated Matriculation in Science and Arts groups with expert board preparation.',
    points: ['Science & Arts groups', 'Pre-board examination system', 'Free past papers & tutorials'],
  },
]

const whyUs = [
  { icon: BadgeCheck, title: 'Zero-cost, high-quality education', text: 'No tuition fee for eligible students under the Khyber Pakhtunkhwa government scheme. Merit, not money, decides admission.' },
  { icon: ShieldCheck, title: 'Safe and inclusive campus', text: 'Separate boys’ and girls’ blocks, trained staff, first-aid room and monitored entry and exit.' },
  { icon: Monitor, title: 'Digital-first learning', text: 'Smart classrooms, an ICT lab and this LMS keep every family connected to daily school life.' },
  { icon: HeartHandshake, title: 'Community at the centre', text: 'Parent–teacher meetings, counselling and an open-door principal’s office build trust.' },
]

export default function Home() {
  const { season, isWinter } = useSeason()
  const featured = newsItems[0]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <SeasonDecor />
        <div className="pattern-grid absolute inset-0 opacity-40" />
        <div className="container-page relative grid gap-10 py-12 lg:grid-cols-[1.03fr_0.97fr] lg:items-center lg:py-16">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300 backdrop-blur sm:text-[11px]">
              <Sparkles size={12} /> Govt. of Khyber Pakhtunkhwa · Est. {school.established}
            </span>
            <h1 className="mt-5 text-[2.1rem] font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              A proud government school.<br />
              <span className="text-gold-300">A modern education.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              {isWinter
                ? 'Winter term is in session at Government High School Narwa Bajmore. Warm classrooms, focused learning and a community that shows up for every child.'
                : 'A safe, green campus in the hills of Balakot where curiosity is encouraged, character is built and every child is prepared for the future.'}
            </p>
            <p className="mt-3 font-urdu text-lg text-gold-300/90" dir="rtl">{school.taglineUrdu}</p>

            <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
              <Link to="/admissions" className="btn-gold justify-center">
                Apply for admission <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
                Discover our school <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-5 text-[11px] text-white/65">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-gold-400" /> BISE Abbottabad affiliated</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-gold-400" /> Free education scheme</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-gold-400" /> Grades 1–10</span>
            </div>
          </div>

          <div className="relative animate-fade-up delay-2">
            <ImageCarousel
              slides={heroSlides[season]}
              aspect="aspect-[4/3]"
              priority
              rounded="rounded-3xl"
              className="shadow-2xl ring-1 ring-white/20"
            />
            <div className="absolute -bottom-5 -left-3 z-40 rounded-2xl bg-white p-3.5 shadow-xl ring-1 ring-slate-200 sm:-left-6 sm:p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gov-50 text-gov-700"><CalendarDays size={19} /></span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Admissions open</p>
                  <p className="text-sm font-extrabold text-navy-900">Session {school.academicYear}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10">
        <div className="container-page -mt-8">
          <Card className="grid grid-cols-2 gap-5 px-5 py-5 sm:grid-cols-4 sm:px-7">
            {stats.map((stat) => <StatValue key={stat.label} {...stat} />)}
          </Card>
        </div>
      </section>

      {/* Welcome */}
      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <img src={IMG.girlsGroup} alt="Students of Government High School Narwa Bajmore" loading="lazy" className="aspect-[3/4] w-full rounded-2xl object-cover shadow-lg" />
              <div className="grid gap-3 pt-8">
                <img src={IMG.boysClassroom} alt="A classroom at GHS Narwa Bajmore" loading="lazy" className="aspect-square w-full rounded-2xl object-cover shadow-lg" />
                <div className="rounded-2xl bg-navy-900 p-4 text-white">
                  <p className="text-3xl font-extrabold text-gold-400">{school.established}</p>
                  <p className="mt-1 text-[11px] leading-snug text-white/70">Serving Balakot’s families for over four decades.</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-2 bottom-8 hidden rounded-xl bg-gold-400 px-4 py-3 text-navy-950 shadow-xl sm:block">
              <p className="text-xl font-extrabold leading-none">96%</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wide">Matric pass rate</p>
            </div>
          </div>

          <div>
            <SectionHeading
              eyebrow="Welcome to GHS Narwa Bajmore"
              title="A government school with a private-school mindset."
              subtitle="We believe that every child in our community deserves an education that opens doors. Our teachers, staff and families work together to make that promise real — every single day."
            />
            <div className="space-y-3">
              {[
                'Experienced, qualified teachers in every subject',
                'Modern science, computer and technical laboratories',
                'A library of 8,000+ Urdu and English titles',
                'Free education support for deserving families',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[var(--season-accent)]" /> {item}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/about" className="btn-primary">Our story <ArrowRight size={15} /></Link>
              <Link to="/academics" className="btn-outline">Academic programmes</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Academic programmes"
            title="From first steps to Matriculation."
            subtitle="A continuous, well-structured journey from Grade 1 to Grade 10, aligned with the Khyber Pakhtunkhwa Textbook Board."
            align="center"
            action={<Link to="/academics" className="btn-outline">All academics <ArrowRight size={15} /></Link>}
          />
          <div className="grid gap-5 md:grid-cols-3">
            {programmes.map((program) => (
              <Card key={program.title} hover className="overflow-hidden">
                <div className="relative">
                  <img src={program.image} alt={program.title} loading="lazy" className="aspect-[16/10] w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-900 shadow">{program.grades}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-extrabold text-navy-900">{program.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{program.text}</p>
                  <ul className="mt-4 space-y-1.5">
                    {program.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={13} className="text-[var(--season-accent)]" /> {point}
                      </li>
                    ))}
                  </ul>
                  <Link to="/academics" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--season-accent)] hover:underline">
                    Explore programme <ArrowRight size={13} />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section-pad">
        <div className="container-page">
          <SectionHeading
            eyebrow="Campus & facilities"
            title="Spaces designed for real learning."
            subtitle="From laboratories to the library and the playground, our campus supports academic, physical and creative growth."
          />
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <ImageCarousel slides={campusSlides[season]} aspect="aspect-[4/3] lg:aspect-auto lg:h-full" className="min-h-[320px]" />
            <div className="grid gap-4 sm:grid-cols-2">
              {facilityCards.slice(0, 4).map((facility) => (
                <Card key={facility.title} hover className="p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--season-badge)] text-[var(--season-accent)]">
                    <Icon name={facility.icon} size={19} />
                  </span>
                  <h3 className="mt-3 text-sm font-extrabold text-navy-900">{facility.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{facility.text}</p>
                </Card>
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {facilityCards.slice(4).map((facility) => (
              <Card key={facility.title} className="flex items-start gap-4 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-700">
                  <Icon name={facility.icon} size={19} />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-navy-900">{facility.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{facility.text}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Principal */}
      <section className="bg-navy-900 py-16 text-white">
        <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-3 rounded-3xl border border-white/15" />
            <div className="relative flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-navy-800 via-navy-700 to-gov-700 px-6 text-center shadow-2xl">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-gold-300 ring-1 ring-white/20">
                <GraduationCap size={30} />
              </span>
              <p className="text-sm font-semibold text-white/80">Principal information will be updated soon</p>
            </div>
            <div className="absolute -bottom-4 left-4 right-4 rounded-xl bg-white px-4 py-3 text-navy-900 shadow-xl">
              <p className="text-sm font-extrabold">{school.principal || 'Principal information will be updated soon'}</p>
              <p className="text-[11px] text-slate-500">Principal, Government High School Narwa Bajmore</p>
            </div>
          </div>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-300 ring-1 ring-white/15">
              <Quote size={12} /> Message from the Principal
            </span>
            <blockquote className="mt-5 text-xl font-semibold leading-relaxed text-white/90 sm:text-2xl">
              “Our responsibility is not only to prepare students for examinations, but to prepare them for life.
              Every child who walks through our gate carries the promise of this community.”
            </blockquote>
            <p className="mt-5 text-sm leading-relaxed text-navy-100/70">
              At GHS Narwa Bajmore we combine the discipline and values of a government school with the ambition of a
              modern institution. Our teachers are mentors, our classrooms are laboratories of curiosity, and our
              doors are always open to parents. Together, we are building a school our neighbourhood can be proud of.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-4 border-t border-white/15 pt-5">
              {[['42', 'Years of service'], ['64', 'Faculty members'], ['1,240', 'Students']].map(([value, label]) => (
                <div key={label}>
                  <p className="text-2xl font-extrabold text-gold-400">{value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section-pad bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why families choose us"
            title="Public education, held to a higher standard."
            subtitle="Four commitments that shape every decision we make for our students."
            align="center"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item) => (
              <Card key={item.title} className="p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
                  <item.icon size={20} />
                </span>
                <h3 className="mt-4 text-sm font-extrabold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="section-pad">
        <div className="container-page">
          <SectionHeading
            eyebrow="News & notices"
            title="What’s happening at GHS Narwa Bajmore."
            action={<Link to="/news" className="btn-outline">All news <ArrowRight size={15} /></Link>}
          />
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Card hover className="overflow-hidden">
              <img src={featured.image} alt={featured.title} loading="lazy" className="aspect-[16/9] w-full object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <Badge tone="gold">{featured.category}</Badge>
                  <span className="text-[11px] text-slate-400">{new Date(featured.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <h3 className="mt-3 text-xl font-extrabold leading-snug text-navy-900">{featured.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{featured.excerpt}</p>
                <Link to="/news" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--season-accent)] hover:underline">
                  Read the full notice <ArrowRight size={14} />
                </Link>
              </div>
            </Card>
            <div className="space-y-3">
              {newsItems.slice(1, 5).map((item) => (
                <Link key={item.id} to="/news" className="group flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:border-navy-300 hover:shadow-md">
                  <img src={item.image} alt={item.title} loading="lazy" className="h-20 w-24 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--season-accent)]">{item.category}</span>
                      <span className="text-[10px] text-slate-400">{new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                    </div>
                    <h4 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-navy-900 group-hover:text-[var(--season-accent)]">{item.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading
            eyebrow="Life at GHS Narwa Bajmore"
            title="Moments from our campus."
            action={<Link to="/gallery" className="btn-outline">Open gallery <ArrowRight size={15} /></Link>}
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {galleryItems.slice(0, 8).map((item, i) => (
              <Link key={item.id} to="/gallery" className={`group relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 row-span-2' : ''}`}>
                <img src={item.image} alt={item.title} loading="lazy"
                  className={`w-full object-cover transition duration-500 group-hover:scale-105 ${i === 0 ? 'aspect-square md:aspect-[4/5]' : 'aspect-square'}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-xs font-bold text-white">{item.title}</p>
                  <p className="text-[10px] text-white/60">{item.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-pad">
        <div className="container-page">
          <SectionHeading
            eyebrow="In their words"
            title="Trusted by parents, loved by students."
            align="center"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {testimonialItems.slice(0, 3).map((item) => (
              <Card key={item.name} className="flex flex-col p-6">
                <div className="flex gap-0.5 text-gold-500">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">“{item.quote}”</p>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-gold-400">{item.initials}</span>
                  <div>
                    <p className="text-sm font-bold text-navy-900">{item.name}</p>
                    <p className="text-[11px] text-slate-400">{item.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
