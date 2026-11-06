import { Link } from 'react-router-dom'
import {
  ArrowRight, Award, BookOpen, CheckCircle2, Clock, Coffee, Dumbbell, HeartPulse,
  Music, Palette, ShieldCheck, Sparkles, Trophy, Users, Utensils, Bus, Microscope,
  Flag, Megaphone,
} from 'lucide-react'
import PublicPageHero from '../../components/PublicPageHero'
import CTASection from '../../components/CTASection'
import ImageCarousel from '../../components/ImageCarousel'
import { Card, SectionHeading, Badge } from '../../components/ui'
import { campusSlides, facilityCards, IMG } from '../../data/images'
import { useSeason } from '../../context/SeasonContext'

const houses = [
  { name: 'Iqbal House', color: 'bg-emerald-600', text: 'Named after Allama Muhammad Iqbal, poet and philosopher of the East.', points: 186, motto: 'Think deeply, rise high.' },
  { name: 'Jinnah House', color: 'bg-navy-700', text: 'Named after Quaid-e-Azam Muhammad Ali Jinnah, founder of Pakistan.', points: 171, motto: 'Unity, faith, discipline.' },
  { name: 'Sir Syed House', color: 'bg-amber-600', text: 'Named after Sir Syed Ahmad Khan, pioneer of modern education.', points: 158, motto: 'Education first.' },
  { name: 'Quaid House', color: 'bg-rose-600', text: 'Named in honour of the Quaid’s legacy of service and integrity.', points: 149, motto: 'Service before self.' },
]

const day = [
  { time: '8:20 am', title: 'Arrival & morning line', text: 'Students assemble in their house lines. Late arrivals are recorded at the gate.', icon: Clock },
  { time: '8:35 am', title: 'Assembly', text: 'National anthem, thought for the day, news headlines and house announcements.', icon: Flag },
  { time: '8:50 am', title: 'Periods 1–3', text: 'Core subjects: English, Urdu and mathematics, with a short transition between each.', icon: BookOpen },
  { time: '10:30 am', title: 'Break', text: 'Supervised break in the playground and a healthy snack from the canteen.', icon: Coffee },
  { time: '10:50 am', title: 'Periods 4–6', text: 'Science, social studies, computer science or elective subjects, including lab sessions.', icon: Microscope },
  { time: '12:30 pm', title: 'Period 7 & tutorials', text: 'Library, sports, tutorial groups or co-curricular clubs.', icon: Sparkles },
  { time: '1:30 pm', title: 'Dismissal', text: 'Class-wise dismissal. Bus students are escorted to their vehicles.', icon: Bus },
]

const clubs = [
  { icon: Trophy, title: 'Cricket & hockey', text: 'Inter-house teams, district competitions and daily practice.' },
  { icon: Dumbbell, title: 'Athletics', text: 'Track events, long jump, shot put and annual sports day.' },
  { icon: Microscope, title: 'Science Club', text: 'Experiments, science fair projects and visiting lectures.' },
  { icon: Megaphone, title: 'Debates & declamation', text: 'Urdu and English debating, prepared and extempore.' },
  { icon: Palette, title: 'Art & calligraphy', text: 'Drawing, painting and Urdu calligraphy exhibitions.' },
  { icon: Music, title: 'Music & naat', text: 'National songs, qawwali and naat competitions.' },
  { icon: BookOpen, title: 'Readers’ Club', text: 'Book reviews, reading challenges and library quizzes.' },
  { icon: Users, title: 'Scouts & service', text: 'Community clean-ups, tree planting and charity drives.' },
]

const safety = [
  'Separate boys’ and girls’ academic blocks with dedicated staff',
  'Controlled entry and exit with visitor logging',
  'CCTV coverage of corridors, gates and playground',
  'Full-time first-aider and health room',
  'Clean drinking water and sanitised washrooms',
  'Anti-bullying policy with confidential reporting',
]

export default function CampusLife() {
  const { season } = useSeason()
  return (
    <div>
      <PublicPageHero
        eyebrow="Campus life"
        title="More than a classroom. A community."
        subtitle="Sport, clubs, houses, service and friendship are part of the GHS Narwa Bajmore experience. We want students to leave us confident, healthy and kind."
        image={IMG.playground}
        crumbs={['Campus Life']}
      >
        <Link to="/gallery" className="btn-gold">See campus photos <ArrowRight size={15} /></Link>
        <Link to="/admissions" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
          Join our community
        </Link>
      </PublicPageHero>

      {/* Pillars */}
      <section className="container-page -mt-8 relative z-10">
        <Card className="grid grid-cols-2 gap-5 p-5 sm:grid-cols-4">
          {[
            { icon: Trophy, label: 'Sports & athletics' },
            { icon: Users, label: 'Houses & leadership' },
            { icon: Palette, label: 'Arts & culture' },
            { icon: HeartPulse, label: 'Health & wellbeing' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--season-badge)] text-[var(--season-accent)]"><item.icon size={18} /></span>
              <p className="text-xs font-bold text-navy-900">{item.label}</p>
            </div>
          ))}
        </Card>
      </section>

      {/* Day in the life */}
      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionHeading eyebrow="A day at GHS Narwa Bajmore" title="Structure, rhythm and room to breathe."
              subtitle="Our day balances academic rigour with play, reflection and support. Winter and summer timings are adjusted by the Elementary & Secondary Education Department, Khyber Pakhtunkhwa." />
            <div className="relative">
              <div className="absolute bottom-2 left-[19px] top-2 w-px bg-slate-200" />
              <div className="space-y-4">
                {day.map((item) => (
                  <div key={item.time} className="relative flex gap-4">
                    <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-navy-900 text-gold-400 shadow">
                      <item.icon size={16} />
                    </span>
                    <div className="pb-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--season-accent)]">{item.time}</p>
                      <p className="text-sm font-bold text-navy-900">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={IMG.schoolAssembly} alt="Morning assembly" loading="lazy" className="aspect-[3/4] w-full rounded-2xl object-cover shadow-lg" />
            <div className="grid gap-3 pt-8">
              <img src={IMG.sportsDay} alt="Sports day" loading="lazy" className="aspect-square w-full rounded-2xl object-cover shadow-lg" />
              <img src={IMG.studentsWorkshop} alt="Technical workshop" loading="lazy" className="aspect-square w-full rounded-2xl object-cover shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Houses */}
      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading eyebrow="House system" title="Four houses. One school." align="center"
            subtitle="Every student belongs to a house. Houses compete in sport, debates, attendance and service throughout the year." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {houses.map((house, i) => (
              <Card key={house.name} hover className="overflow-hidden">
                <div className={`${house.color} p-5 text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/70">House</span>
                    {i === 0 ? <Badge tone="gold">Cup leaders</Badge> : null}
                  </div>
                  <h3 className="mt-2 text-lg font-extrabold">{house.name}</h3>
                  <p className="mt-0.5 text-[11px] text-white/70">{house.motto}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs leading-relaxed text-slate-500">{house.text}</p>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">House points</span>
                    <span className="text-lg font-extrabold text-navy-900">{house.points}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] text-slate-400">Current standings after the 2026 annual sports day. Points are updated every term.</p>
        </div>
      </section>

      {/* Clubs */}
      <section className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="Sports & clubs" title="Find your thing — and get better at it."
            subtitle="Every student is encouraged to join at least one club and one sport. Participation is recorded on the annual report." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {clubs.map((club) => (
              <Card key={club.title} hover className="p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-700"><club.icon size={18} /></span>
                <h3 className="mt-3 text-sm font-extrabold text-navy-900">{club.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{club.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities carousel */}
      <section className="bg-navy-900 py-16 text-white">
        <div className="container-page">
          <SectionHeading light eyebrow="Our campus" title="A safe, green space to learn and grow."
            subtitle="Our campus includes separate academic blocks, laboratories, a library, a sports field and a health room." />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
            <ImageCarousel slides={campusSlides[season]} aspect="aspect-[4/3]" className="min-h-[320px] shadow-2xl" />
            <div className="grid gap-3 sm:grid-cols-2">
              {facilityCards.map((facility) => (
                <div key={facility.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-gold-400">
                    <facility.icon size={16} />
                  </span>
                  <p className="mt-2.5 text-xs font-bold text-white">{facility.title}</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-white/50">{facility.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="section-pad">
        <div className="container-page grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow="Safety & wellbeing" title="Parents trust us with their children. We take that seriously."
              subtitle="Safeguarding is everyone’s responsibility. Our policies are reviewed each term and every staff member receives safeguarding training." />
            <div className="grid gap-2.5 sm:grid-cols-2">
              {safety.map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-lg bg-white px-3 py-2.5 ring-1 ring-slate-200">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-gov-600" />
                  <p className="text-xs leading-relaxed text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gov-50 text-gov-700"><HeartPulse size={20} /></span>
              <h3 className="text-lg font-extrabold text-navy-900">Student wellbeing</h3>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>A trained counsellor is available three days a week for academic, career and personal guidance. Referrals are confidential.</p>
              <p>Students can report bullying or safety concerns through the confidential complaints form in the parent and student portal, or by speaking to any teacher.</p>
              <p>Free health screening is conducted each term in partnership with the district health office.</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/contact" className="btn-outline"><ShieldCheck size={15} /> Safeguarding contact</Link>
              <Link to="/login" className="btn-ghost"><Megaphone size={15} /> Report a concern</Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Canteen & transport */}
      <section className="bg-white py-16">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {[
            { icon: Utensils, title: 'Canteen', text: 'Subsidised, hygienic snacks and lunch. Menus are displayed weekly and checked by the health room.', link: '/contact', label: 'Canteen enquiries' },
            { icon: Bus, title: 'School transport', text: 'Four routes across Narwa Bajmore, Shohal Mazullah Khan, Kaghan Road and Balakot, with trained drivers and attendants.', link: '/contact', label: 'Ask about routes' },
            { icon: Award, title: 'Student leadership', text: 'Head boy and head girl, house captains and prefects are elected each year and lead assemblies and service projects.', link: '/news', label: 'Meet our leaders' },
          ].map((item) => (
            <Card key={item.title} className="p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--season-badge)] text-[var(--season-accent)]"><item.icon size={20} /></span>
              <h3 className="mt-4 text-lg font-extrabold text-navy-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.text}</p>
              <Link to={item.link} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--season-accent)] hover:underline">{item.label} <ArrowRight size={13} /></Link>
            </Card>
          ))}
        </div>
      </section>

      <CTASection title="There’s a place for your child here." primary="Apply for admission" secondary="Book a campus visit" />
    </div>
  )
}
