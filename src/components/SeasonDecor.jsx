import { useSeason } from '../context/SeasonContext'
import { cn } from '../lib/utils'

export default function SeasonDecor({ className, variant = 'auto' }) {
  const { isWinter } = useSeason()
  const winter = variant === 'winter' || (variant === 'auto' && isWinter)

  if (winter) {
    return (
      <div className={cn('season-snow', className)} aria-hidden="true">
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 37 + 9) % 100}%`,
              width: `${3 + (i % 4)}px`,
              height: `${3 + (i % 4)}px`,
              animationDelay: `${(i % 11) * 0.55}s`,
              animationDuration: `${5 + (i % 5)}s`,
              opacity: 0.35 + (i % 5) * 0.1,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <div className="season-sun -right-20 -top-24" />
      <div className="season-sun -bottom-32 -left-24" style={{ animationDelay: '2s', opacity: 0.5 }} />
    </div>
  )
}
