import { Navigate, Outlet, RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useState, useEffect } from 'react'
import { useData } from '../context/DataContext'
import { dashboardNav } from '../data/navigation'
import { PageHeader, Card, Field, Input, Select, Button } from '../components/ui'
import { Save } from 'lucide-react'
import { roleLabels } from '../data/mockData'

/**
 * Centralized route configuration.
 *
 * - Public routes (Landing + auth) are always accessible.
 * - Protected routes are restricted to roles that "canRead" that module.
 * - A logged-in user who hits a public-only page is redirected to /dashboard.
 * - A logged-out user who hits a protected page is redirected to /login.
 */

// Public page imports
import PublicHome from '../pages/public/Home'
import PublicAbout from '../pages/public/About'
import PublicAcademics from '../pages/public/Academics'
import PublicAdmissions from '../pages/public/Admissions'
import PublicTeachers from '../pages/public/Teachers'
import PublicCampusLife from '../pages/public/CampusLife'
import PublicGallery from '../pages/public/Gallery'
import PublicNews from '../pages/public/News'
import PublicContact from '../pages/public/Contact'

// Auth page imports
import LoginPage from '../pages/auth/Login'
import ForgotPasswordPage from '../pages/auth/ForgotPassword'

// Dashboard layout + pages
import DashboardLayout from '../layouts/DashboardLayout'
import PublicLayout from '../layouts/PublicLayout'
import DashboardHome from '../pages/dashboard/DashboardHome'
import NotificationsPage from '../pages/dashboard/NotificationsPage'
import AttendancePage from '../pages/dashboard/AttendancePage'
import ResultsPage from '../pages/dashboard/ResultsPage'
import ReportCardsPage from '../pages/dashboard/ReportCardsPage'
import TimetablePage from '../pages/dashboard/TimetablePage'
import FeesPage from '../pages/dashboard/FeesPage'
import PayrollPage from '../pages/dashboard/PayrollPage'
import IdCardsPage from '../pages/dashboard/IdCardsPage'
import MessagesPage from '../pages/dashboard/MessagesPage'
import ActivityPage from '../pages/dashboard/ActivityPage'
import SettingsPage from '../pages/dashboard/SettingsPage'
import CalendarPage from '../pages/dashboard/CalendarPage'
import ResourcePage from '../pages/dashboard/ResourcePage'

// Simple profile page for dashboard users
function DashboardProfile() {
  const { user, updateProfile } = useAuth()
  const { db } = useData()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [role, setRole] = useState(user?.role || '')
  const toast = useToast()
  const [saved, setSaved] = useState(false)

  const save = (e) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Name is required') ; return }
    updateProfile({ name: name.trim(), email: email.trim(), role })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <PageHeader
        eyebrow="Profile"
        title="My profile"
        subtitle="Review and update your account details."
        actions={<Button variant="season" icon={Save} onClick={save}>Save changes</Button>}
      />
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-white text-lg font-bold">{user?.initials || 'U'}</span>
          <div>
            <p className="text-sm font-bold text-navy-900">{user?.name}</p>
            <p className="text-xs text-slate-500">{roleLabels[user?.roleKey] || user?.role}</p>
          </div>
        </div>
        <form onSubmit={save} className="space-y-4">
          <Field label="Full name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@ghsnb.edu.pk" />
          </Field>
          <Field label="Role">
            <Select value={role} onChange={(e) => setRole(e.target.value)} options={['Super Admin', 'School Admin', 'Principal', 'Teacher', 'Student', 'Parent', 'Accountant', 'Librarian']} />
          </Field>
          <p className="text-xs text-slate-400">{saved ? 'Profile saved.' : 'Changing your role only takes effect after you sign out and back in.'}</p>
        </form>
      </Card>
    </div>
  )
}

/**
 * Build a map of route path -> allowed roles from dashboardNav.
 */
const moduleRoles = (() => {
  const map = {}
  for (const group of dashboardNav) {
    for (const item of group.items) {
      map[item.to] = item.roles
    }
  }
  return map
})()

const publicOnlyPaths = new Set([
  '/',
  '/home',
  '/about',
  '/academics',
  '/admissions',
  '/teachers',
  '/campus-life',
  '/gallery',
  '/news',
  '/contact',
])

function PrivateRoute({ children }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const allowed = moduleRoles[location.pathname] || moduleRoles['*'] || []
  if (allowed.length > 0 && !allowed.includes(user.roleKey)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

/**
 * Dashboard pages that mirror the generic resource-management component
 * are wrapped here so each route points to a real component. The
 * resource-config system (search, filters, pagination, modal CRUD,
 * export and print) is shared across every management module.
 */
const StudentsResource = () => <ResourcePage configKey="students" />
const TeachersResource = () => <ResourcePage configKey="teachers" />
const ParentsResource = () => <ResourcePage configKey="parents" />
const ChildrenResource = () => <ResourcePage configKey="students" />
const UsersResource = () => <ResourcePage configKey="users" />
const AdmissionsResource = () => <ResourcePage configKey="admissions" />
const AssignmentsResource = () => <ResourcePage configKey="assignments" />
const ExamsResource = () => <ResourcePage configKey="exams" />
const ExpensesResource = () => <ResourcePage configKey="expenses" />
const ReportsResource = () => <ResourcePage configKey="expenses" />
const TransportResource = () => <ResourcePage configKey="transport" />
const InventoryResource = () => <ResourcePage configKey="inventory" />
const LibraryResource = () => <ResourcePage configKey="library" />
const LeaveResource = () => <ResourcePage configKey="leave" />
const ComplaintsResource = () => <ResourcePage configKey="complaints" />
const PtmsResource = () => <ResourcePage configKey="ptms" />
const HolidaysResource = () => <ResourcePage configKey="holidays" />
const DocumentsResource = () => <ResourcePage configKey="documents" />
const CertificatesResource = () => <ResourcePage configKey="certificates" />

const routes = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <PublicHome /> },
      { path: 'about', element: <PublicAbout /> },
      { path: 'academics', element: <PublicAcademics /> },
      { path: 'admissions', element: <PublicAdmissions /> },
      { path: 'teachers', element: <PublicTeachers /> },
      { path: 'campus-life', element: <PublicCampusLife /> },
      { path: 'gallery', element: <PublicGallery /> },
      { path: 'news', element: <PublicNews /> },
      { path: 'contact', element: <PublicContact /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'profile', element: <DashboardProfile /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'students', element: <StudentsResource /> },
      { path: 'teachers', element: <TeachersResource /> },
      { path: 'parents', element: <ParentsResource /> },
      { path: 'children', element: <ChildrenResource /> },
      { path: 'users', element: <UsersResource /> },
      { path: 'admissions', element: <AdmissionsResource /> },
      { path: 'attendance', element: <AttendancePage /> },
      { path: 'results', element: <ResultsPage /> },
      { path: 'report-cards', element: <ReportCardsPage /> },
      { path: 'timetable', element: <TimetablePage /> },
      { path: 'assignments', element: <AssignmentsResource /> },
      { path: 'exams', element: <ExamsResource /> },
      { path: 'fees', element: <FeesPage /> },
      { path: 'payroll', element: <PayrollPage /> },
      { path: 'expenses', element: <ExpensesResource /> },
      { path: 'reports', element: <ReportsResource /> },
      { path: 'transport', element: <TransportResource /> },
      { path: 'inventory', element: <InventoryResource /> },
      { path: 'library', element: <LibraryResource /> },
      { path: 'leave', element: <LeaveResource /> },
      { path: 'complaints', element: <ComplaintsResource /> },
      { path: 'ptms', element: <PtmsResource /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'holidays', element: <HolidaysResource /> },
      { path: 'documents', element: <DocumentsResource /> },
      { path: 'id-cards', element: <IdCardsPage /> },
      { path: 'certificates', element: <CertificatesResource /> },
      { path: 'messages', element: <MessagesPage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]

export const router = createBrowserRouter(routes)

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
