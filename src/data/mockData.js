// ---------------------------------------------------------------------------
// Demo dataset for Government High School Narwa Bajmore, Balakot, Khyber
// Pakhtunkhwa. Everything here is fictional but modelled on a real Pakistani
// government high school. All records persist to localStorage.
//
// Teacher records are intentionally left empty and configurable. Real staff
// details and photographs can be added later through the Teachers module.
// ---------------------------------------------------------------------------

export const teacherInfoPlaceholder = 'Teacher information will be updated soon'
export const displayTeacher = (value) => (value && String(value).trim() ? value : teacherInfoPlaceholder)

export const school = {
  name: 'Government High School Narwa Bajmore',
  shortName: 'GHS Narwa Bajmore',
  initials: 'GHSNB',
  tagline: 'Knowledge, Character, Service',
  taglineUrdu: 'علم، کردار، خدمت',
  address: 'Shohal Mazullah Khan, Balakot, Khyber Pakhtunkhwa, Pakistan',
  village: 'Narwa Bajmore',
  locality: 'Shohal Mazullah Khan',
  city: 'Balakot',
  district: 'Mansehra',
  province: 'Khyber Pakhtunkhwa',
  country: 'Pakistan',
  board: 'BISE Abbottabad',
  registration: 'Elementary & Secondary Education Department, Khyber Pakhtunkhwa',
  established: 1984,
  academicYear: '2026–27',
  principal: '',
  vicePrincipal: '',
  phone: '+92 997 530 200',
  phone2: '+92 300 8456 210',
  email: 'info@ghsnb.edu.pk',
  admissionsEmail: 'admissions@ghsnb.edu.pk',
  timingsSummer: 'Monday–Saturday · 7:45 am – 1:45 pm',
  timingsWinter: 'Monday–Saturday · 8:30 am – 1:30 pm',
  motto: 'Knowledge, Character, Service',
  mottoUrdu: 'علم، کردار، خدمت',
  affiliation: 'Affiliated with BISE Abbottabad · SSC (Matriculation) · Grades 1–10',
  mapQuery: 'Government High School Narwa Bajmore, Shohal Mazullah Khan, Balakot, Mansehra, Khyber Pakhtunkhwa',
}

export const demoAccounts = [
  { email: 'superadmin@ghsnb.edu.pk', password: 'demo1234', role: 'Super Admin', name: 'Super Admin', initials: 'SA', linkedId: null, color: 'bg-purple-600' },
  { email: 'admin@ghsnb.edu.pk', password: 'demo1234', role: 'School Admin', name: 'School Admin', initials: 'SA', linkedId: null, color: 'bg-navy-700' },
  { email: 'principal@ghsnb.edu.pk', password: 'demo1234', role: 'Principal', name: 'Principal', initials: 'PR', linkedId: null, color: 'bg-gov-700' },
  { email: 'teacher@ghsnb.edu.pk', password: 'demo1234', role: 'Teacher', name: teacherInfoPlaceholder, initials: 'TC', linkedId: 'TCH-001', color: 'bg-sky-700' },
  { email: 'student@ghsnb.edu.pk', password: 'demo1234', role: 'Student', name: 'Ahmad Raza', initials: 'AR', linkedId: 'STU-001', color: 'bg-emerald-700' },
  { email: 'parent@ghsnb.edu.pk', password: 'demo1234', role: 'Parent', name: 'Muhammad Aslam', initials: 'MA', linkedId: 'PAR-001', color: 'bg-amber-700' },
  { email: 'accountant@ghsnb.edu.pk', password: 'demo1234', role: 'Accountant', name: 'Accounts Office', initials: 'AO', linkedId: null, color: 'bg-teal-700' },
  { email: 'librarian@ghsnb.edu.pk', password: 'demo1234', role: 'Librarian', name: 'Library Office', initials: 'LO', linkedId: null, color: 'bg-rose-700' },
]

export const roleLabels = {
  superadmin: 'Super Admin',
  admin: 'School Admin',
  principal: 'Principal',
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
  accountant: 'Accountant',
  librarian: 'Librarian',
}

export const roleKeys = {
  'Super Admin': 'superadmin',
  'School Admin': 'admin',
  Principal: 'principal',
  Teacher: 'teacher',
  Student: 'student',
  Parent: 'parent',
  Accountant: 'accountant',
  Librarian: 'librarian',
}

const boys = [
  'Ahmad Raza', 'Hassan Ali', 'Muhammad Usman', 'Ali Hamza', 'Abdullah Khan', 'Bilal Hussain',
  'Zain Abbas', 'Hamza Tariq', 'Faizan Ahmed', 'Umar Farooq', 'Saad Iqbal', 'Talha Mahmood',
]
const girls = [
  'Fatima Noor', 'Ayesha Bibi', 'Hira Shahzad', 'Mahnoor Fatima', 'Zainab Akram', 'Maryam Riaz',
  'Sana Javed', 'Iqra Aslam', 'Rabia Nawaz', 'Laiba Khan', 'Areeba Malik', 'Noor ul Ain',
]
const fathers = [
  'Muhammad Aslam', 'Ghulam Rasool', 'Tariq Mahmood', 'Nadeem Akhtar', 'Riaz Hussain', 'Shahid Mehmood',
  'Akram Ali', 'Javed Iqbal', 'Nawaz Ahmed', 'Khalid Pervez', 'Iftikhar Ahmad', 'Sajjad Haider',
]
const houses = ['Iqbal', 'Jinnah', 'Sir Syed', 'Quaid']
const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'O-']

const pick = (arr, i) => arr[i % arr.length]
const pad = (n, size = 3) => String(n).padStart(size, '0')
const rand = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

const gradeFor = (n) => (n <= 5 ? 'Primary' : n <= 8 ? 'Middle' : 'High')

const localAreas = ['Narwa Bajmore', 'Shohal Mazullah Khan', 'Bajmore', 'Kaghan Road', 'Balakot']

export const students = Array.from({ length: 24 }, (_, i) => {
  const isGirl = i % 2 === 1
  const grade = i < 8 ? 10 : i < 16 ? 9 : i < 20 ? 8 : 6
  const name = isGirl ? pick(girls, i) : pick(boys, i)
  const section = i % 3 === 0 ? 'B' : 'A'
  const attendance = 82 + Math.floor(rand(i + 1) * 17)
  return {
    id: `STU-${pad(i + 1)}`,
    name,
    fatherName: pick(fathers, i + 3),
    gender: isGirl ? 'Female' : 'Male',
    grade: String(grade),
    section,
    rollNo: `${grade}${section}-${pad(i + 1, 2)}`,
    admissionNo: `GHSNB-2026-${pad(i + 1)}`,
    bForm: `13301-${2010 + (i % 6)}-${pad(1000000 + i * 731, 7)}-${(i % 9) + 1}`,
    dob: `${2010 + (i % 6)}-${pad((i % 12) + 1, 2)}-${pad((i % 27) + 1, 2)}`,
    group: grade >= 9 ? (i % 4 === 0 ? 'Arts' : 'Science') : 'General',
    phone: `+92 3${(i % 4) + 1}0 ${pad(1000000 + i * 12345, 7)}`,
    guardian: pick(fathers, i + 3),
    address: `House ${12 + i}, Street ${3 + (i % 9)}, ${pick(localAreas, i)}, Balakot, Mansehra`,
    house: pick(houses, i),
    bloodGroup: pick(bloodGroups, i),
    status: 'Active',
    feeStatus: i % 5 === 0 ? 'Unpaid' : 'Paid',
    attendance,
    email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@student.ghsnb.edu.pk`,
    admissionDate: `202${i % 4 === 0 ? 2 : 4}-04-${pad((i % 20) + 1, 2)}`,
    level: gradeFor(grade),
  }
})

// Make the demo student's record pristine and predictable.
Object.assign(students[0], {
  name: 'Ahmad Raza',
  fatherName: 'Muhammad Aslam',
  gender: 'Male',
  grade: '10',
  section: 'A',
  rollNo: '10A-01',
  admissionNo: 'GHSNB-2026-001',
  group: 'Science',
  phone: '+92 300 8456 210',
  guardian: 'Muhammad Aslam',
  house: 'Iqbal',
  attendance: 94,
  feeStatus: 'Paid',
  email: 'ahmad.raza@student.ghsnb.edu.pk',
})

// Teacher records are deliberately empty placeholders. Add real staff names,
// subjects, qualifications, contact details and photographs through the
// Teachers dashboard module when they become available.
export const teachers = Array.from({ length: 12 }, (_, i) => ({
  id: `TCH-${pad(i + 1)}`,
  name: '',
  designation: '',
  subject: '',
  qualification: '',
  phone: '',
  email: '',
  gender: '',
  joiningDate: '',
  status: 'Pending',
  classes: '',
  experience: '',
  photo: null,
  cnic: '',
}))

export const parents = [
  { id: 'PAR-001', name: 'Muhammad Aslam', relation: 'Father', cnic: '13301-1978-1234567-1', phone: '+92 300 8456 210', email: 'parent@ghsnb.edu.pk', occupation: 'Government Service', address: 'House 12, Street 3, Narwa Bajmore, Balakot', children: ['STU-001', 'STU-013'], status: 'Active' },
  { id: 'PAR-002', name: 'Ghulam Rasool', relation: 'Father', cnic: '13301-1975-2345678-2', phone: '+92 321 5566 778', email: 'g.rasool@gmail.com', occupation: 'Shopkeeper', address: 'House 44, Street 8, Shohal Mazullah Khan, Balakot', children: ['STU-003', 'STU-015'], status: 'Active' },
  { id: 'PAR-003', name: 'Shazia Bibi', relation: 'Mother', cnic: '13302-1982-3456789-3', phone: '+92 333 6677 889', email: 'shazia.b@gmail.com', occupation: 'Teacher', address: 'House 7, Street 11, Bajmore, Balakot', children: ['STU-002', 'STU-004'], status: 'Active' },
  { id: 'PAR-004', name: 'Tariq Mahmood', relation: 'Father', cnic: '13301-1980-4567890-4', phone: '+92 345 7788 990', email: 'tariq.m@gmail.com', occupation: 'Businessman', address: 'House 90, Street 2, Kaghan Road, Balakot', children: ['STU-005'], status: 'Active' },
]

export const classes = [
  { id: 'CLS-01', name: 'Grade 1', section: 'A', level: 'Primary', classTeacher: '', room: 'R-101', students: 38, group: 'General', shift: 'Morning' },
  { id: 'CLS-02', name: 'Grade 2', section: 'A', level: 'Primary', classTeacher: '', room: 'R-102', students: 36, group: 'General', shift: 'Morning' },
  { id: 'CLS-03', name: 'Grade 3', section: 'A', level: 'Primary', classTeacher: '', room: 'R-103', students: 40, group: 'General', shift: 'Morning' },
  { id: 'CLS-04', name: 'Grade 4', section: 'A', level: 'Primary', classTeacher: '', room: 'R-104', students: 35, group: 'General', shift: 'Morning' },
  { id: 'CLS-05', name: 'Grade 5', section: 'A', level: 'Primary', classTeacher: '', room: 'R-105', students: 39, group: 'General', shift: 'Morning' },
  { id: 'CLS-06', name: 'Grade 6', section: 'A', level: 'Middle', classTeacher: '', room: 'R-201', students: 42, group: 'General', shift: 'Morning' },
  { id: 'CLS-07', name: 'Grade 7', section: 'A', level: 'Middle', classTeacher: '', room: 'R-202', students: 41, group: 'General', shift: 'Morning' },
  { id: 'CLS-08', name: 'Grade 8', section: 'A', level: 'Middle', classTeacher: '', room: 'R-203', students: 44, group: 'General', shift: 'Morning' },
  { id: 'CLS-09', name: 'Grade 9', section: 'A', level: 'High', classTeacher: '', room: 'R-301', students: 45, group: 'Science', shift: 'Morning' },
  { id: 'CLS-10', name: 'Grade 10', section: 'A', level: 'High', classTeacher: '', room: 'R-302', students: 46, group: 'Science', shift: 'Morning' },
  { id: 'CLS-11', name: 'Grade 9', section: 'B', level: 'High', classTeacher: '', room: 'R-303', students: 43, group: 'Arts', shift: 'Morning' },
  { id: 'CLS-12', name: 'Grade 10', section: 'B', level: 'High', classTeacher: '', room: 'R-304', students: 41, group: 'Arts', shift: 'Morning' },
]

export const subjects = [
  { id: 'SUB-01', code: 'ENG', name: 'English', urdu: 'انگریزی', classes: '1–10', teacher: '', type: 'Compulsory', group: 'All', periods: 6 },
  { id: 'SUB-02', code: 'URD', name: 'Urdu', urdu: 'اردو', classes: '1–10', teacher: '', type: 'Compulsory', group: 'All', periods: 6 },
  { id: 'SUB-03', code: 'MATH', name: 'Mathematics', urdu: 'ریاضی', classes: '1–10', teacher: '', type: 'Compulsory', group: 'All', periods: 6 },
  { id: 'SUB-04', code: 'ISL', name: 'Islamiyat', urdu: 'اسلامیات', classes: '1–10', teacher: '', type: 'Compulsory', group: 'All', periods: 4 },
  { id: 'SUB-05', code: 'PST', name: 'Pakistan Studies', urdu: 'مطالعہ پاکستان', classes: '6–10', teacher: '', type: 'Compulsory', group: 'All', periods: 3 },
  { id: 'SUB-06', code: 'PHY', name: 'Physics', urdu: 'طبیعیات', classes: '9–10', teacher: '', type: 'Elective', group: 'Science', periods: 5 },
  { id: 'SUB-07', code: 'CHEM', name: 'Chemistry', urdu: 'کیمیا', classes: '9–10', teacher: '', type: 'Elective', group: 'Science', periods: 5 },
  { id: 'SUB-08', code: 'BIO', name: 'Biology', urdu: 'حیاتیات', classes: '9–10', teacher: '', type: 'Elective', group: 'Science', periods: 4 },
  { id: 'SUB-09', code: 'CS', name: 'Computer Science', urdu: 'کمپیوٹر سائنس', classes: '6–10', teacher: '', type: 'Elective', group: 'Science', periods: 4 },
  { id: 'SUB-10', code: 'GSC', name: 'General Science', urdu: 'جنرل سائنس', classes: '1–8', teacher: '', type: 'Compulsory', group: 'All', periods: 4 },
  { id: 'SUB-11', code: 'ART', name: 'Art & Design', urdu: 'فن و ڈیزائن', classes: '1–8', teacher: '', type: 'Elective', group: 'All', periods: 2 },
  { id: 'SUB-12', code: 'PE', name: 'Physical Education', urdu: 'جسمانی تعلیم', classes: '1–10', teacher: '', type: 'Compulsory', group: 'All', periods: 2 },
]

const feeForGrade = (grade) => (grade <= 5 ? 1500 : grade <= 8 ? 2000 : 2500)
const months = ['August', 'September', 'October', 'November']

export const fees = students.flatMap((s, si) =>
  months.map((month, mi) => {
    const paid = mi < 3 ? si % 7 !== 0 : si % 3 === 0
    return {
      id: `FEE-${pad(si * 4 + mi + 1)}`,
      voucherNo: `V-2026-${pad(1000 + si * 4 + mi)}`,
      studentId: s.id,
      studentName: s.name,
      grade: `${s.grade}-${s.section}`,
      month,
      amount: feeForGrade(Number(s.grade)),
      fine: !paid && mi === 3 && si % 5 === 0 ? 200 : 0,
      discount: s.house === 'Quaid' ? 200 : 0,
      status: paid ? 'Paid' : mi === 3 ? 'Unpaid' : 'Overdue',
      dueDate: `2026-${pad(8 + mi, 2)}-10`,
      paidDate: paid ? `2026-${pad(8 + mi, 2)}-${pad((si % 8) + 2, 2)}` : '',
      method: paid ? ['Cash', 'Bank Transfer', 'EasyPaisa', 'JazzCash'][si % 4] : '',
      receivedBy: paid ? 'Accounts Office' : '',
    }
  }),
)

const resultSubjects = [
  { name: 'English', code: 'ENG' },
  { name: 'Urdu', code: 'URD' },
  { name: 'Mathematics', code: 'MATH' },
  { name: 'Physics', code: 'PHY' },
  { name: 'Chemistry', code: 'CHEM' },
  { name: 'Biology', code: 'BIO' },
  { name: 'Islamiyat', code: 'ISL' },
  { name: 'Pakistan Studies', code: 'PST' },
]

export const results = students.flatMap((s, si) =>
  resultSubjects.map((sub, bi) => {
    const base = si === 0 ? 78 + Math.floor(rand(bi + 2) * 20) : 42 + Math.floor(rand(si * 10 + bi) * 55)
    const obtained = Math.min(100, base)
    return {
      id: `RES-${pad(si * 8 + bi + 1)}`,
      studentId: s.id,
      studentName: s.name,
      grade: `${s.grade}-${s.section}`,
      term: 'First Term',
      subject: sub.name,
      code: sub.code,
      total: 100,
      obtained,
      gradeLetter: obtained >= 90 ? 'A+' : obtained >= 80 ? 'A' : obtained >= 70 ? 'B' : obtained >= 60 ? 'C' : obtained >= 50 ? 'D' : obtained >= 40 ? 'E' : 'F',
      teacher: subjects.find((x) => x.code === sub.code)?.teacher || teacherInfoPlaceholder,
      examDate: '2026-10-12',
    }
  }),
)

export const attendance = (() => {
  const rows = []
  const start = new Date(2026, 9, 1)
  for (let d = 0; d < 31; d += 1) {
    const date = new Date(start)
    date.setDate(start.getDate() + d)
    if (date.getDay() === 0) continue
    const iso = date.toISOString().slice(0, 10)
    students.forEach((s, si) => {
      const r = rand(si * 31 + d)
      const status = r > 0.93 ? 'Absent' : r > 0.88 ? 'Late' : r > 0.84 ? 'Leave' : 'Present'
      rows.push({
        id: `ATT-${iso}-${s.id}`,
        date: iso,
        studentId: s.id,
        studentName: s.name,
        grade: `${s.grade}-${s.section}`,
        classId: `G${s.grade}-${s.section}`,
        status,
        markedBy: teacherInfoPlaceholder,
        remark: status === 'Leave' ? 'Approved family leave' : '',
      })
    })
  }
  return rows
})()

export const payroll = teachers.map((t, i) => {
  const basic = 45000 + i * 3200
  const allowances = Math.round(basic * 0.22)
  const deductions = Math.round(basic * 0.07)
  return {
    id: `PAY-${pad(i + 1)}`,
    employeeId: t.id,
    name: displayTeacher(t.name),
    designation: '',
    basic,
    allowances,
    deductions,
    net: basic + allowances - deductions,
    month: 'October 2026',
    status: i % 6 === 0 ? 'Pending' : 'Paid',
    paidDate: i % 6 === 0 ? '' : '2026-10-31',
    method: 'Bank Transfer',
    bank: 'Bank of Khyber',
    account: `PK36BOKH${pad(1000000000 + i * 9137, 10)}`,
  }
})

export const transport = [
  { id: 'TRN-01', routeName: 'Balakot – Narwa Bajmore', driver: 'Rashid Ali', vehicleNo: 'KPK-4471', capacity: 42, students: 36, stops: 'Balakot, Narwa Bajmore, Shohal Mazullah Khan', fee: 1800, status: 'Active', contact: '+92 300 7788 112' },
  { id: 'TRN-02', routeName: 'Shohal Mazullah Khan – Bajmore', driver: 'Nadeem Akhtar', vehicleNo: 'KPK-8820', capacity: 42, students: 39, stops: 'Shohal Mazullah Khan, Bajmore, Kaghan Road', fee: 2000, status: 'Active', contact: '+92 321 6655 443' },
  { id: 'TRN-03', routeName: 'Balakot – Kaghan Road', driver: 'Ghulam Mustafa', vehicleNo: 'KPK-1190', capacity: 30, students: 24, stops: 'Balakot, Kaghan Road, Shohal Mazullah Khan', fee: 2200, status: 'Active', contact: '+92 333 2211 009' },
  { id: 'TRN-04', routeName: 'Mansehra – Balakot', driver: 'Ijaz Ahmed', vehicleNo: 'KPK-3355', capacity: 42, students: 31, stops: 'Mansehra, Balakot, Narwa Bajmore', fee: 1700, status: 'Maintenance', contact: '+92 345 9988 776' },
]

export const inventory = [
  { id: 'INV-001', item: 'Student Desk (single)', category: 'Furniture', quantity: 420, unit: 'pcs', condition: 'Good', location: 'All classrooms', purchaseDate: '2024-06-12', value: 1260000, status: 'In Use' },
  { id: 'INV-002', item: 'Teacher Chair', category: 'Furniture', quantity: 48, unit: 'pcs', condition: 'Good', location: 'Staff rooms', purchaseDate: '2024-06-12', value: 216000, status: 'In Use' },
  { id: 'INV-003', item: 'Dell OptiPlex Desktop', category: 'IT Equipment', quantity: 40, unit: 'pcs', condition: 'Good', location: 'ICT Lab', purchaseDate: '2025-01-20', value: 3200000, status: 'In Use' },
  { id: 'INV-004', item: 'Epson Projector', category: 'IT Equipment', quantity: 6, unit: 'pcs', condition: 'Fair', location: 'Smart classrooms', purchaseDate: '2023-09-05', value: 540000, status: 'In Use' },
  { id: 'INV-005', item: 'Microscope (binocular)', category: 'Laboratory', quantity: 18, unit: 'pcs', condition: 'Good', location: 'Biology Lab', purchaseDate: '2025-03-14', value: 810000, status: 'In Use' },
  { id: 'INV-006', item: 'Chemistry Glassware Set', category: 'Laboratory', quantity: 60, unit: 'sets', condition: 'Good', location: 'Chemistry Lab', purchaseDate: '2025-03-14', value: 240000, status: 'In Use' },
  { id: 'INV-007', item: 'Cricket Kit', category: 'Sports', quantity: 8, unit: 'sets', condition: 'Fair', location: 'Sports Store', purchaseDate: '2024-11-02', value: 96000, status: 'In Use' },
  { id: 'INV-008', item: 'Whiteboard Marker (box)', category: 'Consumables', quantity: 25, unit: 'boxes', condition: 'New', location: 'Store Room', purchaseDate: '2026-08-01', value: 37500, status: 'In Stock' },
  { id: 'INV-009', item: 'First Aid Kit', category: 'Medical', quantity: 12, unit: 'kits', condition: 'Good', location: 'Health Room', purchaseDate: '2026-02-18', value: 48000, status: 'In Use' },
  { id: 'INV-010', item: 'Library Bookshelf', category: 'Furniture', quantity: 24, unit: 'pcs', condition: 'Good', location: 'Library', purchaseDate: '2022-07-11', value: 360000, status: 'In Use' },
]

export const leaveRequests = [
  { id: 'LV-001', applicant: teacherInfoPlaceholder, role: 'Teacher', type: 'Casual Leave', from: '2026-11-09', to: '2026-11-10', days: 2, reason: 'Family wedding in Mansehra.', status: 'Pending', appliedOn: '2026-10-30' },
  { id: 'LV-002', applicant: 'Ahmad Raza', role: 'Student', type: 'Medical Leave', from: '2026-10-22', to: '2026-10-23', days: 2, reason: 'Dengue fever — doctor advised rest.', status: 'Approved', appliedOn: '2026-10-21' },
  { id: 'LV-003', applicant: teacherInfoPlaceholder, role: 'Teacher', type: 'Sick Leave', from: '2026-11-02', to: '2026-11-04', days: 3, reason: 'Medical treatment at the district hospital.', status: 'Pending', appliedOn: '2026-10-31' },
  { id: 'LV-004', applicant: 'Fatima Noor', role: 'Student', type: 'Casual Leave', from: '2026-10-15', to: '2026-10-15', days: 1, reason: 'Family appointment in Abbottabad.', status: 'Approved', appliedOn: '2026-10-14' },
  { id: 'LV-005', applicant: 'Accounts Office', role: 'Accountant', type: 'Annual Leave', from: '2026-11-20', to: '2026-11-24', days: 5, reason: 'Annual family vacation.', status: 'Rejected', appliedOn: '2026-10-25' },
  { id: 'LV-006', applicant: 'Library Office', role: 'Librarian', type: 'Casual Leave', from: '2026-11-12', to: '2026-11-12', days: 1, reason: 'Personal errand.', status: 'Pending', appliedOn: '2026-11-01' },
]

export const complaints = [
  { id: 'CMP-001', ticket: 'TKT-2026-041', submittedBy: 'Muhammad Aslam', role: 'Parent', category: 'Transport', subject: 'Bus arriving late on the Balakot route', description: 'The bus has been arriving 20–25 minutes late for the past week. Please review the route timing.', status: 'In Progress', priority: 'High', date: '2026-10-29', assignedTo: 'Transport Office' },
  { id: 'CMP-002', ticket: 'TKT-2026-042', submittedBy: 'Ahmad Raza', role: 'Student', category: 'Facilities', subject: 'Water cooler not working in R-302', description: 'The water cooler outside Grade 10-A has not been working since Monday.', status: 'Resolved', priority: 'Medium', date: '2026-10-27', assignedTo: 'Admin Office' },
  { id: 'CMP-003', ticket: 'TKT-2026-043', submittedBy: 'Shazia Bibi', role: 'Parent', category: 'Academics', subject: 'Request for extra mathematics support', description: 'My daughter needs additional help with algebra before the board exams.', status: 'Open', priority: 'Medium', date: '2026-10-31', assignedTo: 'Mathematics Department' },
  { id: 'CMP-004', ticket: 'TKT-2026-044', submittedBy: teacherInfoPlaceholder, role: 'Teacher', category: 'IT', subject: 'Projector in R-201 flickering', description: 'The projector display flickers during lessons. Requesting replacement.', status: 'In Progress', priority: 'Low', date: '2026-10-30', assignedTo: 'IT Department' },
]

export const ptms = [
  { id: 'PTM-001', date: '2026-11-14', time: '09:00', class: '10-A', teacher: teacherInfoPlaceholder, parent: 'Muhammad Aslam', student: 'Ahmad Raza', status: 'Scheduled', mode: 'In Person', notes: 'Discuss mathematics progress and board exam preparation.' },
  { id: 'PTM-002', date: '2026-11-14', time: '09:30', class: '8-A', teacher: teacherInfoPlaceholder, parent: 'Muhammad Aslam', student: 'Fatima Noor', status: 'Scheduled', mode: 'In Person', notes: 'English reading comprehension.' },
  { id: 'PTM-003', date: '2026-11-14', time: '10:00', class: '10-A', teacher: teacherInfoPlaceholder, parent: 'Shazia Bibi', student: 'Hassan Ali', status: 'Completed', mode: 'In Person', notes: 'Physics lab performance improved.' },
  { id: 'PTM-004', date: '2026-11-14', time: '10:30', class: '9-B', teacher: teacherInfoPlaceholder, parent: 'Tariq Mahmood', student: 'Ali Hamza', status: 'Scheduled', mode: 'Online', notes: 'Pakistan Studies assignment completion.' },
  { id: 'PTM-005', date: '2026-11-14', time: '11:00', class: '6-A', teacher: teacherInfoPlaceholder, parent: 'Ghulam Rasool', student: 'Zainab Akram', status: 'Cancelled', mode: 'In Person', notes: 'Parent requested reschedule.' },
]

export const documents = [
  { id: 'DOC-001', title: 'School Prospectus 2026–27', category: 'Admissions', uploadedBy: 'Admissions Office', date: '2026-09-01', size: '2.4 MB', visibility: 'Public', format: 'PDF' },
  { id: 'DOC-002', title: 'First Term Date Sheet', category: 'Examinations', uploadedBy: 'Academic Office', date: '2026-10-01', size: '480 KB', visibility: 'Students & Parents', format: 'PDF' },
  { id: 'DOC-003', title: 'Winter Uniform Policy', category: 'Notices', uploadedBy: 'Principal’s Office', date: '2026-10-28', size: '210 KB', visibility: 'Public', format: 'PDF' },
  { id: 'DOC-004', title: 'Fee Structure 2026–27', category: 'Finance', uploadedBy: 'Accounts Office', date: '2026-08-05', size: '320 KB', visibility: 'Public', format: 'PDF' },
  { id: 'DOC-005', title: 'Parent–Teacher Meeting Guidelines', category: 'Academics', uploadedBy: 'Academic Office', date: '2026-10-20', size: '150 KB', visibility: 'Parents', format: 'PDF' },
  { id: 'DOC-006', title: 'Annual Sports Day Results', category: 'Sports', uploadedBy: 'Sports Department', date: '2026-10-09', size: '1.1 MB', visibility: 'Public', format: 'PDF' },
  { id: 'DOC-007', title: 'Staff Leave Policy', category: 'HR', uploadedBy: 'Admin Office', date: '2026-07-15', size: '390 KB', visibility: 'Staff', format: 'PDF' },
  { id: 'DOC-008', title: 'Board Examination Past Papers (2021–2025)', category: 'Examinations', uploadedBy: 'Examination Cell', date: '2026-09-12', size: '18.6 MB', visibility: 'Students', format: 'ZIP' },
]

export const holidays = [
  { id: 'HOL-01', title: 'Iqbal Day', date: '2026-11-09', type: 'National', description: 'Birthday of Allama Muhammad Iqbal.' },
  { id: 'HOL-02', title: 'Winter Vacations', date: '2026-12-20', endDate: '2026-12-31', type: 'Vacation', description: 'Annual winter break for all students and staff.' },
  { id: 'HOL-03', title: 'Quaid-e-Azam Day', date: '2026-12-25', type: 'National', description: 'Birthday of Quaid-e-Azam Muhammad Ali Jinnah.' },
  { id: 'HOL-04', title: 'Kashmir Solidarity Day', date: '2027-02-05', type: 'National', description: 'National day of solidarity with the people of Kashmir.' },
  { id: 'HOL-05', title: 'Pakistan Day', date: '2027-03-23', type: 'National', description: 'Commemoration of the 1940 Pakistan Resolution.' },
  { id: 'HOL-06', title: 'Eid-ul-Fitr', date: '2027-03-20', endDate: '2027-03-22', type: 'Religious', description: 'Subject to moon sighting.' },
  { id: 'HOL-07', title: 'Labour Day', date: '2027-05-01', type: 'National', description: 'International Workers’ Day.' },
  { id: 'HOL-08', title: 'Youm-e-Takbeer', date: '2027-05-28', type: 'National', description: 'Commemoration of Pakistan’s nuclear tests.' },
  { id: 'HOL-09', title: 'Eid-ul-Adha', date: '2027-05-27', endDate: '2027-05-29', type: 'Religious', description: 'Subject to moon sighting.' },
  { id: 'HOL-10', title: 'Summer Vacations', date: '2027-06-01', endDate: '2027-08-14', type: 'Vacation', description: 'Annual summer break.' },
  { id: 'HOL-11', title: 'Independence Day', date: '2027-08-14', type: 'National', description: 'Independence Day of Pakistan.' },
  { id: 'HOL-12', title: 'Defence Day', date: '2027-09-06', type: 'National', description: 'Commemoration of the 1965 war.' },
]

export const calendarEvents = [
  { id: 'CAL-001', title: 'First Term Examinations Begin', date: '2026-10-05', endDate: '2026-10-15', type: 'Exam', audience: 'All', description: 'Grades 6–10 first term examinations.' },
  { id: 'CAL-002', title: 'Parent–Teacher Meeting', date: '2026-11-14', endDate: '', type: 'PTM', audience: 'Parents', description: 'First term PTM, 9:00 am – 12:30 pm.' },
  { id: 'CAL-003', title: 'Iqbal Day Assembly', date: '2026-11-09', endDate: '', type: 'Event', audience: 'All', description: 'Special assembly and poetry recitation.' },
  { id: 'CAL-004', title: 'Winter Vacations', date: '2026-12-20', endDate: '2026-12-31', type: 'Holiday', audience: 'All', description: 'School closed for winter break.' },
  { id: 'CAL-005', title: 'Annual Prize Distribution', date: '2027-01-18', endDate: '', type: 'Event', audience: 'All', description: 'Prizes for academics, sports and co-curricular achievements.' },
  { id: 'CAL-006', title: 'Pre-Board Examinations', date: '2027-02-08', endDate: '2027-02-18', type: 'Exam', audience: 'Grades 9–10', description: 'Pre-board examinations for SSC candidates.' },
  { id: 'CAL-007', title: 'Pakistan Day Ceremony', date: '2027-03-23', endDate: '', type: 'Event', audience: 'All', description: 'Flag hoisting and parade.' },
  { id: 'CAL-008', title: 'BISE Abbottabad Matric Examinations', date: '2027-03-05', endDate: '2027-04-05', type: 'Exam', audience: 'Grade 10', description: 'Annual SSC Part II board examinations.' },
]

export const notifications = [
  { id: 'NTF-001', title: 'Winter timings begin 1 November', message: 'School will operate from 8:30 am to 1:30 pm. Navy sweaters are permitted.', audience: 'All', date: '2026-10-28', read: false, type: 'Notice' },
  { id: 'NTF-002', title: 'November fee voucher available', message: 'Your November 2026 fee voucher has been generated. Due date: 10 November.', audience: 'Parents', date: '2026-11-01', read: false, type: 'Fee' },
  { id: 'NTF-003', title: 'First term result published', message: 'First term results are now available in the Results section.', audience: 'Students', date: '2026-10-30', read: false, type: 'Result' },
  { id: 'NTF-004', title: 'PTM booking open', message: 'Book your slot for the 14 November Parent–Teacher Meeting.', audience: 'Parents', date: '2026-11-01', read: true, type: 'PTM' },
  { id: 'NTF-005', title: 'Science fair selection', message: 'Three Grade 10 projects have qualified for the district science fair.', audience: 'All', date: '2026-10-15', read: true, type: 'Achievement' },
  { id: 'NTF-006', title: 'Leave request pending approval', message: '2 staff leave requests require the Principal’s approval.', audience: 'Principal', date: '2026-10-31', read: false, type: 'HR' },
]

export const activityLogs = [
  { id: 'LOG-001', user: teacherInfoPlaceholder, role: 'Teacher', action: 'Marked attendance for Grade 10-A', module: 'Attendance', date: '2026-11-01 08:42', ip: '192.168.1.24' },
  { id: 'LOG-002', user: 'Accounts Office', role: 'Accountant', action: 'Recorded fee payment V-2026-1004', module: 'Fees', date: '2026-11-01 09:15', ip: '192.168.1.31' },
  { id: 'LOG-003', user: 'School Admin', role: 'School Admin', action: 'Published notice: Winter timings', module: 'Notices', date: '2026-10-31 14:02', ip: '192.168.1.12' },
  { id: 'LOG-004', user: 'Principal', role: 'Principal', action: 'Approved leave LV-002', module: 'Leave', date: '2026-10-31 11:30', ip: '192.168.1.10' },
  { id: 'LOG-005', user: 'Ahmad Raza', role: 'Student', action: 'Downloaded first term result card', module: 'Results', date: '2026-10-30 18:22', ip: '103.255.4.18' },
  { id: 'LOG-006', user: 'Library Office', role: 'Librarian', action: 'Issued book “The Old Man and the Sea”', module: 'Library', date: '2026-10-30 10:05', ip: '192.168.1.44' },
  { id: 'LOG-007', user: 'Super Admin', role: 'Super Admin', action: 'Updated winter season dates', module: 'Settings', date: '2026-10-29 16:40', ip: '192.168.1.2' },
  { id: 'LOG-008', user: 'Muhammad Aslam', role: 'Parent', action: 'Submitted transport complaint TKT-2026-041', module: 'Complaints', date: '2026-10-29 08:12', ip: '39.57.12.90' },
]

export const timetable = {
  '10-A': {
    Monday: ['English', 'Mathematics', 'Physics', 'Urdu', 'Chemistry', 'Islamiyat', 'Computer Science'],
    Tuesday: ['Mathematics', 'English', 'Chemistry', 'Biology', 'Urdu', 'Pakistan Studies', 'Physical Education'],
    Wednesday: ['Physics', 'Mathematics', 'English', 'Chemistry', 'Islamiyat', 'Urdu', 'Library'],
    Thursday: ['Biology', 'Physics', 'Mathematics', 'English', 'Pakistan Studies', 'Computer Science', 'Urdu'],
    Friday: ['Chemistry', 'English', 'Mathematics', 'Islamiyat', 'Physics', 'Urdu', 'Assembly'],
    Saturday: ['Mathematics', 'Biology', 'English', 'Pakistan Studies', 'Chemistry', 'Sports', 'Tutorial'],
  },
  '9-A': {
    Monday: ['Urdu', 'English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Islamiyat'],
    Tuesday: ['English', 'Mathematics', 'Physics', 'Urdu', 'Computer Science', 'Pakistan Studies', 'Sports'],
    Wednesday: ['Mathematics', 'Chemistry', 'English', 'Biology', 'Urdu', 'Physics', 'Library'],
    Thursday: ['Physics', 'Urdu', 'Mathematics', 'Islamiyat', 'English', 'Chemistry', 'Computer Science'],
    Friday: ['English', 'Biology', 'Mathematics', 'Urdu', 'Physics', 'Pakistan Studies', 'Assembly'],
    Saturday: ['Chemistry', 'English', 'Mathematics', 'Sports', 'Urdu', 'Tutorial', 'Tutorial'],
  },
}

export const periodTimes = [
  { period: 1, time: '08:30 – 09:10' },
  { period: 2, time: '09:10 – 09:50' },
  { period: 3, time: '09:50 – 10:30' },
  { period: 4, time: '10:30 – 11:10' },
  { period: 5, time: '11:10 – 11:50' },
  { period: 6, time: '11:50 – 12:30' },
  { period: 7, time: '12:30 – 01:10' },
]

export const messageThreads = [
  {
    id: 'MSG-001',
    subject: 'Mathematics extra classes',
    participants: [teacherInfoPlaceholder, 'Muhammad Aslam'],
    updated: '2026-11-01 09:40',
    unread: 1,
    messages: [
      { from: 'Muhammad Aslam', role: 'Parent', text: 'Assalam-o-Alaikum Sir, Ahmad is struggling with trigonometry. Are extra classes available?', time: '2026-10-31 18:20' },
      { from: teacherInfoPlaceholder, role: 'Teacher', text: 'Walaikum Assalam. Yes, a tutorial is held every Saturday from 12:30 to 1:10. Ahmad is welcome to join.', time: '2026-11-01 09:40' },
    ],
  },
  {
    id: 'MSG-002',
    subject: 'First term result query',
    participants: ['Ahmad Raza', teacherInfoPlaceholder],
    updated: '2026-10-30 16:12',
    unread: 0,
    messages: [
      { from: 'Ahmad Raza', role: 'Student', text: 'Ma’am / Sir, could you please explain the marking scheme for the physics practical?', time: '2026-10-30 15:02' },
      { from: teacherInfoPlaceholder, role: 'Teacher', text: 'Of course. The practical is marked out of 20: 8 for procedure, 8 for observation and 4 for the viva.', time: '2026-10-30 16:12' },
    ],
  },
  {
    id: 'MSG-003',
    subject: 'Transport route timing',
    participants: ['Muhammad Aslam', 'Transport Office'],
    updated: '2026-10-29 11:05',
    unread: 1,
    messages: [
      { from: 'Muhammad Aslam', role: 'Parent', text: 'The Balakot bus has been late all week. Can the timing be reviewed?', time: '2026-10-29 08:15' },
      { from: 'Transport Office', role: 'Admin', text: 'Thank you for reporting. We have assigned a relief driver and will monitor the route this week.', time: '2026-10-29 11:05' },
    ],
  },
]

export const library = [
  { id: 'LIB-001', title: 'The Old Man and the Sea', author: 'Ernest Hemingway', isbn: '978-0684801223', category: 'Fiction', copies: 8, available: 5, shelf: 'A-12', language: 'English', status: 'Available' },
  { id: 'LIB-002', title: 'Bang-e-Dra', author: 'Allama Muhammad Iqbal', isbn: '978-969-0-00001', category: 'Poetry', copies: 12, available: 9, shelf: 'U-03', language: 'Urdu', status: 'Available' },
  { id: 'LIB-003', title: 'Physics for SSC Part II', author: 'Khyber Pakhtunkhwa Textbook Board', isbn: 'KPTB-PHY-10', category: 'Textbook', copies: 60, available: 22, shelf: 'T-08', language: 'English', status: 'Available' },
  { id: 'LIB-004', title: 'A Brief History of Pakistan', author: 'Roger D. Long', isbn: '978-0195477160', category: 'History', copies: 6, available: 2, shelf: 'H-04', language: 'English', status: 'Available' },
  { id: 'LIB-005', title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0141439518', category: 'Fiction', copies: 10, available: 0, shelf: 'A-05', language: 'English', status: 'All Issued' },
  { id: 'LIB-006', title: 'Chemistry for SSC Part II', author: 'Khyber Pakhtunkhwa Textbook Board', isbn: 'KPTB-CHEM-10', category: 'Textbook', copies: 60, available: 18, shelf: 'T-09', language: 'English', status: 'Available' },
  { id: 'LIB-007', title: 'Urdu Adab ki Kahaniyan', author: 'Ashraf Siddiqui', isbn: '978-969-0-00077', category: 'Short Stories', copies: 9, available: 6, shelf: 'U-07', language: 'Urdu', status: 'Available' },
  { id: 'LIB-008', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson', isbn: '978-0262046305', category: 'Computer Science', copies: 4, available: 1, shelf: 'C-02', language: 'English', status: 'Available' },
]

export const expenses = [
  { id: 'EXP-001', title: 'Electricity bill — October', category: 'Utilities', amount: 184500, date: '2026-10-25', paidTo: 'PESCO', method: 'Bank Transfer', status: 'Paid' },
  { id: 'EXP-002', title: 'Stationery & printing', category: 'Supplies', amount: 46500, date: '2026-10-18', paidTo: 'Al-Madina Traders, Balakot', method: 'Cash', status: 'Paid' },
  { id: 'EXP-003', title: 'Science lab consumables', category: 'Laboratory', amount: 78300, date: '2026-10-12', paidTo: 'Scientific Store, Mansehra', method: 'Cheque', status: 'Paid' },
  { id: 'EXP-004', title: 'Building maintenance', category: 'Maintenance', amount: 120000, date: '2026-10-08', paidTo: 'Al-Rehman Contractors', method: 'Bank Transfer', status: 'Paid' },
  { id: 'EXP-005', title: 'School bus fuel — October', category: 'Transport', amount: 96000, date: '2026-10-31', paidTo: 'PSO Fuel Station, Balakot', method: 'Cash', status: 'Pending' },
  { id: 'EXP-006', title: 'Internet & broadband', category: 'Utilities', amount: 18500, date: '2026-10-05', paidTo: 'PTCL', method: 'Bank Transfer', status: 'Paid' },
]

export const exams = [
  { id: 'EXM-001', name: 'First Term Examination', term: 'First Term', startDate: '2026-10-05', endDate: '2026-10-15', classes: '6–10', status: 'Completed', resultDate: '2026-10-30' },
  { id: 'EXM-002', name: 'Pre-Board Examination', term: 'Pre-Board', startDate: '2027-02-08', endDate: '2027-02-18', classes: '9–10', status: 'Scheduled', resultDate: '2027-02-25' },
  { id: 'EXM-003', name: 'BISE Abbottabad SSC Part II', term: 'Board', startDate: '2027-03-05', endDate: '2027-04-05', classes: '10', status: 'Scheduled', resultDate: '2027-07-15' },
  { id: 'EXM-004', name: 'Second Term Examination', term: 'Second Term', startDate: '2027-05-10', endDate: '2027-05-20', classes: '1–9', status: 'Scheduled', resultDate: '2027-05-28' },
]

export const assignments = [
  { id: 'ASG-001', title: 'Trigonometry Problem Set 4', subject: 'Mathematics', class: '10-A', teacher: teacherInfoPlaceholder, dueDate: '2026-11-06', status: 'Open', submissions: 31, total: 46 },
  { id: 'ASG-002', title: 'Essay: My Role in a Cleaner Pakistan', subject: 'English', class: '10-A', teacher: teacherInfoPlaceholder, dueDate: '2026-11-08', status: 'Open', submissions: 18, total: 46 },
  { id: 'ASG-003', title: 'Chemistry Practical Report — Titration', subject: 'Chemistry', class: '10-A', teacher: teacherInfoPlaceholder, dueDate: '2026-10-30', status: 'Closed', submissions: 44, total: 46 },
  { id: 'ASG-004', title: 'Pakistan Movement Timeline', subject: 'Pakistan Studies', class: '9-A', teacher: teacherInfoPlaceholder, dueDate: '2026-11-10', status: 'Open', submissions: 12, total: 45 },
]

export const idCards = students.slice(0, 12).map((s, i) => ({
  id: `IDC-${pad(i + 1)}`,
  studentId: s.id,
  studentName: s.name,
  class: `${s.grade}-${s.section}`,
  cardNo: `GHSNB-ID-2026-${pad(i + 1, 4)}`,
  issuedDate: '2026-08-15',
  validUntil: '2027-08-14',
  status: i % 9 === 0 ? 'Pending' : 'Issued',
}))

export const certificates = [
  { id: 'CRT-001', type: 'Character Certificate', studentName: 'Ahmad Raza', class: '10-A', issuedDate: '2026-10-30', serial: 'GHSNB-CC-2026-001', reason: 'Requested for scholarship application.', status: 'Issued' },
  { id: 'CRT-002', type: 'Merit Certificate', studentName: 'Fatima Noor', class: '8-A', issuedDate: '2026-10-20', serial: 'GHSNB-MC-2026-014', reason: 'First position in class, first term.', status: 'Issued' },
  { id: 'CRT-003', type: 'Sports Certificate', studentName: 'Hassan Ali', class: '10-A', issuedDate: '2026-10-09', serial: 'GHSNB-SC-2026-032', reason: '100m sprint — first position.', status: 'Issued' },
  { id: 'CRT-004', type: 'Leaving Certificate', studentName: 'Ali Hamza', class: '9-B', issuedDate: '', serial: 'GHSNB-LC-2026-008', reason: 'Family relocating to Mansehra.', status: 'Pending' },
  { id: 'CRT-005', type: 'Character Certificate', studentName: 'Zainab Akram', class: '6-A', issuedDate: '', serial: 'GHSNB-CC-2026-009', reason: 'Requested by parent.', status: 'Pending' },
]

export const feeStructure = [
  { level: 'Primary (Grades 1–5)', admission: 0, tuition: 1500, exam: 300, total: 1800 },
  { level: 'Middle (Grades 6–8)', admission: 0, tuition: 2000, exam: 400, total: 2400 },
  { level: 'High (Grades 9–10)', admission: 0, tuition: 2500, exam: 500, total: 3000 },
]

export const admissionSteps = [
  { step: 1, title: 'Submit online form', text: 'Complete the application with the student’s B-Form, previous result and parent CNIC details.', icon: 'FileText' },
  { step: 2, title: 'Document verification', text: 'The admissions office verifies documents within 3 working days.', icon: 'ShieldCheck' },
  { step: 3, title: 'Assessment & interview', text: 'A short written assessment and parent interview for Grade 8 applicants.', icon: 'ClipboardCheck' },
  { step: 4, title: 'Merit list & enrolment', text: 'Selected candidates are notified and enrolled after fee submission.', icon: 'GraduationCap' },
]

export const settings = {
  schoolName: school.name,
  academicYear: school.academicYear,
  principal: school.principal,
  phone: school.phone,
  email: school.email,
  address: school.address,
  winterStartMonth: 11,
  winterEndMonth: 2,
  summerStartMonth: 3,
  summerEndMonth: 10,
  seasonOverride: '',
  language: 'en',
  lateFee: 200,
  feeDueDay: 10,
  attendanceThreshold: 75,
  sessionTimeout: 60,
  maintenanceMode: false,
}

export const seedData = {
  students,
  teachers,
  parents,
  classes,
  subjects,
  admissions: [
    { id: 'ADM-001', applicationNo: 'ADM-2026-0142', studentName: 'Muhammad Hamza', fatherName: 'Rashid Mehmood', grade: '8', gender: 'Male', phone: '+92 300 1234 567', email: 'rashid.m@gmail.com', previousSchool: 'Government Middle School, Narwa Bajmore', status: 'Under Review', appliedOn: '2026-10-18', dob: '2013-05-14', address: 'House 22, Shohal Mazullah Khan, Balakot' },
    { id: 'ADM-002', applicationNo: 'ADM-2026-0143', studentName: 'Ayesha Fatima', fatherName: 'Kamran Aslam', grade: '1', gender: 'Female', phone: '+92 321 2345 678', email: 'kamran.a@gmail.com', previousSchool: 'Community School, Balakot', status: 'Approved', appliedOn: '2026-10-19', dob: '2020-02-11', address: 'House 8, Narwa Bajmore, Balakot' },
    { id: 'ADM-003', applicationNo: 'ADM-2026-0144', studentName: 'Abdul Moiz', fatherName: 'Sajid Hussain', grade: '8', gender: 'Male', phone: '+92 333 3456 789', email: 'sajid.h@gmail.com', previousSchool: 'Government School, Bajmore', status: 'Pending Documents', appliedOn: '2026-10-20', dob: '2013-08-22', address: 'House 51, Kaghan Road, Balakot' },
    { id: 'ADM-004', applicationNo: 'ADM-2026-0145', studentName: 'Hoorain Shahid', fatherName: 'Shahid Iqbal', grade: '1', gender: 'Female', phone: '+92 345 4567 890', email: 'shahid.i@gmail.com', previousSchool: 'Private School, Balakot', status: 'Rejected', appliedOn: '2026-10-21', dob: '2020-06-30', address: 'House 3, Balakot, Mansehra' },
    { id: 'ADM-005', applicationNo: 'ADM-2026-0146', studentName: 'Muhammad Talha', fatherName: 'Naveed Anjum', grade: '8', gender: 'Male', phone: '+92 300 5678 901', email: 'naveed.a@gmail.com', previousSchool: 'Government School, Shohal Mazullah Khan', status: 'Approved', appliedOn: '2026-10-22', dob: '2013-11-02', address: 'House 77, Narwa Bajmore, Balakot' },
    { id: 'ADM-006', applicationNo: 'ADM-2026-0147', studentName: 'Eman Fatima', fatherName: 'Adnan Qureshi', grade: '1', gender: 'Female', phone: '+92 311 6789 012', email: 'adnan.q@gmail.com', previousSchool: 'Community School, Kaghan Road', status: 'Under Review', appliedOn: '2026-10-25', dob: '2020-09-17', address: 'House 14, Kaghan Road, Balakot' },
  ],
  fees,
  results,
  attendance,
  payroll,
  transport,
  inventory,
  leave: leaveRequests,
  complaints,
  ptms,
  documents,
  holidays,
  calendar: calendarEvents,
  notifications,
  activity: activityLogs,
  messages: messageThreads,
  timetable,
  library,
  expenses,
  exams,
  assignments,
  idcards: idCards,
  certificates,
  users: demoAccounts,
  settings,
}

export const demoMeta = {
  student: { studentId: 'STU-001', parentId: 'PAR-001' },
  teacher: { teacherId: 'TCH-001' },
  class: '10-A',
}
