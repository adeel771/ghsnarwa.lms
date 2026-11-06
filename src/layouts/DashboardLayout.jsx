import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell, CheckCheck, ChevronRight, LogOut, Menu, Search, Settings, UserRound, X, LayoutDashboard, ShieldCheck,
} from 'lucide-react'
import SchoolLogo from '../components/SchoolLogo'
import Icon from '../components/Icon'
import { SeasonSwitcher, LanguageSwitcher } from '../components/Controls'
import { Avatar, Menu as Dropdown, MenuItem } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { useSeason } from '../context/SeasonContext'
import { getNavForRole } from '../data/navigation'
import { roleLabels } from '../data/mockData'
import { cn } from '../lib/utils'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchFocus, setSearchFocus] = useState(false)
  const { user, logout } = useAuth()
  const { db, markNotificationRead, markAllNotificationsRead } = useData()
  const { season } = useSeason()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const groups = useMemo(() => getNavForRole(user?.roleKey || 'student'), [user?.roleKey])
  const allItems = useMemo(() => groups.flatMap((g) => g.items), [groups])
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return allItems.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 7)
  }, [query, allItems])

  const notifications = db.notifications || []
  const unread = notifications.filter((n) => !n.read).length

  useEffect(() => {
    setSidebarOpen(false)
    setQuery('')
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const go = (to) => {
    setQuery('')
    setSearchFocus(false)
    navigate(to)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar overlay */}
      {sidebarOpen ? (
        <button type="button" aria-label="Close sidebar" className="fixed inset-0 z-40 bg-navy-950/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      ) : null}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="flex h-[70px] shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <SchoolLogo size="sm" />
          <button type="button" onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden" aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        <div className="mx-4 mt-4 shrink-0 rounded-xl bg-gradient-to-br from-navy-900 to-[var(--season-accent)] p-3.5 text-white">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name} size="sm" color="bg-white/20" className="ring-white/30" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user?.name}</p>
              <p className="truncate text-[11px] text-white/70">{roleLabels[user?.roleKey] || user?.role}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-white/15 pt-2 text-[10px] uppercase tracking-wider text-white/60">
            <span>{season} term</span>
            <span>{db.settings?.academicYear}</span>
          </div>
        </div>

        <nav className="mt-3 flex-1 overflow-y-auto px-3 pb-4" aria-label="Dashboard navigation">
          {groups.map((group) => (
            <div key={group.group} className="mb-4">
              <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{group.group}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => cn(
                      'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold transition-all',
                      isActive
                        ? 'bg-navy-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900',
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon name={item.icon} size={16} className={isActive ? 'text-gold-400' : 'text-slate-400 group-hover:text-navy-700'} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {isActive ? <ChevronRight size={13} className="text-white/50" /> : null}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-100 p-3">
          <div className="mb-2 rounded-lg bg-amber-50 px-2.5 py-2 text-[10px] leading-snug text-amber-800 ring-1 ring-amber-200">
            <span className="font-bold">Demo environment.</span> Records are saved in this browser only.
          </div>
          <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-semibold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-[276px]">
        <header className="sticky top-0 z-30 flex h-[70px] items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-lg border border-slate-200 p-2 text-navy-900 lg:hidden" aria-label="Open sidebar">
            <Menu size={19} />
          </button>

          {/* Global search */}
          <div className="relative hidden w-full max-w-xs md:block">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setTimeout(() => setSearchFocus(false), 150)}
              placeholder="Search modules…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-navy-300 focus:bg-white focus:ring-4 focus:ring-navy-100"
              aria-label="Search dashboard modules"
            />
            {searchFocus && query ? (
              <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                {searchResults.length ? searchResults.map((item) => (
                  <button key={item.to} type="button" onMouseDown={() => go(item.to)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-navy-900">
                    <Icon name={item.icon} size={15} className="text-slate-400" /> {item.label}
                  </button>
                )) : <p className="px-3 py-2 text-xs text-slate-400">No matching modules.</p>}
              </div>
            ) : null}
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <SeasonSwitcher compact className="hidden sm:flex" />
            <LanguageSwitcher className="hidden sm:flex" />

            <Dropdown
              trigger={
                <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-navy-900" aria-label="Notifications">
                  <Bell size={18} />
                  {unread > 0 ? <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">{unread}</span> : null}
                </button>
              }
            >
              <div className="flex items-center justify-between px-3 py-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Notifications</p>
                <button type="button" onClick={markAllNotificationsRead} className="flex items-center gap-1 text-[10px] font-bold text-navy-700 hover:underline">
                  <CheckCheck size={12} /> Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <MenuItem key={n.id} onClick={() => { markNotificationRead(n.id); go('/dashboard/notifications') }}>
                    <span className="min-w-0">
                      <span className={cn('block truncate text-[13px]', !n.read && 'font-bold text-navy-900')}>{n.title}</span>
                      <span className="block truncate text-[11px] text-slate-400">{n.message}</span>
                    </span>
                  </MenuItem>
                ))}
                {!notifications.length ? <p className="px-3 py-4 text-xs text-slate-400">You’re all caught up.</p> : null}
              </div>
              <div className="mt-1 border-t border-slate-100 pt-1">
                <MenuItem onClick={() => go('/dashboard/notifications')}>View all notifications</MenuItem>
              </div>
            </Dropdown>

            <Dropdown
              trigger={
                <button type="button" className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition hover:bg-slate-100" aria-label="Account menu">
                  <Avatar name={user?.name} size="sm" color={user?.color || 'bg-navy-700'} />
                  <span className="hidden text-left sm:block">
                    <span className="block max-w-28 truncate text-xs font-bold text-navy-900">{user?.name}</span>
                    <span className="block text-[10px] text-slate-400">{roleLabels[user?.roleKey]}</span>
                  </span>
                </button>
              }
            >
              <MenuItem icon={UserRound} onClick={() => go('/dashboard/profile')}>My profile</MenuItem>
              <MenuItem icon={LayoutDashboard} onClick={() => go('/dashboard')}>Dashboard home</MenuItem>
              {['superadmin', 'admin', 'principal'].includes(user?.roleKey) ? (
                <MenuItem icon={Settings} onClick={() => go('/dashboard/settings')}>School settings</MenuItem>
              ) : null}
              <MenuItem icon={ShieldCheck} onClick={() => go('/')}>View public website</MenuItem>
              <div className="my-1 border-t border-slate-100" />
              <MenuItem icon={LogOut} danger onClick={handleLogout}>Sign out</MenuItem>
            </Dropdown>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 w-full">
          <Outlet />
        </main>

        <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center text-[11px] text-slate-400 sm:px-6">
          Government High School Narwa Bajmore · Digital LMS · {db.settings?.academicYear} · Demo data only
        </footer>
      </div>
    </div>
  )
}
