import { useEffect, useMemo, useState } from 'react'
import {
  Download, Eye, Pencil, Plus, Printer, RefreshCw, Trash2, FilterX, ListFilter,
} from 'lucide-react'
import Icon from '../../components/Icon'
import {
  Badge, Button, Card, ConfirmDialog, EmptyState, Field, IconButton, Input, Modal,
  PageHeader, Pagination, SearchInput, Select, Table, Textarea,
} from '../../components/ui'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { displayTeacher, teacherInfoPlaceholder } from '../../data/mockData'
import { resourceConfigs } from '../../data/resourceConfigs'
import { downloadCSV, formatDate, isValidEmail, paginate, sortRows } from '../../lib/utils'
import { printTable } from '../../lib/print'

const fieldValue = (row, field) => {
  const value = row?.[field.key]
  if (value == null) return ''
  return value
}

const TEACHER_DISPLAY_FIELDS = new Set([
  'name', 'designation', 'subject', 'qualification', 'phone', 'email',
  'gender', 'joiningDate', 'classes', 'experience', 'cnic',
])

export default function ResourcePage({ configKey }) {
  const config = resourceConfigs[configKey]
  const { list, create, update, remove } = useData()
  const toast = useToast()
  const rows = list(configKey)

  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState({ key: config.columns[0].key, direction: 'asc' })
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(8)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [viewing, setViewing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    setPage(1)
  }, [query, filters, perPage])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      const matchesQuery = !q || config.searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q))
      const matchesFilters = Object.entries(filters).every(([key, value]) => !value || String(row[key]) === value)
      return matchesQuery && matchesFilters
    })
  }, [rows, query, filters, config.searchKeys])

  const sorted = useMemo(() => sortRows(filtered, sort.key, sort.direction), [filtered, sort])
  const pageRows = paginate(sorted, page, perPage)
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage))
  const isTeachers = configKey === 'teachers'
  const displayRows = sorted.map((row) => (isTeachers
    ? {
        ...row,
        name: displayTeacher(row.name),
        designation: displayTeacher(row.designation),
        subject: displayTeacher(row.subject),
        qualification: displayTeacher(row.qualification),
        classes: displayTeacher(row.classes),
      }
    : row))
  const displayPageRows = pageRows.map((row) => displayRows.find((item) => item.id === row.id) || row)
  const exportRows = isTeachers
    ? displayRows.map((row) => ({
        ...row,
        experience: row.experience === '' || row.experience == null ? teacherInfoPlaceholder : row.experience,
      }))
    : displayRows
  const displayColumns = isTeachers
    ? config.columns.map((column) => (column.key === 'experience'
        ? { ...column, render: (value) => (value === '' || value == null ? displayTeacher(value) : `${value} years`) }
        : column))
    : config.columns
  const displayFieldValue = (row, field) => (isTeachers && TEACHER_DISPLAY_FIELDS.has(field.key)
    ? displayTeacher(fieldValue(row, field))
    : fieldValue(row, field))

  const openAdd = () => {
    setEditing(null)
    setForm({ ...config.defaults })
    setErrors({})
    setFormOpen(true)
  }

  const openEdit = (row) => {
    const source = rows.find((item) => item.id === row.id) || row
    setEditing(source)
    const next = {}
    config.fields.forEach((field) => { next[field.key] = fieldValue(source, field) })
    setForm(next)
    setErrors({})
    setViewing(null)
    setFormOpen(true)
  }

  const validate = () => {
    const next = {}
    config.fields.forEach((field) => {
      const value = form[field.key]
      if (field.required && (value == null || String(value).trim() === '')) {
        next[field.key] = `${field.label} is required.`
        return
      }
      if (field.type === 'email' && value && !isValidEmail(value)) next[field.key] = 'Enter a valid email address.'
      if (field.type === 'number' && value !== '' && Number.isNaN(Number(value))) next[field.key] = 'Enter a valid number.'
      if (field.type === 'number' && field.min != null && Number(value) < field.min) next[field.key] = `Minimum is ${field.min}.`
      if (field.type === 'number' && field.max != null && Number(value) > field.max) next[field.key] = `Maximum is ${field.max}.`
    })
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please correct the highlighted fields.', 'Check the form')
      return
    }
    const payload = { ...form }
    config.fields.forEach((field) => {
      if (field.type === 'number' && payload[field.key] !== '' && payload[field.key] != null) {
        payload[field.key] = Number(payload[field.key])
      }
    })
    if (editing) {
      update(configKey, editing.id, payload)
      toast.success(`${config.title.replace(/s$/, '')} updated successfully.`, 'Saved')
    } else {
      const record = create(configKey, payload)
      toast.success(`New record ${record.id} added to ${config.title}.`, 'Created')
    }
    setFormOpen(false)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    remove(configKey, deleteTarget.id)
    toast.success('Record deleted.', 'Removed')
    setDeleteTarget(null)
  }

  const exportCsv = () => {
    downloadCSV(`${configKey}-${new Date().toISOString().slice(0, 10)}.csv`, exportRows, config.columns.map((c) => ({ key: c.key, label: c.label })))
    toast.success(`${sorted.length} records exported to CSV.`, 'Export ready')
  }

  const printRows = () => {
    printTable(config.title, config.columns.map((c) => ({ key: c.key, label: c.label })), exportRows, [
      ['Report', config.title],
      ['Total records', sorted.length],
      ['Generated', formatDate(new Date())],
    ])
  }

  const activeFilters = Object.values(filters).filter(Boolean).length
  const handleFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))
  const toggleSort = (key) => setSort((prev) => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }))

  return (
    <div>
      <PageHeader
        eyebrow="Management"
        title={config.title}
        subtitle={config.subtitle}
        actions={
          <>
            <Button variant="outline" size="sm" icon={Printer} onClick={printRows}>Print</Button>
            <Button variant="outline" size="sm" icon={Download} onClick={exportCsv}>Export</Button>
            <Button variant="season" icon={Plus} onClick={openAdd}>{config.addLabel}</Button>
          </>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
          <SearchInput value={query} onChange={setQuery} placeholder={`Search ${config.title.toLowerCase()}…`} className="flex-1" />
          <div className="flex flex-wrap items-center gap-2">
            {config.filters.map((filter) => (
              <Select key={filter.key} value={filters[filter.key] || ''} onChange={(e) => handleFilter(filter.key, e.target.value)}
                options={filter.options} placeholder={filter.label} className="w-auto w-[130px] py-2 text-xs" aria-label={`Filter by ${filter.label}`} />
            ))}
            {activeFilters ? (
              <Button variant="ghost" size="sm" icon={FilterX} onClick={() => setFilters({})}>Clear</Button>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 py-2 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5"><ListFilter size={12} /> {filtered.length} of {rows.length} records{activeFilters ? ` · ${activeFilters} filter${activeFilters > 1 ? 's' : ''}` : ''}</span>
          <span className="hidden sm:inline">Click a row to view details</span>
        </div>

        <Table
          columns={displayColumns}
          rows={displayPageRows}
          sort={sort}
          onSort={toggleSort}
          onRowClick={setViewing}
          empty={
            <EmptyState
              title={`No ${config.title.toLowerCase()} found`}
              message={rows.length ? 'Try clearing your search or filters.' : `Get started by adding your first record.`}
              action={rows.length
                ? <Button variant="outline" icon={RefreshCw} onClick={() => { setQuery(''); setFilters({}) }}>Reset filters</Button>
                : <Button variant="season" icon={Plus} onClick={openAdd}>{config.addLabel}</Button>}
            />
          }
          actions={(row) => (
            <div className="flex items-center justify-end gap-0.5">
              <IconButton icon={Eye} label="View details" onClick={() => setViewing(row)} />
              <IconButton icon={Pencil} label="Edit record" onClick={() => openEdit(row)} />
              <IconButton icon={Trash2} label="Delete record" className="text-rose-500 hover:bg-rose-50" onClick={() => setDeleteTarget(row)} />
            </div>
          )}
        />

        <Pagination page={page} totalPages={totalPages} total={sorted.length} perPage={perPage}
          onPage={(p) => setPage(Math.min(totalPages, Math.max(1, p)))} onPerPage={setPerPage} />
      </Card>

      {/* Add / edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? `Edit ${config.title.replace(/s$/, '')}` : config.addLabel}
        subtitle={editing ? `Record ${editing.id}` : `Add a new record to ${config.title.toLowerCase()}.`}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button variant="season" icon={editing ? Pencil : Plus} onClick={submit}>{editing ? 'Save changes' : config.addLabel}</Button>
          </>
        }
      >
        <form onSubmit={submit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            {config.fields.map((field) => {
              const span = field.span === 2 ? 'sm:col-span-2' : ''
              const value = form[field.key] ?? ''
              return (
                <Field key={field.key} label={field.label} required={field.required} error={errors[field.key]} className={span}>
                  {field.type === 'select' ? (
                    <Select value={value} onChange={(e) => { setForm((p) => ({ ...p, [field.key]: e.target.value })); setErrors((p) => ({ ...p, [field.key]: '' })) }}
                      options={field.options} error={errors[field.key]} aria-label={field.label}>
                      {value && !field.options.includes(value) ? <option value={value}>{value}</option> : null}
                    </Select>
                  ) : field.type === 'textarea' ? (
                    <Textarea value={value} onChange={(e) => { setForm((p) => ({ ...p, [field.key]: e.target.value })); setErrors((p) => ({ ...p, [field.key]: '' })) }}
                      placeholder={field.placeholder} rows={3} error={errors[field.key]} />
                  ) : (
                    <Input type={field.type || 'text'} value={value} min={field.min} max={field.max}
                      onChange={(e) => { setForm((p) => ({ ...p, [field.key]: e.target.value })); setErrors((p) => ({ ...p, [field.key]: '' })) }}
                      placeholder={field.placeholder} error={errors[field.key]} />
                  )}
                </Field>
              )
            })}
          </div>
          <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
        </form>
      </Modal>

      {/* View modal */}
      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={config.title.replace(/s$/, '')} subtitle={viewing?.id} size="md"
        footer={viewing ? (
          <>
            <Button variant="outline" icon={Printer} onClick={() => printTable(`${config.title} record`, [{ key: 'field', label: 'Field' }, { key: 'value', label: 'Value' }],
              config.fields.map((f) => ({ field: f.label, value: displayFieldValue(viewing, f) })), [['Record ID', viewing.id]])}>Print record</Button>
            <Button variant="outline" icon={Pencil} onClick={() => openEdit(viewing)}>Edit</Button>
            <Button variant="primary" onClick={() => setViewing(null)}>Close</Button>
          </>
        ) : null}>
        {viewing ? (
          <div>
            <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400"><Icon name={config.icon} size={20} /></span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Record ID</p>
                <p className="text-sm font-extrabold text-navy-900">{viewing.id}</p>
              </div>
              {viewing.status ? <Badge className="ml-auto">{viewing.status}</Badge> : null}
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {config.fields.map((field) => {
                const value = displayFieldValue(viewing, field)
                return (
                  <div key={field.key} className={`rounded-lg border border-slate-100 px-3 py-2 ${field.span === 2 ? 'sm:col-span-2' : ''}`}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{field.label}</p>
                    <p className="mt-0.5 break-words text-sm font-semibold text-slate-700">
                      {Array.isArray(value) ? value.join(', ') : value === '' ? '—' : String(value)}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this record?"
        message={`This will permanently remove ${deleteTarget?.id} from ${config.title.toLowerCase()}. This action cannot be undone in the demo database.`}
        confirmLabel="Delete record"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
