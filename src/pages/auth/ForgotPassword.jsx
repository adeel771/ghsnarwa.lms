import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import SchoolLogo from '../../components/SchoolLogo'
import { Button, Card, Field, Input } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { school } from '../../data/mockData'
import { IMG } from '../../data/images'
import { isValidEmail } from '../../lib/utils'

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    window.setTimeout(() => {
      const res = forgotPassword(email)
      setLoading(false)
      if (!res.ok) {
        setError(res.error)
        return
      }
      setResult(res)
    }, 500)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row w-full">
      <div className="relative hidden w-full lg:block overflow-hidden hero-gradient lg:block">
        <img src={IMG.girlsReading} alt="A student reading in the library" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-between p-9 text-white">
          <SchoolLogo theme="dark" size="md" to="/" />
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300 ring-1 ring-white/15">
              <ShieldCheck size={11} /> Account recovery
            </span>
            <h2 className="mt-3 text-2xl font-extrabold leading-tight">Locked out? We’ll help you get back in.</h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/65">
              In production, a secure, single-use reset link would be emailed to the address registered with the school.
            </p>
          </div>
          <p className="text-[11px] text-white/40">{school.name} · {school.address}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col w-full">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 lg:hidden">
          <SchoolLogo size="sm" />
          <Link to="/login" className="text-xs font-semibold text-slate-500">Back to login</Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md w-full">
            <Link to="/login" className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-navy-900 w-full">
              <ArrowLeft size={14} /> Back to sign in
            </Link>

            {result ? (
              <Card className="p-6 text-center sm:p-8">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gov-50 text-gov-600"><CheckCircle2 size={30} /></span>
                <h1 className="mt-4 text-xl font-extrabold text-navy-900">Request recorded</h1>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{result.message}</p>
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Demo mode notice</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-amber-800">
                    No email or SMS has been sent. This screen demonstrates the recovery workflow only. Do not use real passwords in this demo.
                  </p>
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  <Link to="/login" className="btn-primary w-full">Return to sign in</Link>
                  <button type="button" onClick={() => { setResult(null); setEmail('') }} className="text-xs font-semibold text-slate-500 hover:text-navy-900">Try another email</button>
                </div>
              </Card>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-amber-200">
                  <ShieldCheck size={11} /> Demo authentication
                </span>
                <h1 className="mt-3 text-2xl font-extrabold text-navy-900 sm:text-3xl">Reset your password</h1>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the email address registered with the school. We’ll check it against the demo account list.
                </p>

                {error ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</div> : null}

                <form onSubmit={submit} noValidate className="mt-5 space-y-4">
                  <Field label="Registered email address" htmlFor="reset-email">
                    <div className="relative">
                      <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <Input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@ghsnb.edu.pk" className="pl-9" autoComplete="email" />
                    </div>
                  </Field>
                  <Button type="submit" variant="season" size="lg" loading={loading} icon={KeyRound} className="w-full">
                    {loading ? 'Checking…' : 'Request password reset'}
                  </Button>
                </form>

                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    <span className="font-bold text-slate-700">Demo accounts:</span> use any address from the login page.
                    The shared demo password is <span className="font-mono font-bold text-slate-700">demo1234</span>.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {['student@ghsnb.edu.pk', 'parent@ghsnb.edu.pk', 'teacher@ghsnb.edu.pk'].map((demoEmail) => (
                      <button key={demoEmail} type="button" onClick={() => setEmail(demoEmail)}
                        className="rounded bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100">
                        {demoEmail}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="mt-6 text-center text-xs text-slate-500">
                  Remembered your password? <Link to="/login" className="font-bold text-[var(--season-accent)] hover:underline">Sign in</Link>
                </p>
                <p className="mt-3 text-center text-[10px] text-slate-400">
                  Still stuck? Contact the school office at <a href={`mailto:${school.email}`} className="font-semibold hover:underline">{school.email}</a> or {school.phone}.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
