import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FALLBACK_IMAGE } from '../data/images'
import { cn } from '../lib/utils'

const ROTATION_MS = 1000

/**
 * Shared image carousel.
 * - advances exactly every 1000 ms
 * - loops infinitely, pauses on hover/focus
 * - arrows, indicators and touch swipe
 * - stacked crossfade images so no blank frame ever appears
 * - lazy-loads non-primary images and falls back on error
 */
export default function ImageCarousel({
  slides = [],
  className,
  aspect = 'aspect-[16/10]',
  rounded = 'rounded-3xl',
  showCaptions = true,
  showArrows = true,
  showIndicators = true,
  priority = false,
  overlay = true,
  captionClassName,
  children,
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [failed, setFailed] = useState({})
  const touchStart = useRef(null)
  const safeSlides = slides.length ? slides : [{ image: FALLBACK_IMAGE, title: 'Government High School Narwa Bajmore', caption: 'Knowledge, Character, Service' }]

  useEffect(() => {
    if (paused || safeSlides.length < 2) return undefined
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeSlides.length)
    }, ROTATION_MS)
    return () => window.clearInterval(timer)
  }, [paused, safeSlides.length])

  useEffect(() => {
    if (index >= safeSlides.length) setIndex(0)
  }, [index, safeSlides.length])

  const go = (direction) => {
    setIndex((current) => (current + direction + safeSlides.length) % safeSlides.length)
  }

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX
    setPaused(true)
  }
  const onTouchEnd = (e) => {
    if (touchStart.current == null) return
    const delta = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(delta) > 40) go(delta > 0 ? -1 : 1)
    touchStart.current = null
    setPaused(false)
  }

  return (
    <div
      className={cn('group relative isolate overflow-hidden bg-navy-900', rounded, aspect, className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Photo carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {safeSlides.map((slide, i) => (
        <div
          key={`${slide.image}-${i}`}
          className={cn('absolute inset-0 transition-opacity duration-700 ease-out', i === index ? 'z-10 opacity-100' : 'z-0 opacity-0')}
          aria-hidden={i !== index}
        >
          <img
            src={failed[i] ? FALLBACK_IMAGE : slide.image}
            alt={slide.title || 'Government High School Narwa Bajmore'}
            loading={priority && i === 0 ? 'eager' : 'lazy'}
            fetchPriority={priority && i === 0 ? 'high' : 'auto'}
            decoding="async"
            draggable="false"
            onError={() => setFailed((prev) => ({ ...prev, [i]: true }))}
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {overlay ? <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-navy-950/85 via-navy-950/15 to-transparent" /> : null}

      {showCaptions && (safeSlides[index]?.title || safeSlides[index]?.caption) ? (
        <div className={cn('absolute inset-x-0 bottom-0 z-30 p-5 pr-24 sm:p-7 sm:pr-28', captionClassName)}>
          {safeSlides[index]?.title ? <h3 className="text-lg font-bold text-white drop-shadow sm:text-2xl">{safeSlides[index].title}</h3> : null}
          {safeSlides[index]?.caption ? <p className="mt-1 max-w-xl text-xs text-white/80 sm:text-sm">{safeSlides[index].caption}</p> : null}
        </div>
      ) : null}

      {showArrows && safeSlides.length > 1 ? (
        <div className="absolute bottom-5 right-4 z-40 flex gap-2 sm:bottom-7 sm:right-6">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur transition hover:bg-white/30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      ) : null}

      {showIndicators && safeSlides.length > 1 ? (
        <div className="absolute left-4 top-4 z-40 flex gap-1.5 rounded-full bg-navy-950/30 px-2.5 py-2 backdrop-blur sm:left-6 sm:top-6">
          {safeSlides.map((slide, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === index}
              className={cn('h-1.5 rounded-full transition-all duration-300', i === index ? 'w-5 bg-gold-400' : 'w-1.5 bg-white/55 hover:bg-white')}
            />
          ))}
        </div>
      ) : null}

      {children}
    </div>
  )
}
