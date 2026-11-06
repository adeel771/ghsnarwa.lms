import { useState } from 'react'
import {
  AlertTriangle, Building2, CalendarRange, Check, Database, Download, KeyRound,
  RotateCcw, Save, ShieldCheck, SlidersHorizontal, Snowflake, Sun, Wifi,
} from 'lucide-react'
import {
  Badge, Button, Card, ConfirmDialog, Field, Input, PageHeader, Select, Tabs,
  Textarea, Toggle,
} from '../../components/ui'
import { useData } from '../../context/DataContext'
import { useSeason } from '../../context/SeasonContext'
import { useLanguage } from '../../context/LanguageContext'
import { useToast } from '../../context/ToastContext'
import { seedData, school } from '../../data/mockData'
import { downloadText, monthNames, todayISO } from '../../lib/utils'

const TABS = [
  { key: 'school', label: 'School profile' },
  { key: 'season', label: 'Academic & season' },
  { key: 'finance', label: 'Fees & operations' },
  { key: 'security', label: 'Security & demo' },
]

export default function SettingsPage() {
  const { db, settings, updateSettings, resetDemo } = useData()
  const { season, autoSeason, override, setSeason, clearOverride, winterMonthsLabel } = useSeason()
  const { lang, setLang } = useLanguage()
  const toast = useToast()
  const [tab, setTab] = useState('school')
  const [form, setForm] = useState({ ...seedData.settings, ...settings })
  const [resetOpen, setResetOpen] = useState(false)

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const save = (section) => {
    if (!form.schoolName?.trim()) {
      toast.error('School name cannot be empty.', 'Check the form')
      return
    }
    if (Number(form.winterStartMonth) === Number(form.winterEndMonth)) {
      toast.error('Winter start and end months must be different.', 'Check the season dates')
      return
    }
    updateSettings({
      ...form,
      winterStartMonth: Number(form.winterStartMonth),
      winterEndMonth: Number(form.winterEndMonth),
      lateFee: Number(form.lateFee) || 0,
      feeDueDay: Number(form.feeDueDay) || 10,
      attendanceThreshold: Number(form.attendanceThreshold) || 75,
      sessionTimeout: Number(form.sessionTimeout) || 60,
    })
    toast.success(`${section} settings saved to the demo database.`, 'Settings updated')
  }

  const exportData = () => {
    downloadText(`ghsnb-lms-backup-${todayISO()}.json`, JSON.stringify(db, null, 2), 'application/json')
    toast.success('A JSON backup of the demo database has been downloaded.', 'Backup ready')
  }

  const confirmReset = () => {
    resetDemo()
    setForm({ ...seedData.settings })
    setResetOpen(false)
    toast.success('Demo database restored to its original seed data.', 'Reset complete')
    window.setTimeout(() => window.location.reload(), 600)
  }

  return (
    <div>
      <PageHeader eyebrow="System" title="School settings"
        subtitle="Configure school identity, academic year, seasonal dates, fee rules and demo security options." />

      <Tabs tabs={TABS} active={tab} onChange={setTab} className="mb-5" />

      {tab === 'school' ? (
        <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <Card>
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--season-badge)] text-[var(--season-accent)]"><Building2 size={15} /></span>
              <div><h2 className="text-sm font-extrabold text-navy-900">School identity</h2><p className="text-[11px] text-slate-400">Appears on public pages, receipts and certificates.</p></div>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="School name" required className="sm:col-span-2"><Input value={form.schoolName || ''} onChange={(e) => set('schoolName', e.target.value)} /></Field>
              <Field label="Academic year"><Input value={form.academicYear || ''} onChange={(e) => set('academicYear', e.target.value)} placeholder="2026–27" /></Field>
              <Field label="Principal"><Input value={form.principal || ''} onChange={(e) => set('principal', e.target.value)} /></Field>
              <Field label="Phone"><Input value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} /></Field>
              <Field label="Email" type="email"><Input value={form.email || ''} onChange={(e) => set('email', e.target.value)} /></Field>
              <Field label="Board / affiliation" className="sm:col-span-2"><Input value={form.board || school.board} onChange={(e) => set('board', e.target.value)} /></Field>
              <Field label="Address" className="sm:col-span-2"><Textarea value={form.address || ''} onChange={(e) => set('address', e.target.value)} rows={2} /></Field>
            </div>
            <div className="flex justify-end border-t border-slate-100 px-5 py-3.5">
              <Button variant="season" icon={Save} onClick={() => save('School profile')}>Save profile</Button>
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="p-5">
              <h3 className="text-sm font-extrabold text-navy-900">Registration</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{school.registration}</p>
              <div className="mt-3 space-y-2 text-xs">
                <p className="flex justify-between gap-3"><span className="text-slate-400">District</span><span className="font-semibold text-slate-700">{school.district}</span></p>
                <p className="flex justify-between gap-3"><span className="text-slate-400">Province</span><span className="font-semibold text-slate-700">{school.province}</span></p>
                <p className="flex justify-between gap-3"><span className="text-slate-400">Established</span><span className="font-semibold text-slate-700">{school.established}</span></p>
                <p className="flex justify-between gap-3"><span className="text-slate-400">Affiliation</span><span className="text-right font-semibold text-slate-700">{school.affiliation}</span></p>
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-extrabold text-navy-900">Default language</h3>
              <p className="mt-1 text-[11px] text-slate-500">English and Urdu are supported. Urdu enables RTL layout and the Noto Nastaliq font.</p>
              <div className="mt-3 flex gap-2">
                <Button variant={lang === 'en' ? 'primary' : 'outline'} size="sm" onClick={() => { setLang('en'); set('language', 'en') }}>English</Button>
                <Button variant={lang === 'ur' ? 'primary' : 'outline'} size="sm" onClick={() => { setLang('ur'); set('language', 'ur') }}>اردو</Button>
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {tab === 'season' ? (
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--season-badge)] text-[var(--season-accent)]"><CalendarRange size={15} /></span>
              <div><h2 className="text-sm font-extrabold text-navy-900">Seasonal configuration</h2><p className="text-[11px] text-slate-400">Automatic season detection and academic year.</p></div>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Academic year"><Input value={form.academicYear || ''} onChange={(e) => set('academicYear', e.target.value)} /></Field>
              <Field label="Default language"><Select value={form.language || 'en'} onChange={(e) => { set('language', e.target.value); setLang(e.target.value) }} options={[{ value: 'en', label: 'English' }, { value: 'ur', label: 'Urdu' }]} /></Field>
              <Field label="Winter starts" hint="Month when winter term begins.">
                <Select value={form.winterStartMonth} onChange={(e) => set('winterStartMonth', e.target.value)} options={monthNames.map((m, i) => ({ value: i + 1, label: m }))} />
              </Field>
              <Field label="Winter ends" hint="Last month of winter term.">
                <Select value={form.winterEndMonth} onChange={(e) => set('winterEndMonth', e.target.value)} options={monthNames.map((m, i) => ({ value: i + 1, label: m }))} />
              </Field>
              <div className="sm:col-span-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                <p><span className="font-semibold text-slate-700">Current season:</span> <Badge tone={season === 'winter' ? 'blue' : 'gold'}>{season}</Badge> <span className="ml-1">(auto-detected: {autoSeason})</span></p>
                <p className="mt-1">Winter window: {winterMonthsLabel}. Manual override: {override || 'none'}.</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-3.5">
              <Button variant="outline" icon={RotateCcw} onClick={() => { clearOverride(); toast.info('Season now follows the configured dates.', 'Auto season') }}>Use automatic season</Button>
              <Button variant="season" icon={Save} onClick={() => save('Academic and season')}>Save season settings</Button>
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="p-5">
              <h3 className="text-sm font-extrabold text-navy-900">Preview a season</h3>
              <p className="mt-1 text-[11px] text-slate-500">Manually preview winter or summer styling across the public site and dashboard. This preference is stored in your browser.</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button type="button" onClick={() => setSeason('winter')} className={`rounded-xl border-2 p-3 text-center transition ${season === 'winter' ? 'border-sky-400 bg-sky-50' : 'border-slate-200 hover:border-sky-300'}`}>
                  <Snowflake size={20} className="mx-auto text-sky-600" /><p className="mt-1 text-xs font-bold text-navy-900">Winter</p>
                </button>
                <button type="button" onClick={() => setSeason('summer')} className={`rounded-xl border-2 p-3 text-center transition ${season === 'summer' ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:border-amber-300'}`}>
                  <Sun size={20} className="mx-auto text-amber-500" /><p className="mt-1 text-xs font-bold text-navy-900">Summer</p>
                </button>
                <button type="button" onClick={clearOverride} className={`rounded-xl border-2 p-3 text-center transition ${!override ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}>
                  <Check size={20} className="mx-auto text-emerald-600" /><p className="mt-1 text-xs font-bold text-navy-900">Auto</p>
                </button>
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-extrabold text-navy-900">School timings</h3>
              <div className="mt-3 space-y-2 text-xs">
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800 ring-1 ring-amber-200"><span className="font-bold">Summer:</span> {school.timingsSummer}</p>
                <p className="rounded-lg bg-sky-50 px-3 py-2 text-sky-800 ring-1 ring-sky-200"><span className="font-bold">Winter:</span> {school.timingsWinter}</p>
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {tab === 'finance' ? (
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--season-badge)] text-[var(--season-accent)]"><SlidersHorizontal size={15} /></span>
              <div><h2 className="text-sm font-extrabold text-navy-900">Fees & operations</h2><p className="text-[11px] text-slate-400">Late fee, due dates and attendance rules.</p></div>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Late fee (PKR)" hint="Applied after the due date."><Input type="number" min="0" value={form.lateFee ?? 0} onChange={(e) => set('lateFee', e.target.value)} /></Field>
              <Field label="Fee due day" hint="Day of each month."><Input type="number" min="1" max="28" value={form.feeDueDay ?? 10} onChange={(e) => set('feeDueDay', e.target.value)} /></Field>
              <Field label="Attendance threshold (%)" hint="Minimum required attendance."><Input type="number" min="0" max="100" value={form.attendanceThreshold ?? 75} onChange={(e) => set('attendanceThreshold', e.target.value)} /></Field>
              <Field label="Session timeout (minutes)"><Input type="number" min="5" max="480" value={form.sessionTimeout ?? 60} onChange={(e) => set('sessionTimeout', e.target.value)} /></Field>
              <div className="sm:col-span-2 rounded-xl bg-slate-50 p-3">
                <Toggle checked={Boolean(form.maintenanceMode)} onChange={(v) => set('maintenanceMode', v)}
                  label="Maintenance mode" description="Show a maintenance notice on the public site. Dashboard access remains available for administrators." />
              </div>
            </div>
            <div className="flex justify-end border-t border-slate-100 px-5 py-3.5">
              <Button variant="season" icon={Save} onClick={() => save('Fees and operations')}>Save settings</Button>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-extrabold text-navy-900">Current configuration</h3>
            <div className="mt-3 space-y-2.5 text-xs">
              {[
                ['Late fee', `PKR ${Number(form.lateFee || 0).toLocaleString('en-PK')}`],
                ['Fee due day', `Day ${form.feeDueDay}`],
                ['Attendance threshold', `${form.attendanceThreshold}%`],
                ['Session timeout', `${form.sessionTimeout} minutes`],
                ['Maintenance mode', form.maintenanceMode ? 'Enabled' : 'Disabled'],
                ['Academic year', form.academicYear],
              ].map(([label, value]) => (
                <p key={label} className="flex justify-between gap-3 border-b border-slate-100 pb-2 last:border-0">
                  <span className="text-slate-400">{label}</span><span className="font-semibold text-slate-700">{value}</span>
                </p>
              ))}
            </div>
          </Card>
        </div>
      ) : null}

      {tab === 'security' ? (
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-3.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--season-badge)] text-[var(--season-accent)]"><ShieldCheck size={15} /></span>
              <div><h2 className="text-sm font-extrabold text-navy-900">Security & demo controls</h2><p className="text-[11px] text-slate-400">This is a demonstration environment.</p></div>
            </div>
            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800">
                <p className="flex items-center gap-1.5 font-bold"><AlertTriangle size={14} /> Demo authentication notice</p>
                <p className="mt-1.5">Passwords are stored in plain text in this browser’s localStorage and all data is client-side. In production, passwords must be hashed (e.g. Argon2/bcrypt), sessions must be server-issued with expiring tokens, and role checks must be enforced by the API — never by the browser alone.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-4">
                  <KeyRound size={18} className="text-navy-700" />
                  <p className="mt-2 text-xs font-bold text-navy-900">Demo password</p>
                  <p className="text-[11px] text-slate-500">All demo accounts use <span className="font-mono font-bold">demo1234</span>.</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <Wifi size={18} className="text-navy-700" />
                  <p className="mt-2 text-xs font-bold text-navy-900">Session timeout</p>
                  <p className="text-[11px] text-slate-500">{form.sessionTimeout} minutes (configuration only in demo).</p>
                </div>
              </div>
              <Field label="Session timeout (minutes)"><Input type="number" min="5" max="480" value={form.sessionTimeout ?? 60} onChange={(e) => set('sessionTimeout', e.target.value)} /></Field>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" icon={Download} onClick={exportData}>Download JSON backup</Button>
                <Button variant="season" icon={Save} onClick={() => save('Security')}>Save security settings</Button>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-extrabold text-navy-900">Reset demo data</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Restore students, staff, fees, attendance, results, messages and settings to their original seed values. Any records you added or edited in this browser will be lost.
            </p>
            <div className="mt-4 rounded-xl bg-rose-50 p-4 text-xs text-rose-800 ring-1 ring-rose-200">
              <p className="flex items-center gap-1.5 font-bold"><Database size={14} /> Local database</p>
              <p className="mt-1">{Object.keys(db).length} collections · stored in localStorage key <span className="font-mono">ghsnb_db_v3</span></p>
            </div>
            <Button variant="danger" icon={RotateCcw} className="mt-4 w-full" onClick={() => setResetOpen(true)}>Reset all demo data</Button>
            <p className="mt-3 text-[10px] text-slate-400">Last backup: {todayISO()} · Demo only, not for real student records.</p>
          </Card>
        </div>
      ) : null}

      <ConfirmDialog open={resetOpen} title="Reset the entire demo database?" message="All local changes — students, fees, results, messages, settings and activity — will be permanently replaced with the original demo seed data. This cannot be undone."
        confirmLabel="Reset demo data" onCancel={() => setResetOpen(false)} onConfirm={confirmReset} />
    </div>
  )
}
