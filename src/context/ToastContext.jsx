import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X, XCircle } from 'lucide-react'
import { uid } from '../lib/utils'

const ToastContext = createContext(null)

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
}

const styles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-rose-200 bg-rose-50 text-rose-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, type = 'success', title = '') => {
      const id = uid('TOAST')
      setToasts((prev) => [...prev, { id, message, type, title }])
      setTimeout(() => dismiss(id), 4200)
      return id
    },
    [dismiss],
  )

  const toast = {
    push,
    success: (message, title) => push(message, 'success', title),
    error: (message, title) => push(message, 'error', title),
    warning: (message, title) => push(message, 'warning', title),
    info: (message, title) => push(message, 'info', title),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2.5 no-print">
        {toasts.map((toastItem) => {
          const Icon = icons[toastItem.type] || Info
          return (
            <div
              key={toastItem.id}
              role="status"
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg animate-fade-up ${styles[toastItem.type]}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                {toastItem.title ? <p className="text-sm font-bold">{toastItem.title}</p> : null}
                <p className="text-sm leading-snug">{toastItem.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(toastItem.id)}
                className="shrink-0 rounded p-0.5 opacity-60 transition hover:opacity-100"
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
