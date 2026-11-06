import { cn } from '../lib/utils'

export function BarChart({ data = [], height = 180, color = 'var(--season-accent)', className, suffix = '' }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((item) => (
          <div key={item.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 opacity-0 transition group-hover:opacity-100">{item.value}{suffix}</span>
            <div
              className="w-full max-w-10 rounded-t-md transition-all duration-500 hover:opacity-80"
              style={{ height: `${Math.max(4, (item.value / max) * 100)}%`, backgroundColor: item.color || color }}
              title={`${item.label}: ${item.value}${suffix}`}
            />
            <span className="w-full truncate text-center text-[10px] font-medium text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LineChart({ data = [], height = 180, color = 'var(--season-accent)', className, suffix = '%' }) {
  if (!data.length) return null
  const width = 320
  const pad = 8
  const max = Math.max(...data.map((d) => d.value), 1)
  const min = Math.min(...data.map((d) => d.value), 0)
  const range = max - min || 1
  const points = data.map((d, i) => {
    const x = pad + (i * (width - pad * 2)) / Math.max(1, data.length - 1)
    const y = height - pad - ((d.value - min) / range) * (height - pad * 2)
    return { x, y, ...d }
  })
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const area = `${path} L ${points[points.length - 1].x} ${height - pad} L ${points[0].x} ${height - pad} Z`
  const gradientId = `line-grad-${Math.random().toString(36).slice(2, 8)}`
  return (
    <div className={cn('w-full', className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Trend chart">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={pad} x2={width - pad} y1={height * f} y2={height * f} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 4" />
        ))}
        <path d={area} fill={`url(#${gradientId})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
            <title>{`${p.label}: ${p.value}${suffix}`}</title>
          </g>
        ))}
      </svg>
      <div className="mt-1 flex justify-between px-1">
        {data.map((d) => <span key={d.label} className="text-[9px] font-medium text-slate-400">{d.label}</span>)}
      </div>
    </div>
  )
}

export function DonutChart({ segments = [], size = 150, thickness = 16, centerLabel, centerValue, className }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0
  return (
    <div className={cn('flex items-center gap-5', className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" role="img" aria-label="Distribution chart">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
          {segments.map((segment) => {
            const length = (segment.value / total) * circumference
            const circle = (
              <circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={thickness}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              >
                <title>{`${segment.label}: ${segment.value}`}</title>
              </circle>
            )
            offset += length
            return circle
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold text-navy-900">{centerValue ?? total}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{centerLabel || 'Total'}</span>
        </div>
      </div>
      <div className="min-w-0 space-y-1.5">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: segment.color }} />
            <span className="flex-1 truncate text-slate-500">{segment.label}</span>
            <span className="font-bold text-navy-900">{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Sparkline({ values = [], color = 'var(--season-accent)', className }) {
  if (!values.length) return null
  const width = 120
  const height = 34
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const path = values.map((v, i) => {
    const x = (i * width) / Math.max(1, values.length - 1)
    const y = height - 3 - ((v - min) / range) * (height - 6)
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn('h-8 w-28', className)} aria-hidden="true">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
