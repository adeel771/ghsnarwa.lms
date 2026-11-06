import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { seedData } from '../data/mockData'
import { resourceConfigs } from '../data/resourceConfigs'
import { uid } from '../lib/utils'

const STORAGE_KEY = 'ghsnb_db_v3'
const DataContext = createContext(null)

const clone = (value) => JSON.parse(JSON.stringify(value))

const loadDb = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return clone(seedData)
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.students)) return clone(seedData)
    return {
      ...clone(seedData),
      ...parsed,
      settings: { ...seedData.settings, ...(parsed.settings || {}) },
    }
  } catch {
    return clone(seedData)
  }
}

export function DataProvider({ children }) {
  const [db, setDb] = useState(loadDb)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
    } catch {
      /* storage full or unavailable */
    }
  }, [db])

  const list = useCallback((key) => db[key] || [], [db])

  const logActivity = useCallback((action, module) => {
    let actor = { name: 'System', role: 'System' }
    try {
      const session = JSON.parse(window.localStorage.getItem('ghsnb_session') || 'null')
      if (session?.name) actor = session
    } catch {
      /* ignore */
    }
    const entry = {
      id: uid('LOG'),
      user: actor.name,
      role: actor.role,
      action,
      module,
      date: new Date().toLocaleString('en-GB'),
      ip: '192.168.1.10',
    }
    setDb((prev) => ({ ...prev, activity: [entry, ...(prev.activity || [])] }))
  }, [])

  const create = useCallback(
    (key, item) => {
      const config = resourceConfigs[key]
      const record = { id: item.id || uid(config?.idPrefix || key.slice(0, 3).toUpperCase()), ...item }
      setDb((prev) => ({ ...prev, [key]: [record, ...(prev[key] || [])] }))
      logActivity(`Created a new record in ${config?.title || key}`, config?.title || key)
      return record
    },
    [logActivity],
  )

  const update = useCallback(
    (key, id, patch) => {
      const config = resourceConfigs[key]
      setDb((prev) => ({
        ...prev,
        [key]: (prev[key] || []).map((row) => (row.id === id ? { ...row, ...patch } : row)),
      }))
      logActivity(`Updated a record in ${config?.title || key}`, config?.title || key)
    },
    [logActivity],
  )

  const remove = useCallback(
    (key, id) => {
      const config = resourceConfigs[key]
      setDb((prev) => ({ ...prev, [key]: (prev[key] || []).filter((row) => row.id !== id) }))
      logActivity(`Deleted a record from ${config?.title || key}`, config?.title || key)
    },
    [logActivity],
  )

  const bulkUpsert = useCallback(
    (key, records) => {
      setDb((prev) => {
        const map = new Map((prev[key] || []).map((row) => [row.id, row]))
        records.forEach((record) => {
          map.set(record.id, { ...(map.get(record.id) || {}), ...record })
        })
        return { ...prev, [key]: Array.from(map.values()) }
      })
      logActivity(`Saved ${records.length} records in ${resourceConfigs[key]?.title || key}`, resourceConfigs[key]?.title || key)
    },
    [logActivity],
  )

  const updateSettings = useCallback((patch) => {
    setDb((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }))
  }, [])

  const setTimetable = useCallback((next) => {
    setDb((prev) => ({ ...prev, timetable: next }))
    logActivity('Updated the class timetable', 'Timetable')
  }, [logActivity])

  const markNotificationRead = useCallback((id) => {
    setDb((prev) => ({
      ...prev,
      notifications: (prev.notifications || []).map((n) => (n.id === id ? { ...n, read: true } : n)),
    }))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setDb((prev) => ({
      ...prev,
      notifications: (prev.notifications || []).map((n) => ({ ...n, read: true })),
    }))
  }, [])

  const addNotification = useCallback((notification) => {
    setDb((prev) => ({
      ...prev,
      notifications: [{ id: uid('NTF'), read: false, date: new Date().toISOString().slice(0, 10), ...notification }, ...(prev.notifications || [])],
    }))
  }, [])

  const resetDemo = useCallback(() => {
    setDb(clone(seedData))
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const getStudent = useCallback((id) => (db.students || []).find((s) => s.id === id), [db.students])
  const getTeacher = useCallback((id) => (db.teachers || []).find((t) => t.id === id), [db.teachers])
  const getParent = useCallback((id) => (db.parents || []).find((p) => p.id === id), [db.parents])

  const value = useMemo(
    () => ({
      db,
      list,
      create,
      update,
      remove,
      bulkUpsert,
      updateSettings,
      setTimetable,
      markNotificationRead,
      markAllNotificationsRead,
      addNotification,
      resetDemo,
      logActivity,
      getStudent,
      getTeacher,
      getParent,
      settings: db.settings,
    }),
    [db, list, create, update, remove, bulkUpsert, updateSettings, setTimetable, markNotificationRead, markAllNotificationsRead, addNotification, resetDemo, logActivity, getStudent, getTeacher, getParent],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
