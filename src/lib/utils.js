export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const pad = (n, size = 3) => String(n).padStart(size, '0')

export const uid = (prefix = 'ID') =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 900 + 100)}`

export const formatPKR = (value, withSymbol = true) => {
  const n = Number(value) || 0
  const formatted = new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(n)
  return withSymbol ? `PKR ${formatted}` : formatted
}

export const formatDate = (value) => {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const formatDateTime = (value) => {
  if (!value) return '—'
  const d = new Date(value.replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return String(value)
  return `${formatDate(d)} · ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
}

export const initials = (name = '') =>
  name
    .replace(/^(Mr|Mrs|Ms|Dr|Prof|Engr)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

export const ageFromDob = (dob) => {
  if (!dob) return '—'
  const birth = new Date(dob)
  if (Number.isNaN(birth.getTime())) return '—'
  const diff = Date.now() - birth.getTime()
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
}

export const gradeFromMarks = (obtained, total = 100) => {
  const pct = (obtained / total) * 100
  if (pct >= 90) return 'A+'
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B'
  if (pct >= 60) return 'C'
  if (pct >= 50) return 'D'
  if (pct >= 40) return 'E'
  return 'F'
}

export const percentage = (obtained, total) => (total ? Math.round((obtained / total) * 100) : 0)

export const paginate = (items, page, perPage) => items.slice((page - 1) * perPage, page * perPage)

export const downloadCSV = (filename, rows, columns) => {
  const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`
  const header = columns.map((c) => escape(c.label)).join(',')
  const body = rows.map((row) => columns.map((c) => escape(row[c.key])).join(',')).join('\n')
  const blob = new Blob([`\uFEFF${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const downloadText = (filename, text, type = 'text/plain') => {
  const blob = new Blob([text], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const todayISO = () => new Date().toISOString().slice(0, 10)

export const classLabel = (grade, section) => `${grade}-${section}`

export const statusTone = (status = '') => {
  const s = String(status).toLowerCase()
  if (['active', 'paid', 'approved', 'resolved', 'issued', 'completed', 'present', 'available', 'in use', 'in stock'].includes(s)) return 'green'
  if (['pending', 'under review', 'in progress', 'scheduled', 'partial', 'late', 'fair', 'open'].includes(s)) return 'amber'
  if (['unpaid', 'overdue', 'rejected', 'absent', 'cancelled', 'damaged', 'all issued', 'closed', 'suspended'].includes(s)) return 'red'
  if (['maintenance', 'leave', 'pending documents', 'on leave', 'repair'].includes(s)) return 'blue'
  if (['science', 'general', 'compulsory', 'public', 'new'].includes(s)) return 'navy'
  return 'slate'
}

export const toneClasses = {
  green: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  red: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  blue: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  navy: 'bg-navy-50 text-navy-700 ring-1 ring-navy-200',
  slate: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  purple: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  gold: 'bg-gold-50 text-gold-700 ring-1 ring-gold-200',
}

export const isValidPakistaniPhone = (value = '') => {
  const cleaned = value.replace(/[\s-]/g, '')
  return /^(\+92|0)3\d{9}$/.test(cleaned) || /^(\+92|0)\d{9,11}$/.test(cleaned)
}

export const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)

export const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const seasonForMonth = (month, winterStart = 11, winterEnd = 2) => {
  const inWinter = winterStart <= winterEnd
    ? month >= winterStart && month <= winterEnd
    : month >= winterStart || month <= winterEnd
  return inWinter ? 'winter' : 'summer'
}

export const sortRows = (rows, key, direction = 'asc') => {
  const sorted = [...rows].sort((a, b) => {
    const av = a[key]
    const bv = b[key]
    if (av == null) return 1
    if (bv == null) return -1
    if (typeof av === 'number' && typeof bv === 'number') return av - bv
    return String(av).localeCompare(String(bv), undefined, { numeric: true })
  })
  return direction === 'desc' ? sorted.reverse() : sorted
}

export const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
