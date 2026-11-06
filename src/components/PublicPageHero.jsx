import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import SeasonDecor from './SeasonDecor'
import { useSeason } from '../context/SeasonContext'
import { school } from '../data/mockData'
import { cn } from '../lib/utils'

export default function PublicPageHero({ eyebrow, title, subtitle, image, crumbs = [], children, className }) {
  const { season } = useSeason()
  return (
    <section className={cn('relative overflow-hidden hero-gradient text-white', className)}>
      <SeasonDecor />
      <div className="pattern-grid absolute inset-0 opacity-40" />
      <div className="container-page relative py-12 sm:py-16 lg:py-20">
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/55" aria-label="Breadcrumb">
          <Link to="/" className="flex items-center gap-1 transition hover:text-gold-300"><Home size={12} /> Home</Link>
          {crumbs.map((crumb) => (
            <span key={crumb} className="flex items-center gap-1.5">
              <ChevronRight size={11} />
              <span className="text-white/80">{crumb}</span>
            </span>
          ))}
        </nav>
        <div className={cn('grid items-center gap-10', image ? 'lg:grid-cols-[1.15fr_0.85fr]' : '')}>
          <div className="animate-fade-up">
            {eyebrow ? (
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-300 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> {eyebrow}
              </span>
            ) : null}
            <h1 className="text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-4xl lg:text-[3.15rem]">{title}</h1>
            {subtitle ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">{subtitle}</p> : null}
            <p className="mt-4 font-urdu text-base text-gold-300/90" dir="rtl">{school.taglineUrdu}</p>
            {children ? <div className="mt-6 flex flex-wrap gap-3">{children}</div> : null}
          </div>
          {image ? (
            <div className="relative animate-fade-up delay-2">
              <div className="absolute -inset-3 rounded-[2rem] border border-white/15" />
              <img src={image} alt={title} loading="lazy" className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl" />
              <div className="absolute -bottom-4 left-5 rounded-xl bg-white px-4 py-2.5 shadow-xl">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Academic session</p>
                <p className="text-sm font-extrabold text-navy-900">{school.academicYear} · {season} term</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
