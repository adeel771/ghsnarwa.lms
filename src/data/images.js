// All photographs are stored locally in /public/images for reliability.
// Sources: Wikimedia Commons (USAID public-domain & CC-licensed Pakistani school
// photography) and Pexels (free-to-use license). See CREDITS.md.

export const IMG = {
  girlsShalwar: '/images/girls-shalwar-kameez.jpg',
  classroomGirls: '/images/classroom-girls.jpg',
  girlsAssembly: '/images/girls-assembly.jpg',
  schoolAssembly: '/images/school-assembly.jpg',
  girlsGroup: '/images/girls-group.jpg',
  girlsStudying: '/images/girls-studying.jpg',
  girlsReading: '/images/girls-reading.jpg',
  studentsWorkshop: '/images/students-workshop.jpg',
  playground: '/images/playground.jpg',
  electronicsLab: '/images/electronics-lab.jpg',
  boysClassroom: '/images/boys-classroom.jpg',
  boyComputer: '/images/boy-computer.jpg',
  childrenFlags: '/images/children-flags.jpg',
  studentsFlags: '/images/students-flags.jpg',
  sportsDay: '/images/sports-day.jpg',
  scienceLab: '/images/science-lab.jpg',
  computerLab: '/images/computer-lab.jpg',
  girlsLaptop: '/images/girls-laptop.jpg',
  outdoorEducation: '/images/outdoor-education.jpg',
  boyReading: '/images/boy-reading.jpg',
  boysBuilding: '/images/boys-school-building.jpg',
  boysBuilding2: '/images/boys-school-building2.jpg',
  girlsBuilding: '/images/girls-school-building.jpg',
  girlsGate: '/images/girls-school-gate.jpg',
  mountainSchool: '/images/mountain-school.jpg',
  inauguration: '/images/facility-inauguration.jpg',
  ribbonCutting: '/images/ribbon-cutting.jpg',
  kpkCampus: '/images/kpk-campus.jpg',
  culturalEvent: '/images/cultural-event.jpg',
  studentExchange: '/images/student-exchange.jpg',
  kpkWinter: '/images/kpk-winter.jpg',
  calm: '/images/boys-classroom.jpg',
}

export const FALLBACK_IMAGE = '/images/fallback.svg'

export const heroSlides = {
  winter: [
    {
      image: IMG.girlsAssembly,
      title: 'A winter morning assembly',
      caption: 'Students gather for the daily assembly beneath the mountains of Balakot.',
    },
    {
      image: IMG.classroomGirls,
      title: 'Learning never stops',
      caption: 'Warm classrooms, focused minds and a culture of curiosity.',
    },
    {
      image: IMG.girlsStudying,
      title: 'Every girl, every dream',
      caption: 'Our winter enrichment programme keeps learning alive all season.',
    },
    {
      image: IMG.scienceLab,
      title: 'Hands-on science',
      caption: 'Practical work in our upgraded science laboratory.',
    },
  ],
  summer: [
    {
      image: IMG.girlsGroup,
      title: 'Knowledge, Character, Service',
      caption: 'A community of learners proudly wearing the uniform of service.',
    },
    {
      image: IMG.schoolAssembly,
      title: 'Together we rise',
      caption: 'Morning assembly builds discipline, unity and national pride.',
    },
    {
      image: IMG.playground,
      title: 'Healthy bodies, bright minds',
      caption: 'Sports and play are part of every child’s school day.',
    },
    {
      image: IMG.computerLab,
      title: 'Digital skills for every student',
      caption: 'Modern computer labs prepare students for the future.',
    },
  ],
}

export const campusSlides = {
  winter: [
    { image: IMG.girlsBuilding, title: 'Main academic block', caption: 'Our main building, home to Grades 6–10.' },
    { image: IMG.girlsReading, title: 'Reading corner', caption: 'A quiet, warm space for reading during the winter term.' },
    { image: IMG.boysClassroom, title: 'Smart classrooms', caption: 'Every classroom is equipped for modern learning.' },
    { image: IMG.kpkWinter, title: 'Winter in the hills', caption: 'Seasonal learning projects celebrate the beauty of Khyber Pakhtunkhwa.' },
  ],
  summer: [
    { image: IMG.boysBuilding, title: 'Main academic block', caption: 'A safe, green campus in the hills of Balakot.' },
    { image: IMG.girlsLaptop, title: 'Digital learning hub', caption: 'Students use laptops and tablets in the ICT lab.' },
    { image: IMG.playground, title: 'Playground & sports field', caption: 'Space for cricket, hockey, athletics and daily play.' },
    { image: IMG.girlsGate, title: 'School gate', caption: 'A welcoming entrance monitored for student safety.' },
  ],
}

export const facilityCards = [
  { icon: 'FlaskConical', title: 'Science Laboratories', image: IMG.scienceLab, text: 'Separate physics, chemistry and biology labs with trained demonstrators.' },
  { icon: 'Monitor', title: 'Computer & ICT Lab', image: IMG.computerLab, text: 'Forty workstations, broadband internet and a digital literacy curriculum.' },
  { icon: 'BookOpen', title: 'Library & Reading Room', image: IMG.outdoorEducation, text: 'Over 8,000 Urdu and English titles, newspapers and a quiet study hall.' },
  { icon: 'Trophy', title: 'Sports Ground', image: IMG.sportsDay, text: 'Cricket, hockey, football, badminton and annual athletics championships.' },
  { icon: 'Wrench', title: 'Technical Workshop', image: IMG.electronicsLab, text: 'Vocational skills in electronics, woodwork and basic engineering.' },
  { icon: 'HeartPulse', title: 'Health & First Aid Room', image: IMG.girlsStudying, text: 'A full-time first-aider and regular health screening for all students.' },
]

export const galleryItems = [
  { id: 'g1', title: 'Morning assembly', category: 'Assemblies', image: IMG.schoolAssembly, caption: 'The whole school gathers for assembly and the national anthem.' },
  { id: 'g2', title: 'Classroom learning', category: 'Classrooms', image: IMG.classroomGirls, caption: 'Grade 9 students in an English language lesson.' },
  { id: 'g3', title: 'Science practical', category: 'Laboratories', image: IMG.scienceLab, caption: 'Chemistry practical work in the senior science lab.' },
  { id: 'g4', title: 'Computer lab', category: 'Laboratories', image: IMG.computerLab, caption: 'ICT skills session for Grade 8.' },
  { id: 'g5', title: 'Playtime', category: 'Sports', image: IMG.playground, caption: 'Students enjoy the school playground during break.' },
  { id: 'g6', title: 'Annual sports day', category: 'Sports', image: IMG.sportsDay, caption: 'Athletes compete at the annual inter-house sports day.' },
  { id: 'g7', title: 'Independence Day', category: 'Events', image: IMG.childrenFlags, caption: 'Students celebrate 14 August with patriotic songs.' },
  { id: 'g8', title: 'Cultural showcase', category: 'Events', image: IMG.culturalEvent, caption: 'A celebration of Pakistan’s four provinces and cultures.' },
  { id: 'g9', title: 'Library reading', category: 'Campus', image: IMG.boyReading, caption: 'A student reads in the school library.' },
  { id: 'g10', title: 'Girls’ campus', category: 'Campus', image: IMG.girlsBuilding, caption: 'The girls’ academic block.' },
  { id: 'g11', title: 'Boys’ campus', category: 'Campus', image: IMG.boysBuilding2, caption: 'The boys’ academic block and courtyard.' },
  { id: 'g12', title: 'Winter learning', category: 'Classrooms', image: IMG.girlsStudying, caption: 'Winter enrichment classes in progress.' },
  { id: 'g13', title: 'Technical workshop', category: 'Laboratories', image: IMG.studentsWorkshop, caption: 'Students learn practical electronics.' },
  { id: 'g14', title: 'Student exchange', category: 'Events', image: IMG.studentExchange, caption: 'Visiting students share experiences with our senior class.' },
  { id: 'g15', title: 'New facility opening', category: 'Events', image: IMG.ribbonCutting, caption: 'Inauguration of the new science wing.' },
  { id: 'g16', title: 'Winter in the mountains', category: 'Seasons', image: IMG.kpkWinter, caption: 'A winter view of the Khyber Pakhtunkhwa hills around Balakot.' },
]

export const newsItems = [
  {
    id: 'n1',
    title: 'Admissions open for the 2026–27 academic session',
    date: '2026-10-20',
    category: 'Admissions',
    image: IMG.girlsGate,
    excerpt: 'Online applications for Grade 1 and Grade 8 are now open. Submit your form before 30 November 2026.',
    body: 'Government High School Narwa Bajmore invites applications for the 2026–27 academic session. Admission is offered in Grade 1 and Grade 8 (Matric stream). Parents may apply online through the Admissions page or visit the school office between 8:00 am and 1:30 pm. The merit list will be displayed on 12 December 2026. Required documents include the student’s B-Form, previous school certificate, two photographs, and the parent’s CNIC copy. No donation or capitation fee is charged.',
    author: 'Admissions Office',
    featured: true,
  },
  {
    id: 'n2',
    title: 'Winter term timetable and uniform advisory',
    date: '2026-10-28',
    category: 'Notices',
    image: IMG.classroomGirls,
    excerpt: 'Winter timings begin on 1 November. School will run from 8:30 am to 1:30 pm with a navy sweater permitted.',
    body: 'As per the Elementary & Secondary Education Department, Khyber Pakhtunkhwa notification, winter timings will commence on 1 November 2026. School hours are 8:30 am to 1:30 pm, Monday to Saturday. Students may wear the official navy V-neck sweater over the prescribed uniform. The morning assembly will begin at 8:35 am sharp. Parents are requested to collect students promptly at dismissal.',
    author: 'Principal’s Office',
    featured: true,
  },
  {
    id: 'n3',
    title: 'Science students qualify for the district science fair',
    date: '2026-10-15',
    category: 'Achievements',
    image: IMG.scienceLab,
    excerpt: 'Three Grade 10 projects on renewable energy and water conservation advance to the Mansehra district fair.',
    body: 'Our Grade 10 science team has qualified for the Mansehra District Science & Technology Fair with three projects: a low-cost solar water heater, a rainwater harvesting model, and an Arduino-based air quality monitor. The projects were developed with guidance from the school’s science department. The district fair will be held in Mansehra on 18 November 2026.',
    author: 'Science Department',
    featured: false,
  },
  {
    id: 'n4',
    title: 'Annual sports day celebrates house spirit',
    date: '2026-10-08',
    category: 'Sports',
    image: IMG.sportsDay,
    excerpt: 'Iqbal House lifted the overall trophy after a thrilling final day of athletics and team sports.',
    body: 'The Annual Sports Day was held on 8 October 2026. Students competed in athletics, cricket, hockey, badminton and tug-of-war. Iqbal House won the overall trophy with 186 points, followed by Jinnah House (171), Sir Syed House (158) and Quaid House (149). The District Education Officer distributed medals and praised the school’s emphasis on physical wellbeing.',
    author: 'Sports Department',
    featured: false,
  },
  {
    id: 'n5',
    title: 'Parent–Teacher Meeting scheduled for 14 November',
    date: '2026-11-01',
    category: 'Notices',
    image: IMG.girlsAssembly,
    excerpt: 'First-term PTM will be held from 9:00 am to 12:30 pm. Parents may book a slot online.',
    body: 'The first-term Parent–Teacher Meeting will take place on Saturday, 14 November 2026, from 9:00 am to 12:30 pm. Parents can book a meeting slot through the Parent Portal or by contacting the class teacher. Report cards for the first term will be issued during the meeting. Please bring your CNIC and the student’s diary.',
    author: 'Academic Office',
    featured: false,
  },
  {
    id: 'n6',
    title: 'Digital LMS launched for students and parents',
    date: '2026-09-25',
    category: 'Technology',
    image: IMG.girlsLaptop,
    excerpt: 'Attendance, results, fee vouchers and timetables are now available online for every family.',
    body: 'Government High School Narwa Bajmore has launched its Digital Learning Management System. Students and parents can now view attendance, term results, fee vouchers, timetables and school notices from any device. Teacher accounts support digital attendance marking and result entry. The system is part of the school’s commitment to transparent, efficient and modern public education.',
    author: 'IT Department',
    featured: false,
  },
]

export const testimonialItems = [
  { name: 'Ayesha Bibi', role: 'Parent, Grade 10', quote: 'The portal keeps me informed about my daughter’s attendance and results. I no longer have to visit the school office for every small thing.', initials: 'AB' },
  { name: 'Ahmad Raza', role: 'Student, Grade 10-A', quote: 'I can check my timetable, download past papers and see my progress. It makes studying much more organised.', initials: 'AR' },
  { name: 'Muhammad Aslam', role: 'Parent, Grade 8', quote: 'Living in the hills, the online portal saves us a long journey to school. Fee vouchers and notices are always available.', initials: 'MA' },
  { name: 'Fatima Noor', role: 'Alumna, Matric 2025', quote: 'The teachers here encouraged me to aim for college. I still come back to visit the school that gave me my start.', initials: 'FN' },
]

export const stats = [
  { value: '1,240', label: 'Students enrolled', icon: 'Users' },
  { value: '64', label: 'Qualified teachers', icon: 'GraduationCap' },
  { value: '42', label: 'Years of service', icon: 'Landmark' },
  { value: '96%', label: 'Matric pass rate', icon: 'TrendingUp' },
]
