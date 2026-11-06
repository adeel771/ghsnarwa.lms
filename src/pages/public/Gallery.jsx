import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Camera, Image as ImageIcon, X } from 'lucide-react'
import PublicPageHero from '../../components/PublicPageHero'
import CTASection from '../../components/CTASection'
import ImageCarousel from '../../components/ImageCarousel'
import { Button, Modal, SectionHeading, Tabs } from '../../components/ui'
import { useSeason } from '../../context/SeasonContext'
import { galleryItems, heroSlides, IMG } from '../../data/images'

const categories = ['All', 'Assemblies', 'Classrooms', 'Laboratories', 'Sports', 'Events', 'Campus', 'Seasons']

export default function Gallery() {
  const [category, setCategory] = useState('All')
  const [activeIndex, setActiveIndex] = useState(null)
  const { season } = useSeason()

  const filtered = useMemo(
    () => (category === 'All' ? galleryItems : galleryItems.filter((item) => item.category === category)),
    [category],
  )

  useEffect(() => {
    if (activeIndex == null) return undefined
    const handler = (e) => {
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % filtered.length)
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [activeIndex, filtered.length])

  useEffect(() => {
    setActiveIndex(null)
  }, [category])

  const active = activeIndex != null ? filtered[activeIndex] : null

  return (
    <div>
      <PublicPageHero
        eyebrow="Gallery"
        title="Life at GHS Narwa Bajmore, in pictures."
        subtitle="Assemblies, classrooms, laboratories, sports and celebrations — a window into our school community across the seasons."
        image={IMG.culturalEvent}
        crumbs={['Gallery']}
      />

      {/* Seasonal carousel */}
      <section className="section-pad">
        <div className="container-page">
          <SectionHeading eyebrow="Seasonal highlights" title={`${season === 'winter' ? 'Winter' : 'Summer'} at GHS Narwa Bajmore`}
            subtitle="Our campus changes with the seasons. These photographs rotate automatically to show a typical day at school." />
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
            <ImageCarousel slides={heroSlides[season]} aspect="aspect-[16/9]" className="shadow-xl" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {galleryItems.slice(0, 3).map((item) => (
                <button key={item.id} type="button" onClick={() => { setCategory('All'); setActiveIndex(galleryItems.findIndex((g) => g.id === item.id)) }}
                  className="group relative overflow-hidden rounded-xl text-left">
                  <img src={item.image} alt={item.title} loading="lazy" className="h-24 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-28" />
                  <span className="absolute inset-0 bg-gradient-to-r from-navy-950/80 to-transparent" />
                  <span className="absolute inset-y-0 left-0 flex flex-col justify-center p-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-300">{item.category}</span>
                    <span className="text-sm font-bold text-white">{item.title}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filterable grid */}
      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Photo album" title="Browse our moments."
            subtitle="Click any photograph to open it full-size. Use the arrow keys or buttons to move through the album." />
          <div className="mb-6 overflow-x-auto no-scrollbar">
            <Tabs tabs={categories.map((c) => ({ key: c, label: c, count: c === 'All' ? galleryItems.length : galleryItems.filter((i) => i.category === c).length }))}
              active={category} onChange={setCategory} className="inline-flex w-max" />
          </div>

          {filtered.length ? (
            <div className="grid auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[200px] md:grid-cols-4">
              {filtered.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`group relative overflow-hidden rounded-2xl text-left ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                >
                  <img src={item.image} alt={item.title} loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent opacity-70 transition group-hover:opacity-95" />
                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-300">{item.category}</span>
                    <p className="text-xs font-bold text-white sm:text-sm">{item.title}</p>
                  </div>
                  <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                    <ImageIcon size={14} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
              <Camera size={30} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm font-bold text-navy-900">No photographs in this category yet.</p>
              <Button variant="outline" className="mt-4" onClick={() => setCategory('All')}>View all photos</Button>
            </div>
          )}

          <p className="mt-6 text-center text-[11px] text-slate-400">
            Photography sourced from Wikimedia Commons (USAID public-domain and CC-licensed images) and Pexels. Used with permission under their respective licences.
          </p>
        </div>
      </section>

      <CTASection title="Want to see the campus for yourself?" primary="Book a visit" secondary="Apply for admission" />

      <Modal open={Boolean(active)} onClose={() => setActiveIndex(null)} title={active?.title || 'Photo'} subtitle={active?.category} size="xl">
        {active ? (
          <div>
            <div className="relative overflow-hidden rounded-xl bg-navy-950">
              <img src={active.image} alt={active.title} className="max-h-[62vh] w-full object-contain" />
              <button type="button" onClick={() => setActiveIndex((activeIndex - 1 + filtered.length) % filtered.length)}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30" aria-label="Previous photo">
                <ChevronLeft size={20} />
              </button>
              <button type="button" onClick={() => setActiveIndex((activeIndex + 1) % filtered.length)}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30" aria-label="Next photo">
                <ChevronRight size={20} />
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-navy-950/60 px-3 py-1 text-[10px] font-bold text-white/80 backdrop-blur">
                {activeIndex + 1} / {filtered.length}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{active.caption}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">GHS Narwa Bajmore photo album · {active.category}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" icon={ChevronLeft} onClick={() => setActiveIndex((activeIndex - 1 + filtered.length) % filtered.length)}>Previous</Button>
                <Button size="sm" variant="outline" iconRight={ChevronRight} onClick={() => setActiveIndex((activeIndex + 1) % filtered.length)}>Next</Button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
