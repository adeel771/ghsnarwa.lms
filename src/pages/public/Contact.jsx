import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, CheckCircle2, ChevronDown, Clock, Mail, MapPin, MessageSquare,
  Phone, Send, ShieldCheck, Users,
} from 'lucide-react'
import PublicPageHero from '../../components/PublicPageHero'
import CTASection from '../../components/CTASection'
import { Badge, Button, Card, Field, Input, SectionHeading, Select, Textarea } from '../../components/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { IMG } from '../../data/images'
import { school } from '../../data/mockData'
import { isValidEmail, isValidPakistaniPhone, todayISO } from '../../lib/utils'

const initialForm = { name: '', email: '', phone: '', role: 'Parent', subject: '', message: '' }

const faqs = [
  { q: 'What are the school timings?', a: `Summer timings are ${school.timingsSummer}. Winter timings are ${school.timingsWinter}. Timings are subject to Elementary & Secondary Education Department, Khyber Pakhtunkhwa notifications.` },
  { q: 'How do I get a fee voucher or receipt?', a: 'Parents can download fee vouchers and paid receipts from the Fees section of the parent portal. For corrections, contact the accounts office at the number below.' },
  { q: 'How can I meet the principal?', a: 'The principal holds an open office on Wednesdays from 10:00 am to 12:00 pm. Please call ahead so we can reserve time for you.' },
  { q: 'My child needs extra academic support. What should I do?', a: 'Speak to the class teacher through the portal or at the next PTM. We offer Saturday tutorials and small-group support in mathematics, English and science.' },
]

export default function Contact() {
  const { create, addNotification } = useData()
  const toast = useToast()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [ticket, setTicket] = useState(null)
  const [openFaq, setOpenFaq] = useState(0)

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (form.name.trim().length < 3) next.name = 'Please enter your full name.'
    if (!isValidEmail(form.email)) next.email = 'Please enter a valid email address.'
    if (!isValidPakistaniPhone(form.phone)) next.phone = 'Enter a valid Pakistani phone number.'
    if (form.subject.trim().length < 3) next.subject = 'Please add a short subject.'
    if (form.message.trim().length < 10) next.message = 'Please write at least 10 characters so we can help.'
    setErrors(next)
    if (Object.keys(next).length) {
      toast.error('Please correct the highlighted fields.', 'Message not sent')
      return
    }
    const ticketNo = `TKT-2026-${Math.floor(100 + Math.random() * 900)}`
    create('complaints', {
      ticket: ticketNo,
      submittedBy: form.name,
      role: form.role,
      category: 'Other',
      subject: form.subject,
      description: form.message,
      status: 'Open',
      priority: 'Medium',
      date: todayISO(),
      assignedTo: 'Admin Office',
      email: form.email,
      phone: form.phone,
    })
    addNotification({
      title: `New contact message ${ticketNo}`,
      message: `${form.name} (${form.role}): ${form.subject}`,
      audience: 'Admin',
      type: 'Complaint',
    })
    setTicket({ no: ticketNo, name: form.name })
    setForm(initialForm)
    toast.success(`Your message was logged as ${ticketNo}.`, 'Message received')
  }

  const departments = [
    { name: 'Admissions Office', email: school.admissionsEmail, phone: school.phone, detail: 'Grade 1 & 8 applications, documents and merit lists.' },
    { name: 'Accounts Office', email: 'accounts@ghsnb.edu.pk', phone: '+92 997 530 205', detail: 'Fee vouchers, receipts, refunds and payroll.' },
    { name: 'Principal’s Office', email: 'principal@ghsnb.edu.pk', phone: '+92 997 530 201', detail: 'Appointments, complaints and school policy.' },
    { name: 'Transport Office', email: 'transport@ghsnb.edu.pk', phone: '+92 997 530 208', detail: 'Bus routes, timings and driver contacts.' },
  ]

  return (
    <div>
      <PublicPageHero
        eyebrow="Contact us"
        title="We’re here to help."
        subtitle="Whether you are a parent, student, teacher or neighbour, our office is open. Call, email, visit or send us a message below."
        image={IMG.boysBuilding}
        crumbs={['Contact']}
      />

      {/* Contact cards */}
      <section className="container-page -mt-8 relative z-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Phone, label: 'Call us', value: school.phone, sub: 'Mon–Sat, 8:00 am – 2:00 pm', href: `tel:${school.phone.replace(/\s/g, '')}` },
            { icon: Mail, label: 'Email us', value: school.email, sub: 'We reply within 1 working day', href: `mailto:${school.email}` },
            { icon: MapPin, label: 'Visit us', value: `${school.village}, ${school.city}`, sub: 'By appointment, 9:00 am – 12:00 pm', href: `https://maps.google.com/?q=${encodeURIComponent(school.mapQuery)}` },
            { icon: Clock, label: 'School hours', value: '8:30 am – 1:30 pm', sub: 'Winter timings (Nov–Feb)', href: '/about' },
          ].map((item) => {
            const Wrapper = item.href.startsWith('http') ? 'a' : item.href.startsWith('/') ? Link : 'a'
            return (
              <Card key={item.label} hover className="p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--season-badge)] text-[var(--season-accent)]"><item.icon size={18} /></span>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                <Wrapper {...(item.href.startsWith('http') ? { href: item.href, target: '_blank', rel: 'noreferrer' } : item.href.startsWith('/') ? { to: item.href } : { href: item.href })}
                  className="mt-0.5 block break-words text-sm font-extrabold text-navy-900 hover:text-[var(--season-accent)]">
                  {item.value}
                </Wrapper>
                <p className="mt-1 text-[11px] text-slate-500">{item.sub}</p>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Form + info */}
      <section className="section-pad">
        <div className="container-page grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Send a message" title="How can we help?"
              subtitle="Complete the form and our office will log your message, assign it to the right department and respond within one working day." />
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-gov-600" />
                <div>
                  <p className="text-sm font-bold text-navy-900">Your message is tracked</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">You will receive a ticket number. In this demo, the message is saved to the admin complaints queue in your browser.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <MessageSquare size={18} className="mt-0.5 shrink-0 text-gov-600" />
                <div>
                  <p className="text-sm font-bold text-navy-900">Urgent safeguarding concern?</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">Please call the principal’s office directly on <a href={`tel:${school.phone.replace(/\s/g, '')}`} className="font-semibold text-navy-900 hover:underline">{school.phone}</a> rather than using this form.</p>
                </div>
              </div>
              <div className="rounded-xl bg-navy-900 p-4 text-white">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gold-400">Department contacts</p>
                <div className="mt-2 space-y-1.5 text-xs">
                  {departments.map((d) => (
                    <div key={d.name} className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 last:border-0">
                      <span className="text-white/60">{d.name}</span>
                      <a href={`mailto:${d.email}`} className="font-semibold text-gold-300 hover:underline">{d.email}</a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Card className="p-6 sm:p-7">
            {ticket ? (
              <div className="py-6 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gov-50 text-gov-600"><CheckCircle2 size={32} /></span>
                <h3 className="mt-4 text-xl font-extrabold text-navy-900">Message received</h3>
                <p className="mt-1 text-sm text-slate-500">Thank you, {ticket.name}. Our office will respond within one working day.</p>
                <div className="mx-auto mt-5 rounded-xl border-2 border-dashed border-gov-200 bg-gov-50/50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gov-700">Your ticket number</p>
                  <p className="mt-1 text-xl font-extrabold tracking-wider text-navy-900">{ticket.no}</p>
                </div>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <Button variant="outline" onClick={() => setTicket(null)}>Send another message</Button>
                  <Link to="/login" className="btn-primary">Open parent portal</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h3 className="text-lg font-extrabold text-navy-900">Contact form</h3>
                <p className="mt-1 text-xs text-slate-500">Fields marked with * are required.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Your full name" required error={errors.name}>
                    <Input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Muhammad Aslam" error={errors.name} />
                  </Field>
                  <Field label="I am a…">
                    <Select value={form.role} onChange={(e) => update('role', e.target.value)} options={['Parent', 'Student', 'Teacher', 'Neighbour / Other']} />
                  </Field>
                  <Field label="Email address" required error={errors.email}>
                    <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" error={errors.email} />
                  </Field>
                  <Field label="Phone number" required error={errors.phone}>
                    <Input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+92 300 1234 567" error={errors.phone} />
                  </Field>
                  <Field label="Subject" required error={errors.subject} className="sm:col-span-2">
                    <Input value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="What is this about?" error={errors.subject} />
                  </Field>
                  <Field label="Message" required error={errors.message} className="sm:col-span-2">
                    <Textarea value={form.message} onChange={(e) => update('message', e.target.value)} rows={5} placeholder="Please share as much detail as possible…" error={errors.message} />
                  </Field>
                </div>
                <Button type="submit" variant="season" size="lg" icon={Send} className="mt-4 w-full">Send message</Button>
                <p className="mt-2 text-center text-[10px] text-slate-400">By sending this form you agree to be contacted by the school office.</p>
              </form>
            )}
          </Card>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Departments" title="Speak to the right team." align="center" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((d) => (
              <Card key={d.name} className="p-5">
                <Users size={18} className="text-[var(--season-accent)]" />
                <h3 className="mt-2.5 text-sm font-extrabold text-navy-900">{d.name}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{d.detail}</p>
                <div className="mt-3 space-y-1 border-t border-slate-100 pt-2.5 text-[11px]">
                  <a href={`mailto:${d.email}`} className="block truncate font-semibold text-navy-800 hover:underline">{d.email}</a>
                  <a href={`tel:${d.phone.replace(/\s/g, '')}`} className="block text-slate-500 hover:underline">{d.phone}</a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map & FAQ */}
      <section className="section-pad">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Find us" title="Visit our campus." subtitle={`We are located at ${school.address} — with parking available inside the school gate.`} />
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <iframe
                title="Map to Government High School Narwa Bajmore"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(school.mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <a href={`https://maps.google.com/?q=${encodeURIComponent(school.mapQuery)}`} target="_blank" rel="noreferrer" className="btn-outline">
                <MapPin size={15} /> Open in Google Maps
              </a>
              <span className="text-[11px] text-slate-400">Free parking available on site.</span>
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Quick answers" title="Frequently asked questions." />
            <div className="space-y-2.5">
              {faqs.map((faq, i) => (
                <Card key={faq.q} className="overflow-hidden">
                  <button type="button" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left" aria-expanded={openFaq === i}>
                    <span className="text-sm font-bold text-navy-900">{faq.q}</span>
                    <ChevronDown size={16} className={`shrink-0 text-slate-400 transition ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i ? <p className="border-t border-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-600">{faq.a}</p> : null}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection title="Ready to visit us?" primary="Apply for admission" secondary="Call the office" />
    </div>
  )
}
