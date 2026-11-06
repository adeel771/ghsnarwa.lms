import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BadgeCheck, CalendarDays, CheckCircle2, ChevronDown, ClipboardCheck,
  Download, FileText, GraduationCap, HelpCircle, MapPin, Phone, Printer, Search,
  ShieldCheck, Users, Wallet,
} from 'lucide-react'
import PublicPageHero from '../../components/PublicPageHero'
import CTASection from '../../components/CTASection'
import Icon from '../../components/Icon'
import { Badge, Button, Card, Checkbox, Field, Input, SectionHeading, Select, Textarea } from '../../components/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { admissionSteps, feeStructure, school } from '../../data/mockData'
import { IMG } from '../../data/images'
import { formatDate, isValidEmail, isValidPakistaniPhone, todayISO } from '../../lib/utils'
import { printReceipt } from '../../lib/print'

const initialForm = {
  studentName: '',
  fatherName: '',
  grade: '8',
  gender: 'Male',
  dob: '',
  phone: '',
  email: '',
  previousSchool: '',
  address: '',
  declaration: false,
}

const faqs = [
  {
    q: 'Is there any admission or donation fee?',
    a: 'No. Government High School Narwa Bajmore does not charge any admission fee, donation or capitation fee. Standard monthly tuition applies, and eligible families receive government fee support. All charges are published in the fee structure above.',
  },
  {
    q: 'Which grades are open for admission?',
    a: 'Online applications are currently open for Grade 1 and Grade 8 for the 2026–27 session. Transfer cases for Grades 2–7 and 9–10 are handled at the school office, subject to seat availability.',
  },
  {
    q: 'What is the age criterion?',
    a: 'For Grade 1, the child should be between 5 and 7 years old on 1 April 2027. For Grade 8, the child should be between 12 and 14 years old. A B-Form is required as proof of age.',
  },
  {
    q: 'What documents are required?',
    a: 'A copy of the student’s B-Form, the previous school’s leaving certificate or result card, two recent passport-size photographs, and a copy of the parent or guardian’s CNIC.',
  },
  {
    q: 'When will the merit list be announced?',
    a: 'Applications are reviewed on a rolling basis. The first merit list will be displayed on 12 December 2026 at the school office and in the parent portal. Selected candidates will also receive a phone call.',
  },
  {
    q: 'Can my child apply for Grade 9 or 10?',
    a: 'Grade 9 and 10 admissions are only considered for transfer cases where seats are available. Please visit the admissions office with the previous school record and board registration details.',
  },
]

export default function Admissions() {
  const { db, create, addNotification } = useData()
  const toast = useToast()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)
  const [statusQuery, setStatusQuery] = useState('')
  const [statusResult, setStatusResult] = useState(null)
  const [statusError, setStatusError] = useState('')
  const [openFaq, setOpenFaq] = useState(0)

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const validate = () => {
    const next = {}
    if (form.studentName.trim().length < 3) next.studentName = 'Please enter the student’s full name.'
    if (form.fatherName.trim().length < 3) next.fatherName = 'Please enter the father / guardian’s name.'
    if (!form.dob) next.dob = 'Date of birth is required.'
    if (!isValidPakistaniPhone(form.phone)) next.phone = 'Enter a valid Pakistani mobile number, e.g. +92 300 1234 567.'
    if (form.email && !isValidEmail(form.email)) next.email = 'Enter a valid email address or leave this blank.'
    if (form.address.trim().length < 10) next.address = 'Please enter a complete home address.'
    if (!form.declaration) next.declaration = 'Please confirm that the information provided is accurate.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please correct the highlighted fields before submitting.', 'Application incomplete')
      return
    }
    const applicationNo = `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`
    const record = create('admissions', {
      ...form,
      applicationNo,
      status: 'Under Review',
      appliedOn: todayISO(),
    })
    addNotification({
      title: `New admission application ${applicationNo}`,
      message: `${form.studentName} applied for Grade ${form.grade}.`,
      audience: 'Admin',
      type: 'Admissions',
    })
    setSubmitted(record)
    toast.success(`Application ${applicationNo} received. Keep this number safe.`, 'Application submitted')
    setForm(initialForm)
    window.scrollTo({ top: document.getElementById('apply')?.offsetTop - 90 || 0, behavior: 'smooth' })
  }

  const checkStatus = (e) => {
    e.preventDefault()
    const q = statusQuery.trim().toUpperCase()
    if (!q) {
      setStatusError('Enter your application number to check status.')
      setStatusResult(null)
      return
    }
    const found = (db.admissions || []).find((a) => a.applicationNo?.toUpperCase() === q || a.id?.toUpperCase() === q)
    if (!found) {
      setStatusResult(null)
      setStatusError('No application was found with this number. Please check and try again.')
      return
    }
    setStatusError('')
    setStatusResult(found)
  }

  const printAcknowledgement = (app) => {
    printReceipt({
      title: 'Admission Application Acknowledgement',
      rows: [
        ['Application number', app.applicationNo],
        ['Student name', app.studentName],
        ['Father / guardian', app.fatherName],
        ['Applying for', `Grade ${app.grade}`],
        ['Date of birth', formatDate(app.dob)],
        ['Contact', app.phone],
        ['Applied on', formatDate(app.appliedOn)],
        ['Status', app.status],
      ],
      table: '',
      footerNote: 'This acknowledgement confirms receipt of an online application only. It is not an offer of admission. Please keep this number for status tracking.',
    })
  }

  const demoNumbers = useMemo(() => (db.admissions || []).slice(0, 3), [db.admissions])

  return (
    <div>
      <PublicPageHero
        eyebrow="Admissions 2026–27"
        title="Your child’s place starts with one form."
        subtitle="Admission to Government High School Narwa Bajmore is merit-based, transparent and free of any donation or capitation fee. Online applications are open for Grade 1 and Grade 8."
        image={IMG.girlsGate}
        crumbs={['Admissions']}
      >
        <a href="#apply" className="btn-gold">Start your application <ArrowRight size={15} /></a>
        <a href="#status" className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">
          Check application status
        </a>
      </PublicPageHero>

      {/* Key info */}
      <section className="container-page -mt-8 relative z-10">
        <Card className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CalendarDays, label: 'Applications open', value: '20 October 2026' },
            { icon: CalendarDays, label: 'Closing date', value: '30 November 2026' },
            { icon: GraduationCap, label: 'Grades open', value: 'Grade 1 & Grade 8' },
            { icon: Wallet, label: 'Admission fee', value: 'Free — no donation' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--season-badge)] text-[var(--season-accent)]"><item.icon size={18} /></span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                <p className="text-sm font-extrabold text-navy-900">{item.value}</p>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* Process */}
      <section className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="How it works" title="Four simple steps to enrolment." align="center"
            subtitle="Our admissions process is designed to be clear, fair and accessible to every family." />
          <div className="grid gap-5 md:grid-cols-4">
            {admissionSteps.map((step) => (
              <Card key={step.step} className="relative p-5">
                <span className="absolute right-4 top-3 text-3xl font-extrabold text-slate-100">{step.step}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400"><Icon name={step.icon} size={19} /></span>
                <h3 className="mt-3 text-sm font-extrabold text-navy-900">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{step.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility & documents */}
      <section className="bg-white py-16">
        <div className="container-page grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gov-50 text-gov-700"><Users size={19} /></span>
              <h2 className="text-lg font-extrabold text-navy-900">Eligibility</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--season-accent)]" /> Grade 1: child aged 5–7 years on 1 April 2027.</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--season-accent)]" /> Grade 8: child aged 12–14 years with a completed Grade 7 record.</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--season-accent)]" /> Domicile of Mansehra district is preferred but not mandatory.</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--season-accent)]" /> Children with disabilities are welcome; please contact the office so we can arrange support.</li>
              <li className="flex items-start gap-2.5"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--season-accent)]" /> Admission is strictly merit-based; no test fee is charged.</li>
            </ul>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 text-gold-700"><FileText size={19} /></span>
              <h2 className="text-lg font-extrabold text-navy-900">Documents required</h2>
            </div>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {[
                'Student’s B-Form (NADRA) — original and photocopy',
                'Previous school leaving certificate or last result card',
                'Two recent passport-size photographs',
                'Parent or guardian CNIC — original and photocopy',
                'Proof of residence (utility bill or rent agreement)',
                'Medical record / vaccination card, if available',
              ].map((doc) => (
                <li key={doc} className="flex items-start gap-2.5"><BadgeCheck size={16} className="mt-0.5 shrink-0 text-gov-600" /> {doc}</li>
              ))}
            </ul>
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200">
              Please do not submit original documents with the online form. Originals are verified in person only after shortlisting.
            </p>
          </Card>
        </div>
      </section>

      {/* Fee structure */}
      <section id="fees" className="section-pad scroll-mt-24">
        <div className="container-page">
          <SectionHeading eyebrow="Fee structure" title="Transparent fees. No hidden charges."
            subtitle="The following standard monthly charges apply for the 2026–27 session. Eligible students receive government fee support. No admission, donation or capitation fee is charged." />
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                    <th className="px-5 py-3">Level</th>
                    <th className="px-5 py-3">Admission fee</th>
                    <th className="px-5 py-3">Monthly tuition</th>
                    <th className="px-5 py-3">Examination fee</th>
                    <th className="px-5 py-3">Monthly total</th>
                  </tr>
                </thead>
                <tbody>
                  {feeStructure.map((row) => (
                    <tr key={row.level} className="border-b border-slate-100 last:border-0">
                      <td className="px-5 py-4 font-bold text-navy-900">{row.level}</td>
                      <td className="px-5 py-4 text-gov-700">{row.admission === 0 ? 'Free' : `PKR ${row.admission}`}</td>
                      <td className="px-5 py-4 text-slate-600">PKR {row.tuition.toLocaleString('en-PK')}</td>
                      <td className="px-5 py-4 text-slate-600">PKR {row.exam.toLocaleString('en-PK')}</td>
                      <td className="px-5 py-4 font-extrabold text-navy-900">PKR {row.total.toLocaleString('en-PK')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-[11px] text-slate-500">
              <span>• Fees are due by the 10th of each month.</span>
              <span>• A late fee of PKR {db.settings?.lateFee || 200} applies after the due date.</span>
              <span>• Payment via cash, bank transfer, EasyPaisa or JazzCash.</span>
            </div>
          </Card>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="scroll-mt-24 bg-white py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading eyebrow="Apply online" title="Online admission application."
              subtitle="Complete the form and receive an application number instantly. Our admissions team will contact you within three working days." />
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-gov-600" />
                <p className="text-xs leading-relaxed text-slate-600">Your information is stored only in this demo browser. In production, data would be encrypted and accessible only to authorised admissions staff.</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <Phone size={18} className="mt-0.5 shrink-0 text-gov-600" />
                <p className="text-xs leading-relaxed text-slate-600">Need help? Call the admissions office at <a href={`tel:${school.phone.replace(/\s/g, '')}`} className="font-semibold text-navy-900 hover:underline">{school.phone}</a> or email <a href={`mailto:${school.admissionsEmail}`} className="font-semibold text-navy-900 hover:underline">{school.admissionsEmail}</a>.</p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                <MapPin size={18} className="mt-0.5 shrink-0 text-gov-600" />
                <p className="text-xs leading-relaxed text-slate-600">Visit us Monday–Saturday, 9:00 am–1:00 pm. {school.address}</p>
              </div>
            </div>
          </div>

          <Card className="p-6 sm:p-7">
            {submitted ? (
              <div className="text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gov-50 text-gov-600"><CheckCircle2 size={32} /></span>
                <h3 className="mt-4 text-xl font-extrabold text-navy-900">Application received</h3>
                <p className="mt-1 text-sm text-slate-500">Thank you. Please keep your application number safe.</p>
                <div className="mx-auto mt-5 max-w-sm rounded-2xl border-2 border-dashed border-gov-200 bg-gov-50/50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gov-700">Application number</p>
                  <p className="mt-1 text-2xl font-extrabold tracking-wider text-navy-900">{submitted.applicationNo}</p>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <Badge tone="amber">{submitted.status}</Badge>
                    <span className="text-[11px] text-slate-500">Grade {submitted.grade}</span>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Button variant="primary" icon={Printer} onClick={() => printAcknowledgement(submitted)}>Print acknowledgement</Button>
                  <Button variant="outline" onClick={() => setSubmitted(null)}>Apply for another child</Button>
                </div>
                <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
                  Next step: our admissions office will verify your details and contact you on {submitted.phone}. You can check your status any time using the number above.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Student’s full name" required error={errors.studentName}>
                    <Input value={form.studentName} onChange={(e) => update('studentName', e.target.value)} placeholder="e.g. Muhammad Hamza" error={errors.studentName} />
                  </Field>
                  <Field label="Father / guardian name" required error={errors.fatherName}>
                    <Input value={form.fatherName} onChange={(e) => update('fatherName', e.target.value)} placeholder="e.g. Rashid Mehmood" error={errors.fatherName} />
                  </Field>
                  <Field label="Applying for grade" required>
                    <Select value={form.grade} onChange={(e) => update('grade', e.target.value)} options={['1', '8']} />
                  </Field>
                  <Field label="Gender">
                    <Select value={form.gender} onChange={(e) => update('gender', e.target.value)} options={['Male', 'Female']} />
                  </Field>
                  <Field label="Date of birth" required error={errors.dob}>
                    <Input type="date" value={form.dob} onChange={(e) => update('dob', e.target.value)} error={errors.dob} />
                  </Field>
                  <Field label="Guardian mobile" required error={errors.phone}>
                    <Input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+92 300 1234 567" error={errors.phone} />
                  </Field>
                  <Field label="Email address" error={errors.email} hint="Optional, but recommended for status updates." className="sm:col-span-2">
                    <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="parent@example.com" error={errors.email} />
                  </Field>
                  <Field label="Previous school" className="sm:col-span-2">
                    <Input value={form.previousSchool} onChange={(e) => update('previousSchool', e.target.value)} placeholder="Name of previous school, if any" />
                  </Field>
                  <Field label="Home address" required error={errors.address} className="sm:col-span-2">
                    <Textarea value={form.address} onChange={(e) => update('address', e.target.value)} rows={3} placeholder="House number, street, area, Balakot" error={errors.address} />
                  </Field>
                </div>
                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <Checkbox checked={form.declaration} onChange={(v) => update('declaration', v)} label="I confirm that the information provided is accurate and I accept the school’s admission policy." />
                  {errors.declaration ? <p className="mt-1 text-xs font-medium text-rose-600">{errors.declaration}</p> : null}
                </div>
                <Button type="submit" variant="season" className="mt-5 w-full" size="lg" icon={ArrowRight}>Submit application</Button>
                <p className="mt-2 text-center text-[10px] text-slate-400">No fee is charged to submit this form.</p>
              </form>
            )}
          </Card>
        </div>
      </section>

      {/* Status check */}
      <section id="status" className="section-pad scroll-mt-24">
        <div className="container-page">
          <Card className="mx-auto max-w-3xl p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400"><Search size={19} /></span>
              <div>
                <h2 className="text-lg font-extrabold text-navy-900">Check your application status</h2>
                <p className="text-xs text-slate-500">Enter the application number you received after submitting the form.</p>
              </div>
            </div>
            <form onSubmit={checkStatus} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Input value={statusQuery} onChange={(e) => setStatusQuery(e.target.value)} placeholder="e.g. ADM-2026-0142" className="flex-1" aria-label="Application number" />
              <Button type="submit" variant="primary" icon={Search}>Check status</Button>
            </form>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
              Demo numbers:
              {demoNumbers.map((a) => (
                <button key={a.id} type="button" onClick={() => { setStatusQuery(a.applicationNo); setStatusError(''); setStatusResult(null) }}
                  className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 hover:bg-slate-200">
                  {a.applicationNo}
                </button>
              ))}
            </div>
            {statusError ? (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{statusError}</div>
            ) : null}
            {statusResult ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{statusResult.applicationNo}</p>
                    <p className="text-base font-extrabold text-navy-900">{statusResult.studentName}</p>
                    <p className="text-xs text-slate-500">Grade {statusResult.grade} · Applied {formatDate(statusResult.appliedOn)}</p>
                  </div>
                  <Badge tone={statusResult.status === 'Approved' ? 'green' : statusResult.status === 'Rejected' ? 'red' : 'amber'}>{statusResult.status}</Badge>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-500">
                  {statusResult.status === 'Approved'
                    ? 'Congratulations! Please visit the admissions office with original documents to complete enrolment.'
                    : statusResult.status === 'Rejected'
                      ? 'Unfortunately this application was not successful. You may contact the office for feedback.'
                      : statusResult.status === 'Pending Documents'
                        ? 'Additional documents are required. Please check your email or visit the office.'
                        : 'Your application is being reviewed. The admissions team will contact you within three working days.'}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" icon={Printer} onClick={() => printAcknowledgement(statusResult)}>Print</Button>
                  <Link to="/contact" className="btn-outline !py-1.5 !text-xs">Contact admissions</Link>
                </div>
              </div>
            ) : null}
          </Card>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-16">
        <div className="container-page max-w-4xl">
          <SectionHeading eyebrow="Questions" title="Frequently asked questions" align="center" />
          <div className="space-y-2.5">
            {faqs.map((faq, i) => (
              <Card key={faq.q} className="overflow-hidden">
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left" aria-expanded={openFaq === i}>
                  <span className="flex items-center gap-2.5 text-sm font-bold text-navy-900"><HelpCircle size={16} className="shrink-0 text-[var(--season-accent)]" /> {faq.q}</span>
                  <ChevronDown size={17} className={`shrink-0 text-slate-400 transition ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i ? <p className="border-t border-slate-100 px-5 py-4 pl-12 text-sm leading-relaxed text-slate-600">{faq.a}</p> : null}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CTASection title="Still have a question about admissions?" subtitle="Our admissions office is here to help every family through the process." primary="Contact admissions" secondary="View fee structure" />
    </div>
  )
}
