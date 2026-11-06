import { useCallback, useEffect, useRef, useState } from 'react'

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable */
    }
  }, [key, value])

  return [value, setValue]
}

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])
  return matches
}

export const useDebounce = (value, delay = 250) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export const useClickOutside = (handler) => {
  const ref = useRef(null)
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [handler])
  return ref
}

export const useScrollTop = (dependency) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [dependency])
}

export const useCountUp = (target, duration = 1200) => {
  const [value, setValue] = useState(0)
  const numeric = Number(String(target).replace(/[^0-9.]/g, '')) || 0
  const suffix = String(target).replace(/[0-9.,]/g, '')
  const started = useRef(false)
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true
        const start = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setValue(Math.round(numeric * eased))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [numeric, duration])

  return { ref, display: `${value}${suffix}`, value }
}

export const useKeydown = (key, handler) => {
  const cb = useCallback(
    (event) => {
      if (event.key === key) handler(event)
    },
    [key, handler],
  )
  useEffect(() => {
    document.addEventListener('keydown', cb)
    return () => document.removeEventListener('keydown', cb)
  }, [cb])
}
