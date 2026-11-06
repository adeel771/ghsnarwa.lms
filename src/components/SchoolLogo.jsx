import { Link } from 'react-router-dom'
import { cn } from '../lib/utils'

const sizes = {
  sm: { crest: 'h-9 w-9', name: 'text-sm', sub: 'text-[10px]' },
  md: { crest: 'h-11 w-11', name: 'text-base', sub: 'text-[11px]' },
  lg: { crest: 'h-14 w-14', name: 'text-lg', sub: 'text-xs' },
}

export function Crest({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={cn('shrink-0', className)} role="img" aria-label="GHS Narwa Bajmore crest">
      <defs>
        <linearGradient id="crest-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b2545" />
          <stop offset="1" stopColor="#0f6b3d" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#crest-grad)" />
      <path d="M32 12 8 24l24 12 24-12z" fill="#f4c95d" />
      <path d="M18 30v11c0 4 6.3 7 14 7s14-3 14-7V30l-14 7z" fill="#fff" />
      <path d="M50 26v13" stroke="#f4c95d" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="43" r="3" fill="#f4c95d" />
    </svg>
  )
}

export default function SchoolLogo({ theme = 'light', size = 'md', variant = 'full', to = '/', className }) {
  const s = sizes[size] || sizes.md
  const content = (
    <span className={cn('flex items-center gap-3', className)}>
      <Crest className={s.crest} />
      {variant === 'full' ? (
        <span className="flex flex-col leading-tight">
          <span className={cn('font-extrabold tracking-tight', s.name, theme === 'dark' ? 'text-white' : 'text-navy-900')}>
            Government High School
          </span>
          <span className={cn('font-semibold uppercase tracking-[0.14em]', s.sub, theme === 'dark' ? 'text-gold-300' : 'text-gov-600')}>
            Narwa Bajmore · Digital LMS
          </span>
        </span>
      ) : null}
    </span>
  )
  if (!to) return content
  return <Link to={to} className="inline-flex items-center" aria-label="Government High School Narwa Bajmore — home">{content}</Link>
}
