import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, CalendarDays, Clock, FileText, Printer, Search, Tag, User,
} from 'lucide-react'
import PublicPageHero from '../../components/PublicPageHero'
import CTASection from '../../components/CTASection'
import { Badge, Button, Card, Modal, SearchInput, SectionHeading, Tabs } from '../../components/ui'
import { newsItems, IMG } from '../../data/images'
import { school } from '../../data/mockData'
import { escapeHtml, formatDate } from '../../lib/utils'
import { documentHeader, printHTML } from '../../lib/print'

const categories = ['All', ...Array.from(new Set(newsItems.map((n) => n.category)))]

export default function News() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [active, setActive] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return newsItems.filter((item) => {
      const matchesQuery = !q || [item.title, item.excerpt, item.body, item.category].join(' ').toLowerCase().includes(q)
      const matchesCategory = category === 'All' || item.category === category
      return matchesQuery && matchesCategory
    })
  }, [query, category])

  const featured = filtered[0]
  const rest = filtered.slice(1)

  const printArticle = (article) => {
    printHTML(
      article.title,
      `<div class="sheet">
        ${documentHeader()}
        <h2 class="doc-title" style="text-align:left;margin-top:18px">${escapeHtml(article.title)}</h2>
        <p class="doc-sub" style="text-align:left">${escapeHtml(article.category)} · ${formatDate(article.date)} · ${escapeHtml(article.author)}</p>
        <img src="${window.location.origin}${article.image}" alt="" style="width:100%;max-height:320px;object-fit:cover;border-radius:10px" />
        <p style="margin-top:16px;line-height:1.7">${escapeHtml(article.body)}</p>
        <div class="sign"><div>${escapeHtml(article.author)}</div><div>Principal</div></div>
        <p class="foot">${escapeHtml(school.name)} · ${escapeHtml(school.phone)} · ${escapeHtml(school.email)}</p>
      </div>`,
    )
  }

  return (
    <div>
      <PublicPageHero
        eyebrow="News & notices"
        title="Stay informed. Stay involved."
        subtitle="Official notices, achievements, events and important dates from Government High School Narwa Bajmore."
        image={IMG.childrenFlags}
        crumbs={['News']}
      />

      <section className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="Latest updates" title="From the school office."
            subtitle="Every notice published here is also available to parents and students in the portal." />
          <div className="mb-6 flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
            <div className="overflow-x-auto no-scrollbar">
              <Tabs tabs={categories.map((c) => ({ key: c, label: c }))} active={category} onChange={setCategory} className="inline-flex w-max" size="sm" />
            </div>
            <SearchInput value={query} onChange={setQuery} placeholder="Search news and notices…" className="lg:w-72" />
          </div>

          {featured ? (
            <Card className="mb-8 overflow-hidden">
              <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative">
                  <img src={featured.image} alt={featured.title} loading="lazy" className="h-64 w-full object-cover lg:h-full" />
                  <span className="absolute left-4 top-4"><Badge tone="gold">Featured</Badge></span>
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <Badge tone="navy">{featured.category}</Badge>
                    <span className="flex items-center gap-1"><CalendarDays size={12} /> {formatDate(featured.date)}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {featured.author}</span>
                  </div>
                  <h3 className="mt-3 text-2xl font-extrabold leading-snug text-navy-900">{featured.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{featured.excerpt}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button variant="season" onClick={() => setActive(featured)} iconRight={ArrowRight}>Read full notice</Button>
                    <Button variant="outline" icon={Printer} onClick={() => printArticle(featured)}>Print</Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : null}

          {rest.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((item) => (
                <Card key={item.id} hover className="flex flex-col overflow-hidden">
                  <button type="button" onClick={() => setActive(item)} className="text-left">
                    <img src={item.image} alt={item.title} loading="lazy" className="aspect-[16/9] w-full object-cover transition duration-500 hover:scale-[1.03]" />
                  </button>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                      <Badge tone="navy">{item.category}</Badge>
                      <span className="flex items-center gap-1"><CalendarDays size={11} /> {formatDate(item.date)}</span>
                    </div>
                    <h3 className="mt-2 text-base font-extrabold leading-snug text-navy-900">{item.title}</h3>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">{item.excerpt}</p>
                    <button type="button" onClick={() => setActive(item)} className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--season-accent)] hover:underline">
                      Read more <ArrowRight size={13} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}

          {!filtered.length ? (
            <Card className="py-16 text-center">
              <Search size={30} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm font-bold text-navy-900">No news matches your search.</p>
              <p className="mt-1 text-xs text-slate-500">Try a different keyword or category.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setQuery(''); setCategory('All') }}>Clear filters</Button>
            </Card>
          ) : null}
        </div>
      </section>

      {/* Notice board */}
      <section className="bg-white py-16">
        <div className="container-page grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading eyebrow="Notice board" title="Important dates at a glance." />
            <div className="space-y-2.5">
              {[
                ['14 Nov 2026', 'Parent–Teacher Meeting', '9:00 am – 12:30 pm'],
                ['30 Nov 2026', 'Admission applications close', 'Online and at the school office'],
                ['12 Dec 2026', 'First merit list displayed', 'School notice board & portal'],
                ['20 Dec 2026', 'Winter vacations begin', 'School reopens 1 January 2027'],
                ['18 Jan 2027', 'Annual Prize Distribution', 'Auditorium · 10:00 am'],
              ].map(([date, title, detail]) => (
                <div key={title} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3.5">
                  <div className="w-20 shrink-0 border-r border-slate-100 pr-3 text-center">
                    <p className="text-sm font-extrabold text-navy-900">{date.split(' ')[0]}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--season-accent)]">{date.split(' ')[1]}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy-900">{title}</p>
                    <p className="text-[11px] text-slate-500">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Downloads" title="Documents & resources." />
            <div className="space-y-2.5">
              {[
                ['School Prospectus 2026–27', 'Admissions · PDF · 2.4 MB'],
                ['First Term Date Sheet', 'Examinations · PDF · 480 KB'],
                ['Winter Uniform Policy', 'Notices · PDF · 210 KB'],
                ['Fee Structure 2026–27', 'Finance · PDF · 320 KB'],
              ].map(([title, meta]) => (
                <Link key={title} to="/login" className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition hover:border-navy-300 hover:shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700"><FileText size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-navy-900">{title}</p>
                    <p className="text-[11px] text-slate-500">{meta}</p>
                  </div>
                  <ArrowRight size={15} className="shrink-0 text-slate-300" />
                </Link>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-400">Sign in to the parent or student portal to download these documents.</p>
          </div>
        </div>
      </section>

      <CTASection title="Never miss an important school notice." primary="Open the parent portal" secondary="Contact the office" />

      <Modal open={Boolean(active)} onClose={() => setActive(null)} title={active?.category || 'Notice'} subtitle={active ? formatDate(active.date) : ''} size="lg"
        footer={active ? (
          <>
            <Button variant="outline" icon={Printer} onClick={() => printArticle(active)}>Print notice</Button>
            <Button variant="primary" onClick={() => setActive(null)}>Close</Button>
          </>
        ) : null}>
        {active ? (
          <article>
            <img src={active.image} alt={active.title} className="aspect-[16/9] w-full rounded-xl object-cover" />
            <h2 className="mt-4 text-2xl font-extrabold leading-snug text-navy-900">{active.title}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1"><Tag size={12} /> {active.category}</span>
              <span className="flex items-center gap-1"><CalendarDays size={12} /> {formatDate(active.date)}</span>
              <span className="flex items-center gap-1"><User size={12} /> {active.author}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> 3 min read</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{active.body}</p>
            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Issued by</p>
              <p className="text-sm font-bold text-navy-900">{active.author}</p>
              <p className="text-xs text-slate-500">{school.name} · {school.phone}</p>
            </div>
          </article>
        ) : null}
      </Modal>
    </div>
  )
}
