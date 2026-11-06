# School Management System (GHS Narwa Bajmore LMS)

A modern Learning Management System for Government High School Narwa Bajmore, Shohal Mazullah Khan, Balakot, Khyber Pakhtunkhwa. Built with React 19, Tailwind CSS v4, and Vite.

## Features

- **Public Portal:** Home, About, Academics, Admissions, Teachers, Campus Life, Gallery, News, and Contact pages.
- **Season Theming:** Auto switches between Winter and Summer themes based on current month, with manual override option.
- **Bilingual:** Full English & Urdu language support with RTL layout.
- **Role-Based Authentication:** Complete demo logins for 8 roles (Super Admin, School Admin, Principal, Teacher, Student, Parent, Accountant, Librarian).
- **Dashboard Modules:**
  - Attendance management & marking
  - Results & report cards generator
  - Timetable view & edit
  - Fees & vouchers with print receipts
  - Payroll, expenses & reports
  - ID cards & character/merit certificates
  - Student, Teacher, Parent & Class records
  - Transport, Inventory, and Library catalogs
  - Leave requests & complaints tracking
  - Parent-Teacher Meetings (PTM) scheduler
  - School calendar, events & holidays
  - System activity logging & school settings

## Teacher Records

Teacher records ship as empty, configurable placeholders. Add real staff names, subjects, qualifications, contact details and photographs through **Dashboard → Teachers & Staff** when they become available. Until then, teacher identity fields display “Teacher information will be updated soon”.

## Quick Start (Run Locally)

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
npm run preview
```

## Demo Accounts

All demo accounts use password: `demo1234`

| Role | Email |
|------|-------|
| Super Admin | `superadmin@ghsnb.edu.pk` |
| School Admin | `admin@ghsnb.edu.pk` |
| Principal | `principal@ghsnb.edu.pk` |
| Teacher | `teacher@ghsnb.edu.pk` |
| Student | `student@ghsnb.edu.pk` |
| Parent | `parent@ghsnb.edu.pk` |
| Accountant | `accountant@ghsnb.edu.pk` |
| Librarian | `librarian@ghsnb.edu.pk` |
