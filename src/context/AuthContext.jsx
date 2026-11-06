import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useData } from './DataContext'
import { roleKeys } from '../data/mockData'

const SESSION_KEY = 'ghsnb_session'
const AuthContext = createContext(null)

const loadSession = () => {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const persistSession = (user) => {
  try {
    if (user) window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else window.localStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }) {
  const { db, getStudent, getTeacher, getParent } = useData()
  const [user, setUser] = useState(loadSession)

  const login = useCallback(
    (email, password) => {
      const cleanEmail = String(email || '').trim().toLowerCase()
      if (!cleanEmail || !password) {
        return { ok: false, error: 'Please enter both your email and password.' }
      }
      const account = (db.users || []).find((u) => String(u.email).toLowerCase() === cleanEmail)
      if (!account) {
        return { ok: false, error: 'No account was found with this email address.' }
      }
      const expected = account.password || 'demo1234'
      if (password !== expected) {
        return { ok: false, error: 'Incorrect password. Demo accounts use \u201cdemo1234\u201d.' }
      }
      if (account.status === 'Suspended') {
        return { ok: false, error: 'This account has been suspended. Please contact the school office.' }
      }
      const session = {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        roleKey: roleKeys[account.role] || 'student',
        initials: account.initials || account.name?.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase(),
        linkedId: account.linkedId ?? null,
        color: account.color || 'bg-navy-700',
      }
      setUser(session)
      persistSession(session)
      return { ok: true, user: session }
    },
    [db.users],
  )

  const logout = useCallback(() => {
    setUser(null)
    persistSession(null)
  }, [])

  const forgotPassword = useCallback(
    (email) => {
      const cleanEmail = String(email || '').trim().toLowerCase()
      const account = (db.users || []).find((u) => String(u.email).toLowerCase() === cleanEmail)
      if (!account) {
        return {
          ok: false,
          error: 'No registered account uses this email address. Please contact the school office.',
        }
      }
      return {
        ok: true,
        message: `Demo mode: password-reset emails are not actually sent. The demo password for ${account.email} is \u201cdemo1234\u201d. In production, a secure reset link would be emailed and would expire after 30 minutes.`,
      }
    },
    [db.users],
  )

  const updateProfile = useCallback(
    (patch) => {
      setUser((prev) => {
        if (!prev) return prev
        const next = { ...prev, ...patch }
        persistSession(next)
        return next
      })
    },
    [],
  )

  const linkedStudent = user?.roleKey === 'student' ? getStudent(user.linkedId) : null
  const linkedParent = user?.roleKey === 'parent' ? getParent(user.linkedId) : null
  const linkedTeacher = user?.roleKey === 'teacher' ? getTeacher(user.linkedId) : null
  const childRecords = linkedParent ? (linkedParent.children || []).map((id) => getStudent(id)).filter(Boolean) : []

  const isRole = useCallback((...roles) => (user ? roles.includes(user.roleKey) : false), [user])

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      forgotPassword,
      updateProfile,
      linkedStudent,
      linkedParent,
      linkedTeacher,
      children: childRecords,
      childRecords,
      isAuthenticated: Boolean(user),
      isRole,
    }),
    [user, login, logout, forgotPassword, updateProfile, linkedStudent, linkedParent, linkedTeacher, childRecords, isRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
