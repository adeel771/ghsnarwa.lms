export const publicNav = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Academics', to: '/academics' },
  { label: 'Admissions', to: '/admissions' },
  { label: 'Teachers', to: '/teachers' },
  { label: 'Campus Life', to: '/campus-life' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'News', to: '/news' },
  { label: 'Contact', to: '/contact' },
]

const ALL = ['superadmin', 'admin', 'principal', 'teacher', 'student', 'parent', 'accountant', 'librarian']
const ADMIN = ['superadmin', 'admin']
const LEAD = ['superadmin', 'admin', 'principal']
const STAFF = ['superadmin', 'admin', 'principal', 'teacher', 'accountant', 'librarian']

export const dashboardNav = [
  {
    group: 'Overview',
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: 'LayoutDashboard', roles: ALL, end: true },
      { label: 'My Profile', to: '/dashboard/profile', icon: 'UserRound', roles: ALL },
      { label: 'Notifications', to: '/dashboard/notifications', icon: 'Bell', roles: ALL },
    ],
  },
  {
    group: 'People',
    items: [
      { label: 'Students', to: '/dashboard/students', icon: 'Users', roles: [...LEAD, 'teacher', 'librarian', 'accountant'] },
      { label: 'Teachers', to: '/dashboard/teachers', icon: 'GraduationCap', roles: LEAD },
      { label: 'Parents', to: '/dashboard/parents', icon: 'UsersRound', roles: LEAD },
      { label: 'Classes', to: '/dashboard/classes', icon: 'School', roles: [...LEAD, 'teacher'] },
      { label: 'Subjects', to: '/dashboard/subjects', icon: 'BookOpen', roles: [...LEAD, 'teacher'] },
      { label: 'My Children', to: '/dashboard/children', icon: 'Baby', roles: ['parent'] },
      { label: 'Users & Roles', to: '/dashboard/users', icon: 'ShieldCheck', roles: ADMIN },
    ],
  },
  {
    group: 'Academics',
    items: [
      { label: 'Admissions', to: '/dashboard/admissions', icon: 'FileText', roles: LEAD },
      { label: 'Attendance', to: '/dashboard/attendance', icon: 'ClipboardCheck', roles: [...LEAD, 'teacher', 'student', 'parent'] },
      { label: 'Results', to: '/dashboard/results', icon: 'BarChart3', roles: [...LEAD, 'teacher', 'student', 'parent'] },
      { label: 'Report Cards', to: '/dashboard/report-cards', icon: 'FileBadge', roles: [...LEAD, 'teacher', 'student', 'parent'] },
      { label: 'Timetable', to: '/dashboard/timetable', icon: 'CalendarClock', roles: [...LEAD, 'teacher', 'student', 'parent'] },
      { label: 'Assignments', to: '/dashboard/assignments', icon: 'NotebookPen', roles: [...LEAD, 'teacher', 'student'] },
      { label: 'Examinations', to: '/dashboard/exams', icon: 'ClipboardList', roles: [...LEAD, 'teacher', 'student'] },
    ],
  },
  {
    group: 'Finance',
    items: [
      { label: 'Fees & Vouchers', to: '/dashboard/fees', icon: 'Receipt', roles: [...LEAD, 'accountant', 'student', 'parent'] },
      { label: 'Payroll', to: '/dashboard/payroll', icon: 'Banknote', roles: [...LEAD, 'accountant'] },
      { label: 'Expenses', to: '/dashboard/expenses', icon: 'Wallet', roles: [...LEAD, 'accountant'] },
      { label: 'Reports', to: '/dashboard/reports', icon: 'TrendingUp', roles: [...LEAD, 'accountant'] },
    ],
  },
  {
    group: 'Operations',
    items: [
      { label: 'Transport', to: '/dashboard/transport', icon: 'Bus', roles: [...LEAD, 'accountant'] },
      { label: 'Inventory', to: '/dashboard/inventory', icon: 'Package', roles: [...LEAD, 'accountant', 'librarian'] },
      { label: 'Library', to: '/dashboard/library', icon: 'Library', roles: [...LEAD, 'librarian', 'teacher', 'student'] },
      { label: 'Leave Requests', to: '/dashboard/leave', icon: 'CalendarX', roles: [...LEAD, 'teacher', 'student', 'accountant', 'librarian'] },
      { label: 'Complaints', to: '/dashboard/complaints', icon: 'MessageSquareWarning', roles: [...LEAD, 'parent'] },
      { label: 'Parent–Teacher Meetings', to: '/dashboard/ptms', icon: 'Handshake', roles: [...LEAD, 'teacher', 'parent'] },
    ],
  },
  {
    group: 'Records',
    items: [
      { label: 'Calendar', to: '/dashboard/calendar', icon: 'CalendarDays', roles: ALL },
      { label: 'Holidays', to: '/dashboard/holidays', icon: 'CalendarOff', roles: ALL },
      { label: 'Documents', to: '/dashboard/documents', icon: 'FolderOpen', roles: ALL },
      { label: 'ID Cards', to: '/dashboard/id-cards', icon: 'CreditCard', roles: [...LEAD, 'student'] },
      { label: 'Certificates', to: '/dashboard/certificates', icon: 'Award', roles: [...LEAD, 'student'] },
      { label: 'Messages', to: '/dashboard/messages', icon: 'MessageSquare', roles: ALL },
      { label: 'Activity Log', to: '/dashboard/activity', icon: 'History', roles: ADMIN },
    ],
  },
  {
    group: 'System',
    items: [
      { label: 'School Settings', to: '/dashboard/settings', icon: 'Settings', roles: [...ADMIN, 'principal'] },
    ],
  },
]

export const getNavForRole = (role) =>
  dashboardNav
    .map((group) => ({ ...group, items: group.items.filter((item) => item.roles.includes(role)) }))
    .filter((group) => group.items.length > 0)
