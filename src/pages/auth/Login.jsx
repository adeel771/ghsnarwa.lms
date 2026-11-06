import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Lock, Mail, ShieldCheck,
  Sparkles, Users, KeyRound,
} from 'lucide-react'
import ImageCarousel from '../../components/ImageCarousel'
import SchoolLogo from '../../components/SchoolLogo'
import { Button, Card, Checkbox, Field, Input } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useSeason } from '../../context/SeasonContext'
import { useToast } from '../../context/ToastContext'
import { demoAccounts, school } from '../../data/mockData'
import { heroSlides, IMG } from '../../data/images'
import { isValidEmail } from '../../lib/utils'

export default function Login() {
  const { login, user } = useAuth()
  const { season } = useSeason()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(() => localStorage.getItem('ghsnb_remember_email') || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(Boolean(localStorage.getItem('ghsnb_remember_email')))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const fillAccount = (account) => {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
    toast.info(`Demo credentials for ${account.role} filled. Click “Sign in” to continue.`, 'Account selected')
  }

  const submit = (e) => {
    e.preventDefault()
    setError('')
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }
    setLoading(true)
    window.setTimeout(() => {
      const result = login(email, password)
      setLoading(false)
      if (!result.ok) {
        setError(result.error)
        toast.error(result.error, 'Sign-in failed')
        return
      }
      if (remember) localStorage.setItem('ghsnb_remember_email', email)
      else localStorage.removeItem('ghsnb_remember_email')
      toast.success(`Welcome back, ${result.user.name}.`, 'Signed in')
      navigate(redirectTo, { replace: true })
    }, 550)
  }

  const visibleAccounts = showAll ? demoAccounts : demoAccounts.filter((a) => ['Student', 'Parent', 'Teacher', 'Principal'].includes(a.role))

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      {/* Brand panel */}
      <div className="relative hidden w-full lg:w-[46%] shrink-0 overflow-hidden hero-gradient text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pattern-grid absolute inset-0 opacity-30" />
        <div className="relative z-10 p-8 xl:p-10">
          <SchoolLogo theme="dark" size="md" to="/" />
        </div>
        <div className="relative z-10 px-8 xl:px-10">
          <ImageCarousel
            slides={heroSlides[season]}
            aspect="aspect-[4/3]"
            rounded="rounded-2xl"
            className="shadow-2xl ring-1 ring-white/20"
          />
          <div className="mt-6 max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300 ring-1 ring-white/15">
              <Sparkles size={11} /> Digital learning management system
            </span>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight xl:text-3xl">One portal for your whole school life.</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Attendance, results, fee vouchers, timetables and messages — all in one secure place for students,
              parents and staff.
            </p>
          </div>
        </div>
        <div className="relative z-10 p-8 text-[11px] text-white/40 xl:p-10">
          © {new Date().getFullYear()} {school.name} · {school.city}, {school.province}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col w-full">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 lg:hidden w-full">
          <SchoolLogo size="sm" />
          <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-navy-900">Back to site</Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:py-12 w-full">
          <div className="w-full max-w-md w-full">
            <Link to="/" className="mb-6 hidden items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-navy-900 lg:inline-flex w-full">
              <ArrowLeft size={14} /> Back to public website
            </Link>

            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
                <ShieldCheck size={11} /> Demo authentication
              </span>
              <h1 className="mt-3 text-2xl font-extrabold text-navy-900 sm:text-3xl">Welcome back</h1>
              <p className="mt-1 text-sm text-slate-500">Sign in to access your personalised dashboard.</p>
            </div>

            {error ? (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
                {error}
              </div>
            ) : null}

            <form onSubmit={submit} noValidate className="space-y-4">
              <Field label="Email address" htmlFor="login-email">
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@ghsnb.edu.pk" className="pl-9" autoComplete="email" />
                </div>
              </Field>
              <Field label="Password" htmlFor="login-password">
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input id="login-password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="pl-9 pr-10" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </Field>
              <div className="flex items-center justify-between">
                <Checkbox checked={remember} onChange={setRemember} label="Remember my email" />
                <Link to="/forgot-password" className="text-xs font-semibold text-[var(--season-accent)] hover:underline">Forgot password?</Link>
              </div>
              <Button type="submit" variant="season" size="lg" loading={loading} icon={loading ? undefined : KeyRound} className="w-full">
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
              <div className="flex items-start gap-2">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-amber-600" />
                <p className="text-[11px] leading-relaxed text-slate-500">
                  <span className="font-bold text-slate-700">This is demo authentication.</span> Accounts are validated in your browser and data is stored in localStorage. A production deployment would use a secure server, hashed passwords, rate limiting and expiring session tokens.
                </p>
              </div>
            </div>

            {/* Demo accounts */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400"><Users size={13} /> Demo accounts</p>
                <button type="button" onClick={() => setShowAll((v) => !v)} className="text-[11px] font-semibold text-[var(--season-accent)] hover:underline">
                  {showAll ? 'Show fewer' : 'All 8 roles'}
                </button>
              </div>
              <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {visibleAccounts.map((account) => (
                  <button key={account.email} type="button" onClick={() => fillAccount(account)}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-left transition hover:border-navy-300 hover:bg-navy-50">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${account.color}`}>{account.initials}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-bold text-navy-900">{account.role}</span>
                      <span className="block truncate text-[9px] text-slate-400">{account.email}</span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-slate-400">All demo accounts use the password <span className="font-mono font-bold text-slate-600">demo1234</span>.</p>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              Don’t have an account?{' '}
              <Link to="/admissions" className="font-bold text-[var(--season-accent)] hover:underline">Apply for admission</Link>
            </p>
          </div>
        </div>
        <div className="border-t border-slate-100 px-5 py-3 text-center text-[10px] text-slate-400">
          Need help? <a href={`mailto:${school.email}`} className="font-semibold text-slate-600 hover:underline">{school.email}</a> · {school.phone}
        </div>
      </div>
    </div>
  )
}
