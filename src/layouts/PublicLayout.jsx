import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowRight, ChevronRight, Mail, MapPin, Menu, Phone,
  Snowflake, Sun, X, LogIn, LayoutDashboard,
} from 'lucide-react'
import SchoolLogo from '../components/SchoolLogo'
import { SeasonSwitcher, LanguageSwitcher } from '../components/Controls'
import { useAuth } from '../context/AuthContext'
import { useSeason } from '../context/SeasonContext'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import { publicNav } from '../data/navigation'
import { school } from '../data/mockData'
import { cn } from '../lib/utils'
import { Avatar } from '../components/ui'
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from '../components/Icon'

const navTranslationKeys = {
  Home: 'home',
  About: 'about',
  Academics: 'academics',
  Admissions: 'admissions',
  Teachers: 'teachers',
  'Campus Life': 'campusLife',
  Gallery: 'gallery',
  News: 'news',
  Contact: 'contact',
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { user } = useAuth()
  const { season } = useSeason()
  const { t } = useLanguage()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const socialClick = (network) => {
    toast.info(`${network} is not connected in this demo. Follow the school’s official notice board for announcements.`, 'Demo link')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />

      {/* Utility bar */}
      <div className="bg-navy-950 text-white">
        <div className="container-page flex h-9 items-center justify-between gap-4 text-[11px]">
          <div className="flex min-w-0 items-center gap-4">
            <span className="hidden items-center gap-1.5 text-white/70 sm:flex">
              <MapPin size={12} className="text-gold-400" /> {school.city}, {school.province}
            </span>
            <a href={`tel:${school.phone.replace(/\s/g, '')}`} className="flex items-center gap-1.5 text-white/70 transition hover:text-white">
              <Phone size={12} className="text-gold-400" /> {school.phone}
            </a>
            <a href={`mailto:${school.email}`} className="hidden items-center gap-1.5 text-white/70 transition hover:text-white md:flex">
              <Mail size={12} className="text-gold-400" /> {school.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white/50 lg:flex">
              {season === 'winter' ? <Snowflake size={11} /> : <Sun size={11} />}
              {season} term · {school.academicYear}
            </span>
            <SeasonSwitcher theme="dark" compact className="scale-90" />
            <LanguageSwitcher theme="dark" className="scale-90" />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 glass">
        <div className="container-page flex h-[70px] items-center justify-between gap-4">
          <SchoolLogo size="md" />

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
            {publicNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => cn(
                  'relative rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors',
                  isActive ? 'text-[var(--season-accent)]' : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900',
                )}
              >
                {({ isActive }) => (
                  <>
                    {t(navTranslationKeys[item.label] || '') || item.label}
                    {isActive ? <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-[var(--season-accent)]" /> : null}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard" className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold text-navy-900 transition hover:border-navy-300 hover:bg-navy-50 sm:flex">
                <Avatar name={user.name} size="xs" color={user.color} />
                <span className="max-w-24 truncate">{user.name.split(' ')[0]}</span>
                <LayoutDashboard size={14} className="text-slate-400" />
              </Link>
            ) : (
              <Link to="/login" className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-navy-800 transition hover:bg-slate-100 sm:flex">
                <LogIn size={15} /> {t('login')}
              </Link>
            )}
            <Link to="/admissions" className="btn-season hidden text-xs sm:inline-flex">
              Apply Now <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-navy-900 xl:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {menuOpen ? (
          <div className="fixed inset-x-0 top-[106px] bottom-0 z-40 overflow-y-auto bg-white xl:hidden">
            <div className="container-page py-5">
              <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Season</span>
                <SeasonSwitcher />
              </div>
              <nav className="grid gap-1" aria-label="Mobile navigation">
                {publicNav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => cn(
                      'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition',
                      isActive ? 'bg-navy-900 text-white' : 'text-slate-700 hover:bg-slate-100',
                    )}
                  >
                    {item.label}
                    <ChevronRight size={16} className="opacity-50" />
                  </NavLink>
                ))}
              </nav>
              <div className="mt-5 grid gap-2">
                <Link to={user ? '/dashboard' : '/login'} className="btn-primary w-full">
                  {user ? 'Open Dashboard' : 'Student / Staff Login'}
                </Link>
                <Link to="/admissions" className="btn-gold w-full">Apply for Admission</Link>
              </div>
              <div className="mt-6 space-y-2 text-sm text-slate-500">
                <p className="flex items-center gap-2"><Phone size={14} /> {school.phone}</p>
                <p className="flex items-center gap-2"><Mail size={14} /> {school.email}</p>
                <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5" /> {school.address}</p>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative overflow-hidden bg-navy-950 text-navy-100">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--season-accent)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-page relative py-14">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
            <div>
              <SchoolLogo theme="dark" size="md" />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-200/70">
                A government high school serving the community of Balakot since {school.established}. Educating
                generations with knowledge, character and service.
              </p>
              <p className="mt-4 font-urdu text-lg text-gold-300" dir="rtl">{school.taglineUrdu}</p>
              <div className="mt-5 flex gap-2">
                {[['Facebook', FacebookIcon], ['Twitter', TwitterIcon], ['Instagram', InstagramIcon], ['YouTube', YoutubeIcon]].map(([label, IconComponent]) => (
                  <button key={label} type="button" onClick={() => socialClick(label)} aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-navy-200 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white">
                    <IconComponent size={15} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">Explore</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {publicNav.slice(0, 6).map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="text-navy-200/75 transition hover:text-white">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">Quick links</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link to="/admissions" className="text-navy-200/75 transition hover:text-white">Apply for admission</Link></li>
                <li><Link to="/admissions#fees" className="text-navy-200/75 transition hover:text-white">Fee structure</Link></li>
                <li><Link to="/news" className="text-navy-200/75 transition hover:text-white">News & notices</Link></li>
                <li><Link to="/gallery" className="text-navy-200/75 transition hover:text-white">Photo gallery</Link></li>
                <li><Link to="/login" className="text-navy-200/75 transition hover:text-white">Student & staff portal</Link></li>
                <li><Link to="/contact" className="text-navy-200/75 transition hover:text-white">Contact the school</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">Visit us</h3>
              <ul className="mt-4 space-y-3 text-sm text-navy-200/75">
                <li className="flex items-start gap-2.5"><MapPin size={15} className="mt-0.5 shrink-0 text-gold-400" /> {school.address}</li>
                <li className="flex items-center gap-2.5"><Phone size={15} className="shrink-0 text-gold-400" /> <a href={`tel:${school.phone.replace(/\s/g, '')}`} className="hover:text-white">{school.phone}</a></li>
                <li className="flex items-center gap-2.5"><Mail size={15} className="shrink-0 text-gold-400" /> <a href={`mailto:${school.email}`} className="hover:text-white">{school.email}</a></li>
              </ul>
              <div className="mt-4 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gold-400">School timings</p>
                <p className="mt-1 text-xs text-navy-200/80">{school.timingsSummer}</p>
                <p className="text-xs text-navy-200/80">{school.timingsWinter} (winter)</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] text-navy-300/60 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {school.name}. All rights reserved.</p>
            <p className="text-center">Demo LMS · Data is stored locally in your browser · Photography: Wikimedia Commons &amp; Pexels</p>
            <p>{school.registration}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
