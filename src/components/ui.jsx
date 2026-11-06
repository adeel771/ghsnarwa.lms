import { createContext, useContext, useEffect, useId, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, Check, ChevronLeft, ChevronRight,
  Inbox, Loader2, Search, X,
} from 'lucide-react'
import { cn, initials, statusTone, toneClasses } from '../lib/utils'

/* ------------------------------- Button ------------------------------- */
const variants = {
  primary: 'bg-navy-900 text-white hover:bg-navy-800 shadow-sm',
  season: 'bg-[var(--season-accent)] text-white hover:brightness-110 shadow-sm',
  outline: 'border border-slate-200 bg-white text-navy-900 hover:border-navy-300 hover:bg-navy-50',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-navy-900',
  gold: 'bg-gold-400 text-navy-950 hover:bg-gold-300 shadow-sm',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
  soft: 'bg-navy-50 text-navy-800 hover:bg-navy-100',
}
const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-5 py-3 text-sm gap-2 rounded-xl',
  icon: 'h-9 w-9 p-0 rounded-lg',
}

export function Button({
  children, variant = 'primary', size = 'md', icon: Icon, iconRight: IconRight,
  loading = false, className, type = 'button', disabled, ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex select-none items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100',
        variants[variant], sizes[size], className,
      )}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={16} /> : null}
      {children}
      {IconRight ? <IconRight size={16} /> : null}
    </button>
  )
}

export function IconButton({ icon: Icon, label, variant = 'ghost', size = 'icon', className, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn('inline-flex items-center justify-center rounded-lg transition-colors disabled:opacity-50', variants[variant], sizes[size], className)}
      {...props}
    >
      <Icon size={17} />
    </button>
  )
}

/* ------------------------------- Surfaces ------------------------------- */
export function Card({ children, className, hover = false, ...props }) {
  return (
    <div className={cn('rounded-2xl border border-slate-200/80 bg-white shadow-sm', hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10', className)} {...props}>
      {children}
    </div>
  )
}

export function Badge({ children, tone, className, dot = false }) {
  const resolved = tone || statusTone(children)
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide', toneClasses[resolved] || toneClasses.slate, className)}>
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  )
}

/* ------------------------------- Form controls ------------------------------- */
export function Field({ label, children, error, hint, required, className, htmlFor }) {
  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-slate-700">
          {label} {required ? <span className="text-rose-500">*</span> : null}
        </label>
      ) : null}
      {children}
      {error ? <p className="mt-1 text-xs font-medium text-rose-600">{error}</p> : hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  )
}

export function Input({ className, error, ...props }) {
  return <input className={cn('input-base', error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-100', className)} {...props} />
}

export function Textarea({ className, error, rows = 3, ...props }) {
  return <textarea rows={rows} className={cn('input-base resize-y', error && 'border-rose-300 focus:border-rose-400 focus:ring-rose-100', className)} {...props} />
}

export function Select({ className, error, children, options, placeholder, ...props }) {
  return (
    <select className={cn('input-base appearance-none bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-9', error && 'border-rose-300', className)} {...props}>
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options?.map((opt) => {
        const value = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        return <option key={value} value={value}>{label}</option>
      })}
      {children}
    </select>
  )
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className }) {
  return (
    <div className={cn('relative', className)}>
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-base pl-9 pr-9"
        aria-label={placeholder}
      />
      {value ? (
        <button type="button" onClick={() => onChange('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-700" aria-label="Clear search">
          <X size={14} />
        </button>
      ) : null}
    </div>
  )
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn('relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-[var(--season-accent)]' : 'bg-slate-300')}
      >
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </button>
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        {description ? <span className="block text-xs text-slate-500">{description}</span> : null}
      </span>
    </label>
  )
}

/* ------------------------------- Modal ------------------------------- */
export function Modal({ open, onClose, title, subtitle, children, footer, size = 'md', closeOnBackdrop = true }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null
  const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-6xl' }

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4 no-print" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-navy-950/55 backdrop-blur-sm animate-fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      <div className={cn('relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl animate-fade-up sm:rounded-2xl', widths[size])}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-lg font-bold text-navy-900">{title}</h3>
            {subtitle ? <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
            <X size={19} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer ? <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 sm:px-6">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}

export function ConfirmDialog({ open, title = 'Are you sure?', message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, tone = 'danger' }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={tone} onClick={onConfirm}>{confirmLabel}</Button>
        </>
      }
    >
      <div className="flex gap-3">
        <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', tone === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600')}>
          <AlertTriangle size={19} />
        </span>
        <p className="text-sm leading-relaxed text-slate-600">{message}</p>
      </div>
    </Modal>
  )
}

/* ------------------------------- Table ------------------------------- */
export function Table({ columns, rows, keyField = 'id', sort, onSort, onRowClick, loading, empty, actions, rowClassName }) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-11 animate-pulse rounded-lg bg-slate-100" />)}
      </div>
    )
  }
  if (!rows?.length) return empty || <EmptyState title="No records found" message="Try adjusting your search or filters." />

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left text-sm"><thead>
        <tr className="border-b border-slate-200 bg-slate-50/80">
          {columns.map((col) => (
            <th key={col.key} className={cn('whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500', col.className)}>
              {onSort ? (
                <button type="button" onClick={() => onSort(col.key)} className="inline-flex items-center gap-1 hover:text-navy-800">
                  {col.label}
                  {sort?.key === col.key
                    ? sort.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                    : <ArrowUpDown size={12} className="opacity-40" />}
                  </button>
              ) : col.label}
            </th>
          ))}
          {actions ? <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">Actions</th> : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row[keyField]}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cn('border-b border-slate-100 transition-colors last:border-0 hover:bg-navy-50/40', onRowClick && 'cursor-pointer', rowClassName)}
          >
            {columns.map((col) => (
              <td key={col.key} className={cn('px-4 py-3 align-middle text-slate-600', col.className)}>
                <CellValue row={row} col={col} />
              </td>
            ))}
            {actions ? <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>{actions(row)}</td> : null}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}

function CellValue({ row, col }) {
  const value = row[col.key]
  if (col.render) return col.render(value, row)
  if (col.primary) {
    return (
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-100 text-xs font-bold text-navy-800">
          {initials(value)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-semibold text-navy-900">{value || '—'}</span>
          {col.sub ? <span className="block truncate text-xs text-slate-400">{row[col.sub] || '—'}</span> : null}
        </span>
      </div>
    )
  }
  switch (col.format) {
    case 'badge':
      return value ? <Badge>{value}</Badge> : '—'
    case 'currency':
      return <span className="font-semibold text-navy-800">PKR {Number(value || 0).toLocaleString('en-PK')}</span>
    case 'date':
      return value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
    case 'percent':
      return (
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-200">
            <span className="block h-full rounded-full bg-[var(--season-accent)]" style={{ width: `${Number(value) || 0}%` }} />
          </span>
          <span className="text-xs font-semibold">{value ?? 0}%</span>
        </span>
      )
    case 'number':
      return <span className="font-medium text-slate-700">{Number(value || 0).toLocaleString('en-PK')}</span>
    case 'class':
      return <Badge tone="navy">{value ? `${value}-${row.section || ''}` : '—'}</Badge>
    case 'years':
      return `${value ?? 0} yrs`
    case 'count':
      return `${Array.isArray(value) ? value.length : Number(value || 0)}`
    case 'ratio':
      return `${row.submissions ?? 0} / ${row.total ?? 0}`
    case 'qty':
      return `${Number(value || 0).toLocaleString('en-PK')} ${row.unit || ''}`
    default:
      return value === '' || value == null ? '—' : String(value)
  }
}

/* ------------------------------- Pagination ------------------------------- */
export function Pagination({ page, totalPages, total, perPage, onPage, onPerPage }) {
  if (!total) return null
  const from = (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)
  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700">{from}–{to}</span> of <span className="font-semibold text-slate-700">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <select
          value={perPage}
          onChange={(e) => onPerPage(Number(e.target.value))}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600"
          aria-label="Rows per page"
        >
          {[8, 10, 20, 50].map((n) => <option key={n} value={n}>{n} / page</option>)}
        </select>
        <div className="flex items-center gap-1">
          <IconButton icon={ChevronLeft} label="Previous page" onClick={() => onPage(Math.max(1, page - 1))} disabled={page <= 1} />
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let p = i + 1
            if (totalPages > 5 && page > 3) p = Math.min(totalPages - 4, page - 2) + i
            return (
              <button key={p} type="button" onClick={() => onPage(p)}
                className={cn('h-8 min-w-8 rounded-lg px-2 text-xs font-semibold transition', p === page ? 'bg-navy-900 text-white' : 'text-slate-500 hover:bg-slate-100')}>
                {p}
              </button>
            )
          })}
          <IconButton icon={ChevronRight} label="Next page" onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- Tabs ------------------------------- */
export function Tabs({ tabs, active, onChange, className, size = 'md' }) {
  return (
    <div className={cn('flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 no-scrollbar', className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={active === tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-lg font-semibold transition-all',
            size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm',
            active === tab.key ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-slate-800',
          )}
        >
          {tab.label}
          {tab.count != null ? <span className={cn('rounded-full px-1.5 py-0.5 text-[10px]', active === tab.key ? 'bg-navy-100 text-navy-800' : 'bg-slate-200 text-slate-600')}>{tab.count}</span> : null}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------- Stat card ------------------------------- */
export function StatCard({ icon: Icon, label, value, hint, trend, tone = 'navy', className }) {
  const tones = {
    navy: 'bg-navy-50 text-navy-700',
    green: 'bg-emerald-50 text-emerald-700',
    gold: 'bg-gold-50 text-gold-700',
    sky: 'bg-sky-50 text-sky-700',
    rose: 'bg-rose-50 text-rose-700',
    purple: 'bg-purple-50 text-purple-700',
  }
  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-2 truncate text-2xl font-extrabold text-navy-900">{value}</p>
          {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
        </div>
        {Icon ? <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', tones[tone])}><Icon size={20} /></span> : null}
      </div>
      {trend ? <p className="mt-3 text-xs font-semibold text-emerald-600">{trend}</p> : null}
    </Card>
  )
}

/* ------------------------------- Page header ------------------------------- */
export function PageHeader({ eyebrow, title, subtitle, actions, children, className }) {
  return (
    <div className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--season-accent)]">{eyebrow}</p> : null}
        <h1 className="text-2xl font-extrabold tracking-tight text-navy-900 sm:text-[28px]">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm text-slate-500">{subtitle}</p> : null}
        {children}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

/* ------------------------------- Avatar ------------------------------- */
const avatarSizes = { xs: 'h-7 w-7 text-[10px]', sm: 'h-9 w-9 text-xs', md: 'h-11 w-11 text-sm', lg: 'h-16 w-16 text-lg', xl: 'h-24 w-24 text-2xl' }

export function Avatar({ name = '', src, size = 'md', className, color = 'bg-navy-700' }) {
  const [failed, setFailed] = useState(false)
  return src && !failed ? (
    <img src={src} alt={name} onError={() => setFailed(true)} loading="lazy"
      className={cn('shrink-0 rounded-full object-cover ring-2 ring-white', avatarSizes[size], className)} />
  ) : (
    <span className={cn('flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-2 ring-white', color, avatarSizes[size], className)} aria-hidden="true">
      {initials(name)}
    </span>
  )
}

/* ------------------------------- States ------------------------------- */
export function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon size={24} />
      </span>
      <h3 className="text-base font-bold text-navy-900">{title}</h3>
      {message ? <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200/80', className)} />
}

export function ProgressBar({ value = 0, tone = 'season', className, showLabel = false }) {
  const colors = { season: 'bg-[var(--season-accent)]', green: 'bg-emerald-500', amber: 'bg-amber-500', rose: 'bg-rose-500', navy: 'bg-navy-700' }
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div className={cn('h-full rounded-full transition-all duration-500', colors[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
      {showLabel ? <span className="w-9 text-right text-xs font-semibold text-slate-500">{Math.round(value)}%</span> : null}
    </div>
  )
}

/* ------------------------------- Section heading ------------------------------- */
export function SectionHeading({ eyebrow, title, subtitle, align = 'left', light = false, action, className }) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', align === 'center' && 'text-center sm:flex-col sm:items-center', className)}>
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow ? (
          <span className={cn('mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]',
            light ? 'bg-white/10 text-gold-300 ring-1 ring-white/15' : 'bg-gold-50 text-gold-700 ring-1 ring-gold-200')}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {eyebrow}
          </span>
        ) : null}
        <h2 className={cn('text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-[2.1rem]', light ? 'text-white' : 'text-navy-900')}>{title}</h2>
        {subtitle ? <p className={cn('mt-3 text-sm leading-relaxed sm:text-base', light ? 'text-navy-100/80' : 'text-slate-500')}>{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

/* ------------------------------- Dropdown ------------------------------- */
const MenuContext = createContext(null)

export function Menu({ trigger, children, align = 'right', className }) {
  const [open, setOpen] = useState(false)
  const value = useMemo(() => ({ close: () => setOpen(false) }), [])
  return (
    <MenuContext.Provider value={value}>
      <div className={cn('relative', className)}>
        <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
        {open ? (
          <>
            <button type="button" aria-label="Close menu" className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)} />
            <div className={cn('absolute z-40 mt-2 min-w-48 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-fade-up', align === 'right' ? 'right-0' : 'left-0')}>
              {children}
            </div>
          </>
        ) : null}
      </div>
    </MenuContext.Provider>
  )
}

export function MenuItem({ children, onClick, icon: Icon, danger = false, ...props }) {
  const ctx = useContext(MenuContext)
  return (
    <button
      type="button"
      onClick={(e) => { onClick?.(e); ctx?.close() }}
      className={cn('flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition',
        danger ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900')}
      {...props}
    >
      {Icon ? <Icon size={15} /> : null}
      {children}
    </button>
  )
}

export function Checkbox({ checked, onChange, label, className }) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2.5 text-sm text-slate-600', className)}>
      <span className={cn('flex h-4.5 w-4.5 items-center justify-center rounded border transition', checked ? 'border-[var(--season-accent)] bg-[var(--season-accent)] text-white' : 'border-slate-300 bg-white')}>
        {checked ? <Check size={12} strokeWidth={3} /> : null}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      {label}
    </label>
  )
}

export function useFieldId(prefix = 'field') {
  const id = useId()
  return `${prefix}-${id}`
}
