import { Link } from 'react-router-dom'
import { ArrowRight, Phone, Mail } from 'lucide-react'
import SeasonDecor from './SeasonDecor'
import { school } from '../data/mockData'

export default function CTASection({ title, subtitle, primary, secondary, compact = false }) {
  return (
    <section className="container-page pb-16">
      <div className="relative overflow-hidden rounded-3xl hero-gradient px-6 py-10 text-white sm:px-10 sm:py-12">
        <SeasonDecor />
        <div className="pattern-dots absolute inset-0 opacity-10" />
        <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-300">Admissions 2026–27</p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">{title || 'Give your child a future-ready education.'}</h2>
            <p className="mt-2 text-sm text-white/75">
              {subtitle || 'Admission is free of cost and open to every child in our community. Apply online in minutes.'}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
            <Link to="/admissions" className="btn-gold justify-center">
              {primary || 'Apply for admission'} <ArrowRight size={15} />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
              {secondary || 'Contact the school'} <Phone size={15} />
            </Link>
          </div>
        </div>
        {!compact ? (
          <div className="relative mt-8 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/15 pt-5 text-[11px] text-white/60">
            <span className="flex items-center gap-1.5"><Phone size={12} className="text-gold-400" /> {school.phone}</span>
            <span className="flex items-center gap-1.5"><Mail size={12} className="text-gold-400" /> {school.admissionsEmail}</span>
            <span>{school.timingsSummer}</span>
          </div>
        ) : null}
      </div>
    </section>
  )
}
