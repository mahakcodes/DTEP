import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const AuthContext = createContext(null)

const INITIAL_SUBJECTS = [
  { id: 'cs301', name: 'Data Structures & Algorithms', code: 'CS-301', department: 'Computer Science' },
  { id: 'cs302', name: 'Database Management Systems', code: 'CS-302', department: 'Computer Science' },
  { id: 'cs303', name: 'Operating Systems', code: 'CS-303', department: 'Computer Science' },
  { id: 'cs304', name: 'Computer Networks', code: 'CS-304', department: 'Computer Science' },
  { id: 'ma201', name: 'Discrete Mathematics', code: 'MA-201', department: 'Mathematics' },
  { id: 'cs305', name: 'Machine Learning Fundamentals', code: 'CS-305', department: 'Computer Science' },
]

const INITIAL_TEACHERS = [
  {
    id: 'u_eva_001',
    name: 'Dr. Priya Natarajan',
    email: 'priya.natarajan@dtep.edu',
    password: 'password123',
    role: 'evaluator',
    avatarInitials: 'PN',
    department: 'Computer Science',
    title: 'Senior Evaluator',
    joined: 'Aug 2020',
    status: 'active',
    subjectIds: ['cs301', 'cs304'],
    stats: { testsCreated: 58, submissionsGraded: 1247, avgTurnaround: '1.4 days', activeClasses: 6 },
  },
  {
    id: 'u_eva_002',
    name: 'Prof. Rajesh Kapoor',
    email: 'rajesh.kapoor@dtep.edu',
    password: 'password123',
    role: 'evaluator',
    avatarInitials: 'RK',
    department: 'Mathematics',
    title: 'Professor',
    joined: 'Jan 2019',
    status: 'active',
    subjectIds: ['ma201'],
    stats: { testsCreated: 41, submissionsGraded: 982, avgTurnaround: '1.8 days', activeClasses: 4 },
  },
  {
    id: 'u_eva_003',
    name: 'Dr. Anjali Mehta',
    email: 'anjali.mehta@dtep.edu',
    password: 'password123',
    role: 'evaluator',
    avatarInitials: 'AM',
    department: 'Computer Science',
    title: 'Associate Professor',
    joined: 'Mar 2022',
    status: 'active',
    subjectIds: ['cs302', 'cs305'],
    stats: { testsCreated: 32, submissionsGraded: 710, avgTurnaround: '1.2 days', activeClasses: 5 },
  },
  {
    id: 'u_eva_004',
    name: 'Dr. Samuel Okafor',
    email: 'samuel.okafor@dtep.edu',
    password: 'password123',
    role: 'evaluator',
    avatarInitials: 'SO',
    department: 'Physics',
    title: 'Senior Lecturer',
    joined: 'Sep 2021',
    status: 'active',
    subjectIds: ['cs303'],
    stats: { testsCreated: 27, submissionsGraded: 540, avgTurnaround: '2.1 days', activeClasses: 3 },
  },
  {
    id: 'u_eva_005',
    name: 'Prof. Elena Rossi',
    email: 'elena.rossi@dtep.edu',
    password: 'password123',
    role: 'evaluator',
    avatarInitials: 'ER',
    department: 'Electronics',
    title: 'Lecturer',
    joined: 'Feb 2023',
    status: 'active',
    subjectIds: ['cs304'],
    stats: { testsCreated: 18, submissionsGraded: 380, avgTurnaround: '1.6 days', activeClasses: 2 },
  },
  {
    id: 'u_eva_006',
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@dtep.edu',
    password: 'password123',
    role: 'evaluator',
    avatarInitials: 'VS',
    department: 'Mechanical',
    title: 'Head of Department',
    joined: 'Jul 2018',
    status: 'active',
    subjectIds: ['cs303'],
    stats: { testsCreated: 76, submissionsGraded: 1580, avgTurnaround: '1.1 days', activeClasses: 7 },
  },
]

const INITIAL_STUDENTS = [
  {
    id: 'u_stu_001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@dtep.edu',
    password: 'password123',
    role: 'student',
    avatarInitials: 'AS',
    program: 'B.Tech CSE, Sem 6',
    roll: 'CS2023-042',
    joined: 'Aug 2023',
    status: 'active',
    enrolledSubjectIds: ['cs301', 'cs302', 'cs303', 'cs304', 'ma201', 'cs305'],
    teacherIds: ['u_eva_001', 'u_eva_003', 'u_eva_004', 'u_eva_002'],
    stats: { testsTaken: 24, avgScore: 82.4, percentile: 87, streak: 12 },
  },
  {
    id: 'u_stu_002',
    name: 'Ishita Verma',
    email: 'ishita.verma@dtep.edu',
    password: 'password123',
    role: 'student',
    avatarInitials: 'IV',
    program: 'B.Tech CSE, Sem 6',
    roll: 'CS2023-118',
    joined: 'Aug 2023',
    status: 'active',
    enrolledSubjectIds: ['cs301', 'cs302', 'cs303', 'cs304', 'ma201', 'cs305'],
    teacherIds: ['u_eva_001', 'u_eva_003', 'u_eva_004', 'u_eva_002'],
    stats: { testsTaken: 26, avgScore: 91.7, percentile: 96, streak: 18 },
  },
  {
    id: 'u_stu_003',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@dtep.edu',
    password: 'password123',
    role: 'student',
    avatarInitials: 'RM',
    program: 'B.Tech ECE, Sem 4',
    roll: 'EC2024-077',
    joined: 'Aug 2024',
    status: 'active',
    enrolledSubjectIds: ['cs304', 'ma201'],
    teacherIds: ['u_eva_005', 'u_eva_002'],
    stats: { testsTaken: 14, avgScore: 74.2, percentile: 68, streak: 5 },
  },
  {
    id: 'u_stu_004',
    name: 'Ananya Rao',
    email: 'ananya.rao@dtep.edu',
    password: 'password123',
    role: 'student',
    avatarInitials: 'AR',
    program: 'B.Tech CSE, Sem 6',
    roll: 'CS2023-074',
    joined: 'Aug 2023',
    status: 'active',
    enrolledSubjectIds: ['cs301', 'cs302', 'cs303', 'cs304', 'ma201', 'cs305'],
    teacherIds: ['u_eva_001', 'u_eva_003', 'u_eva_004', 'u_eva_002'],
    stats: { testsTaken: 23, avgScore: 85.9, percentile: 91, streak: 9 },
  },
  {
    id: 'u_stu_005',
    name: 'Kabir Jain',
    email: 'kabir.jain@dtep.edu',
    password: 'password123',
    role: 'student',
    avatarInitials: 'KJ',
    program: 'B.Tech ME, Sem 5',
    roll: 'ME2023-129',
    joined: 'Aug 2023',
    status: 'active',
    enrolledSubjectIds: ['cs303', 'ma201'],
    teacherIds: ['u_eva_006', 'u_eva_002'],
    stats: { testsTaken: 19, avgScore: 68.1, percentile: 52, streak: 3 },
  },
  {
    id: 'u_stu_006',
    name: 'Mira Patel',
    email: 'mira.patel@dtep.edu',
    password: 'password123',
    role: 'student',
    avatarInitials: 'MP',
    program: 'B.Tech CSE, Sem 8',
    roll: 'CS2022-056',
    joined: 'Aug 2022',
    status: 'active',
    enrolledSubjectIds: ['cs301', 'cs302', 'cs305'],
    teacherIds: ['u_eva_001', 'u_eva_003'],
    stats: { testsTaken: 47, avgScore: 89.3, percentile: 94, streak: 22 },
  },
  {
    id: 'u_stu_007',
    name: 'Arjun Nair',
    email: 'arjun.nair@dtep.edu',
    password: 'password123',
    role: 'student',
    avatarInitials: 'AN',
    program: 'B.Tech EE, Sem 3',
    roll: 'EE2024-019',
    joined: 'Aug 2024',
    status: 'active',
    enrolledSubjectIds: ['ma201'],
    teacherIds: ['u_eva_002'],
    stats: { testsTaken: 8, avgScore: 71.5, percentile: 61, streak: 2 },
  },
  {
    id: 'u_stu_008',
    name: 'Saanvi Gupta',
    email: 'saanvi.gupta@dtep.edu',
    password: 'password123',
    role: 'student',
    avatarInitials: 'SG',
    program: 'B.Tech CSE, Sem 6',
    roll: 'CS2023-088',
    joined: 'Aug 2023',
    status: 'inactive',
    enrolledSubjectIds: ['cs301', 'cs302', 'cs303', 'cs304', 'ma201'],
    teacherIds: ['u_eva_001', 'u_eva_003', 'u_eva_004', 'u_eva_002'],
    stats: { testsTaken: 22, avgScore: 78.6, percentile: 79, streak: 0 },
  },
]

const INITIAL_ADMINS = [
  {
    id: 'u_adm_001',
    name: 'Daniel Ortiz',
    email: 'daniel.ortiz@dtep.edu',
    password: 'password123',
    role: 'admin',
    avatarInitials: 'DO',
    title: 'Director of Assessments',
    org: 'DTEP University',
    status: 'active',
    stats: { activeEvaluators: 42, registeredStudents: 2841, testsThisSemester: 184, avgCompletion: 94.2 },
  },
]

const INITIAL_QUESTIONS = [
  { id: 'q1', number: 1, type: 'mcq', marks: 2, chapter: 'Trees', text: 'Which of the following tree traversals visits nodes in the order: left subtree, root, right subtree?', options: [{ key: 'A', label: 'Preorder traversal' }, { key: 'B', label: 'Inorder traversal' }, { key: 'C', label: 'Postorder traversal' }, { key: 'D', label: 'Level-order traversal' }], correctKey: 'B', explanation: 'Inorder traversal follows the pattern: Left → Root → Right.' },
  { id: 'q2', number: 2, type: 'mcq', marks: 2, chapter: 'Hashing', text: 'A hash table of size 10 uses h(k) = k mod 10 and linear probing. Keys 12, 22, 32, 42 are inserted. Where is 42 stored?', options: [{ key: 'A', label: 'Index 2' }, { key: 'B', label: 'Index 3' }, { key: 'C', label: 'Index 4' }, { key: 'D', label: 'Index 5' }], correctKey: 'D', explanation: '12→2, 22→3, 32→4, 42→5 due to collisions.' },
  { id: 'q3', number: 3, type: 'mcq', marks: 3, chapter: 'Sorting', text: 'On a sorted ascending array, which algorithm has WORST asymptotic time?', options: [{ key: 'A', label: 'Insertion Sort' }, { key: 'B', label: 'Merge Sort' }, { key: 'C', label: 'QuickSort (first pivot)' }, { key: 'D', label: 'Bubble Sort (early exit)' }], correctKey: 'C', explanation: 'QuickSort with first pivot degenerates to O(N²) on sorted input.' },
  { id: 'q4', number: 4, type: 'mcq', marks: 2, chapter: 'Graphs', text: 'Which is TRUE for BFS/DFS on unweighted connected graphs?', options: [{ key: 'A', label: 'DFS always finds shortest path' }, { key: 'B', label: 'BFS always finds shortest path' }, { key: 'C', label: 'Both always find shortest path' }, { key: 'D', label: 'Neither finds shortest path' }], correctKey: 'B', explanation: 'BFS explores level-by-level, guaranteeing shortest unweighted path.' },
  { id: 'q5', number: 5, type: 'mcq', marks: 2, chapter: 'Dynamic Programming', text: 'Bottom-up DP is BEST described as:', options: [{ key: 'A', label: 'Recursively solve largest first' }, { key: 'B', label: 'Solve smallest subproblems first, build up' }, { key: 'C', label: 'Random subproblem order' }, { key: 'D', label: 'Greedy with backtracking' }], correctKey: 'B', explanation: 'Bottom-up iterates from smallest to largest, tabulating results.' },
  { id: 'q6', number: 6, type: 'mcq', marks: 3, chapter: 'Complexity', text: 'Runtimes: A=O(n log n), B=O(n²), C=O(2ⁿ). Fastest to slowest for large n:', options: [{ key: 'A', label: 'A, B, C' }, { key: 'B', label: 'B, A, C' }, { key: 'C', label: 'C, A, B' }, { key: 'D', label: 'A, C, B' }], correctKey: 'A', explanation: 'Polylogarithmic < polynomial < exponential.' },
]

const INITIAL_TESTS = [
  {
    id: 't_cs301_mid',
    title: 'Midterm Examination: Data Structures & Algorithms',
    subjectId: 'cs301',
    createdBy: 'u_eva_001',
    duration_minutes: 60,
    totalMarks: 30,
    totalQuestions: 6,
    scheduledAt: 'Jul 05, 2026 · 09:30 AM',
    windowCloses: 'Jul 05, 2026 · 12:30 PM',
    status: 'scheduled',
    instructions: ['All questions compulsory.', 'Negative marking: 25% per wrong answer.', 'One question at a time.'],
    questionIds: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'],
    positiveMarking: 1,
    negativeMarking: 0.25,
    proctoring: 'Full',
  },
  {
    id: 't_cs304_quiz2',
    title: 'Quiz 2 — Transport Layer & Congestion Control',
    subjectId: 'cs304',
    createdBy: 'u_eva_001',
    duration_minutes: 45,
    totalMarks: 25,
    totalQuestions: 10,
    scheduledAt: 'Jul 08, 2026 · 02:00 PM',
    windowCloses: 'Jul 08, 2026 · 04:00 PM',
    status: 'scheduled',
    instructions: ['Open notes permitted.', 'Calculator allowed.'],
    questionIds: ['q1', 'q2', 'q3'],
    positiveMarking: 1,
    negativeMarking: 0,
    proctoring: 'Light',
  },
  {
    id: 't_cs302_quiz3',
    title: 'Quiz 3 — Normal Forms & Transactions',
    subjectId: 'cs302',
    createdBy: 'u_eva_003',
    duration_minutes: 40,
    totalMarks: 20,
    totalQuestions: 8,
    startedAt: 'Available now',
    expiresAt: 'Closes in 2 days 4 hours',
    status: 'active',
    instructions: ['Self-paced. Resume anytime.'],
    questionIds: ['q1', 'q2', 'q3', 'q4'],
    positiveMarking: 1,
    negativeMarking: 0.25,
    proctoring: 'Light',
  },
  {
    id: 't_cs301_quiz2_past',
    title: 'Quiz 2 — Hashing & Graphs',
    subjectId: 'cs301',
    createdBy: 'u_eva_001',
    duration_minutes: 30,
    totalMarks: 15,
    totalQuestions: 6,
    submittedAt: 'Jun 24, 2026',
    status: 'graded',
    questionIds: ['q1', 'q2', 'q3', 'q4'],
    positiveMarking: 1,
    negativeMarking: 0.25,
    gradedBy: 'Auto + Staff Review',
  },
  {
    id: 't_ma201_mid_past',
    title: 'Midterm: Discrete Mathematics',
    subjectId: 'ma201',
    createdBy: 'u_eva_002',
    duration_minutes: 90,
    totalMarks: 60,
    totalQuestions: 10,
    submittedAt: 'Jun 20, 2026',
    status: 'graded',
    questionIds: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'],
    positiveMarking: 1,
    negativeMarking: 0.25,
    gradedBy: 'Dr. Kapoor',
  },
]

const INITIAL_SUBMISSIONS = [
  {
    id: 's_001',
    studentId: 'u_stu_001',
    testId: 't_cs301_quiz2_past',
    submittedAt: 'Jun 24, 2026 · 10:14 AM',
    timeTakenSeconds: 1602,
    autoScore: 14,
    maxScore: 15,
    percentage: 93.3,
    status: 'graded',
    percentile: 94,
    rank: 12,
    classSize: 184,
    gradedBy: 'Auto + Staff Review',
    flags: [],
    details: [
      { questionId: 'q1', is_correct: true, user_selected_option_id: 'B', score: 2, max_score: 2 },
      { questionId: 'q2', is_correct: true, user_selected_option_id: 'D', score: 2, max_score: 2 },
      { questionId: 'q3', is_correct: true, user_selected_option_id: 'C', score: 3, max_score: 3 },
      { questionId: 'q4', is_correct: true, user_selected_option_id: 'B', score: 2, max_score: 2 },
      { questionId: 'q5', is_correct: true, user_selected_option_id: 'B', score: 2, max_score: 2 },
      { questionId: 'q6', is_correct: false, user_selected_option_id: 'A', score: 1.75, max_score: 3 },
    ],
    passed: true,
    test_title: 'Quiz 2 — Hashing & Graphs',
  },
  {
    id: 's_002',
    studentId: 'u_stu_002',
    testId: 't_cs301_quiz2_past',
    submittedAt: 'Jun 24, 2026 · 10:21 AM',
    timeTakenSeconds: 1747,
    autoScore: 15,
    maxScore: 15,
    percentage: 100,
    status: 'graded',
    percentile: 99,
    rank: 1,
    classSize: 184,
    gradedBy: 'Auto-graded',
    flags: [],
    details: INITIAL_QUESTIONS.slice(0, 6).map(q => ({ questionId: q.id, is_correct: true, user_selected_option_id: q.correctKey, score: q.marks, max_score: q.marks })),
    passed: true,
    test_title: 'Quiz 2 — Hashing & Graphs',
  },
  {
    id: 's_003',
    studentId: 'u_stu_003',
    testId: 't_cs301_quiz2_past',
    submittedAt: 'Jun 24, 2026 · 10:08 AM',
    timeTakenSeconds: 1375,
    autoScore: 9,
    maxScore: 15,
    percentage: 60,
    status: 'graded',
    percentile: 36,
    rank: 118,
    classSize: 184,
    gradedBy: 'Auto-graded',
    flags: [],
    details: [],
    passed: false,
    test_title: 'Quiz 2 — Hashing & Graphs',
  },
  {
    id: 's_004',
    studentId: 'u_stu_004',
    testId: 't_ma201_mid_past',
    submittedAt: 'Jun 20, 2026 · 11:40 AM',
    timeTakenSeconds: 4320,
    autoScore: 44,
    maxScore: 60,
    percentage: 73.3,
    status: 'needs_review',
    percentile: 78,
    rank: 45,
    classSize: 207,
    gradedBy: 'Dr. Kapoor',
    flags: ['manual_review', 'tab_switch_detected'],
    details: [],
    passed: true,
    test_title: 'Midterm: Discrete Mathematics',
  },
  {
    id: 's_005',
    studentId: 'u_stu_005',
    testId: 't_cs301_quiz2_past',
    submittedAt: 'Jun 24, 2026 · 10:11 AM',
    timeTakenSeconds: 1503,
    autoScore: 11,
    maxScore: 15,
    percentage: 73.3,
    status: 'graded',
    percentile: 62,
    rank: 70,
    classSize: 184,
    gradedBy: 'Auto-graded',
    flags: [],
    details: [],
    passed: true,
    test_title: 'Quiz 2 — Hashing & Graphs',
  },
  {
    id: 's_006',
    studentId: 'u_stu_006',
    testId: 't_cs301_mid',
    submittedAt: 'Jun 16, 2026 · 09:38 AM',
    timeTakenSeconds: 5100,
    autoScore: 55,
    maxScore: 60,
    percentage: 91.7,
    status: 'flagged',
    percentile: 88,
    rank: 15,
    classSize: 142,
    gradedBy: 'Pending review',
    flags: ['abnormal_response_pattern'],
    details: [],
    passed: true,
    test_title: 'Midterm: DSA',
  },
]

function generateId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [teachers, setTeachers] = useState(INITIAL_TEACHERS)
  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [admins] = useState(INITIAL_ADMINS)
  const [subjects] = useState(INITIAL_SUBJECTS)
  const [tests, setTests] = useState(INITIAL_TESTS)
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS)
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS)

  useEffect(() => {
    const remember = localStorage.getItem('dtep_remember') === 'true'
    const storage = remember ? localStorage : sessionStorage
    const storedToken = storage.getItem('dtep_token')
    const storedUser = storage.getItem('dtep_user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (_) {
        localStorage.removeItem('dtep_token')
        localStorage.removeItem('dtep_user')
        sessionStorage.removeItem('dtep_token')
        sessionStorage.removeItem('dtep_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(({ email, password, remember = true, role = 'student', mockMode = false }) => {
    const allUsers = [...admins, ...teachers, ...students]
    const found = allUsers.find(u => u.email.toLowerCase() === String(email || '').toLowerCase())
    const storage = remember ? localStorage : sessionStorage

    if (mockMode) {
      const mockUser = {
        id: `mock_${role}_${Date.now()}`,
        name: role === 'admin' ? 'Local Admin Demo' : role === 'evaluator' ? 'Local Evaluator Demo' : 'Local Student Demo',
        email: email || `${role}@demo.local`,
        role,
        avatarInitials: role === 'admin' ? 'AD' : role === 'evaluator' ? 'ED' : 'SD',
        status: 'active',
        stats: role === 'admin'
          ? { activeEvaluators: 0, registeredStudents: 0, testsThisSemester: 0, avgCompletion: 0 }
          : role === 'evaluator'
          ? { testsCreated: 0, submissionsGraded: 0, avgTurnaround: '—', activeClasses: 0 }
          : { testsTaken: 0, avgScore: 0, percentile: 0, streak: 0 },
      }

      const newToken = `dtep_mock_${role}_${Date.now()}`
      setToken(newToken)
      setUser(mockUser)

      storage.setItem('dtep_token', newToken)
      storage.setItem('dtep_user', JSON.stringify(mockUser))

      if (remember) {
        localStorage.setItem('dtep_remember', 'true')
        sessionStorage.removeItem('dtep_token')
        sessionStorage.removeItem('dtep_user')
      } else {
        localStorage.removeItem('dtep_remember')
        localStorage.removeItem('dtep_token')
        localStorage.removeItem('dtep_user')
      }

      return mockUser
    }

    if (!found || found.status === 'inactive' || found.password !== password) {
      throw new Error('Invalid credentials or account inactive.')
    }

    const newToken = `dtep_${found.role}_${Date.now()}`
    const { password: _pw, ...safeUser } = found

    setToken(newToken)
    setUser(safeUser)

    storage.setItem('dtep_token', newToken)
    storage.setItem('dtep_user', JSON.stringify(safeUser))

    if (remember) {
      localStorage.setItem('dtep_remember', 'true')
      sessionStorage.removeItem('dtep_token')
      sessionStorage.removeItem('dtep_user')
    } else {
      localStorage.removeItem('dtep_remember')
      localStorage.removeItem('dtep_token')
      localStorage.removeItem('dtep_user')
    }

    return safeUser
  }, [admins, teachers, students])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('dtep_token')
    localStorage.removeItem('dtep_user')
    localStorage.removeItem('dtep_remember')
    sessionStorage.removeItem('dtep_token')
    sessionStorage.removeItem('dtep_user')
  }, [])

  const addTeacher = useCallback((data) => {
    const newTeacher = {
      id: generateId('u_eva'),
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'evaluator',
      avatarInitials: data.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(),
      department: data.department,
      title: 'Lecturer',
      joined: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      status: 'active',
      subjectIds: data.subjectIds || [],
      stats: { testsCreated: 0, submissionsGraded: 0, avgTurnaround: '—', activeClasses: 0 },
    }
    setTeachers(prev => [...prev, newTeacher])
    return newTeacher
  }, [])

  const addStudent = useCallback((data) => {
    const newStudent = {
      id: generateId('u_stu'),
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'student',
      avatarInitials: data.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(),
      program: data.program,
      roll: data.roll || generateId('ROLL').toUpperCase(),
      joined: new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' }),
      status: 'active',
      enrolledSubjectIds: data.subjectIds || [],
      teacherIds: data.teacherIds || [],
      stats: { testsTaken: 0, avgScore: 0, percentile: 0, streak: 0 },
    }
    setStudents(prev => [...prev, newStudent])
    return newStudent
  }, [])

  const toggleUserStatus = useCallback((userId, role) => {
    if (role === 'evaluator') {
      setTeachers(prev => prev.map(t => t.id === userId ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' } : t))
    } else if (role === 'student') {
      setStudents(prev => prev.map(s => s.id === userId ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s))
    }
  }, [])

  const deleteUser = useCallback((userId, role) => {
    if (role === 'evaluator') {
      setTeachers(prev => prev.filter(t => t.id !== userId))
    } else if (role === 'student') {
      setStudents(prev => prev.filter(s => s.id !== userId))
    }
  }, [])

  const assignSubjectToTeacher = useCallback((teacherId, subjectId) => {
    setTeachers(prev => prev.map(t => t.id === teacherId
      ? { ...t, subjectIds: [...new Set([...(t.subjectIds || []), subjectId])] }
      : t))
  }, [])

  const enrollStudentInSubject = useCallback((studentId, subjectId) => {
    setStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s
      const newSubjectIds = [...new Set([...(s.enrolledSubjectIds || []), subjectId])]
      const relatedTeachers = teachers.filter(t => t.subjectIds?.includes(subjectId)).map(t => t.id)
      const newTeacherIds = [...new Set([...(s.teacherIds || []), ...relatedTeachers])]
      return { ...s, enrolledSubjectIds: newSubjectIds, teacherIds: newTeacherIds }
    }))
  }, [teachers])

  const createTest = useCallback((data) => {
    const newQuestionIds = (data.questions || []).map(q => {
      if (q.id) return q.id
      const nq = { ...q, id: generateId('q'), type: 'mcq' }
      setQuestions(prev => [...prev, nq])
      return nq.id
    })
    const newTest = {
      id: generateId('t'),
      title: data.title,
      subjectId: data.subjectId,
      createdBy: data.createdBy,
      duration_minutes: data.duration || 30,
      totalMarks: data.totalMarks || newQuestionIds.length,
      totalQuestions: newQuestionIds.length,
      scheduledAt: data.scheduledAt || new Date().toLocaleString(),
      status: 'scheduled',
      instructions: data.instructions || [],
      questionIds: newQuestionIds,
      positiveMarking: data.positiveMarking || 1,
      negativeMarking: data.negativeMarking || 0,
      proctoring: 'Standard',
    }
    setTests(prev => [...prev, newTest])
    return newTest
  }, [])

  const addQuestion = useCallback((question) => {
    const nq = { ...question, id: generateId('q'), type: 'mcq' }
    setQuestions(prev => [...prev, nq])
    return nq
  }, [])

  const gradeSubmission = useCallback((submissionId, manualScore, feedback = '') => {
    setSubmissions(prev => prev.map(s => s.id === submissionId
      ? { ...s, status: 'graded', autoScore: manualScore ?? s.autoScore, flags: s.flags.filter(f => f !== 'manual_review'), feedback }
      : s))
  }, [])

  const resolveFlag = useCallback((submissionId, flag) => {
    setSubmissions(prev => prev.map(s => s.id === submissionId
      ? { ...s, flags: s.flags.filter(f => f !== flag), status: s.flags.length <= 1 ? 'graded' : s.status }
      : s))
  }, [])

  const submitTestResult = useCallback((payload) => {
    const sub = {
      id: generateId('s'),
      studentId: payload.studentId || user?.id,
      testId: payload.testId,
      submittedAt: new Date().toLocaleString(),
      timeTakenSeconds: payload.timeTakenSeconds || 0,
      autoScore: payload.score,
      maxScore: payload.maxScore,
      percentage: (payload.score / payload.maxScore) * 100,
      status: 'graded',
      percentile: Math.round((payload.score / payload.maxScore) * 80 + 10),
      rank: Math.round(184 * (1 - payload.score / payload.maxScore)) + 1,
      classSize: 184,
      gradedBy: 'Auto-graded',
      flags: [],
      details: payload.details || [],
      passed: (payload.score / payload.maxScore) >= 0.5,
      test_title: payload.testTitle,
    }
    setSubmissions(prev => [...prev, sub])
    return sub
  }, [user])

  const isAuthenticated = Boolean(token && user)

  const hasRole = useCallback((roles) => {
    if (!user) return false
    if (Array.isArray(roles)) return roles.includes(user.role)
    return user.role === roles
  }, [user])

  const getStudentsForTeacher = useCallback((teacherId) => {
    const t = teachers.find(x => x.id === teacherId)
    if (!t) return []
    const teacherSubjects = t.subjectIds || []
    return students.filter(s =>
      s.enrolledSubjectIds?.some(sid => teacherSubjects.includes(sid)) ||
      s.teacherIds?.includes(teacherId)
    )
  }, [teachers, students])

  const getTestsForTeacher = useCallback((teacherId) => {
    return tests.filter(t => t.createdBy === teacherId)
  }, [tests])

  const getSubmissionsForTeacher = useCallback((teacherId) => {
    const tTestIds = tests.filter(t => t.createdBy === teacherId).map(t => t.id)
    return submissions.filter(s => tTestIds.includes(s.testId))
  }, [tests, submissions])

  const getTestsForStudent = useCallback((studentId) => {
    const s = students.find(x => x.id === studentId)
    if (!s) return tests
    return tests.filter(t => s.enrolledSubjectIds?.includes(t.subjectId))
  }, [students, tests])

  const getSubmissionsForStudent = useCallback((studentId) => {
    return submissions.filter(s => s.studentId === studentId)
  }, [submissions])

  const getTestDetails = useCallback((testId) => {
    const t = tests.find(x => x.id === testId)
    if (!t) return null
    const qs = questions.filter(q => t.questionIds?.includes(q.id))
    const subj = subjects.find(s => s.id === t.subjectId)
    return { ...t, questions: qs.length ? qs : questions.slice(0, 6), subject: subj }
  }, [tests, questions, subjects])

  const getSubmissionById = useCallback((submissionId) => {
    const s = submissions.find(x => x.id === submissionId)
    if (!s) return null
    const t = tests.find(x => x.id === s.testId)
    const qs = (t?.questionIds || []).map(qid => questions.find(q => q.id === qid)).filter(Boolean)
    return {
      ...s,
      test_title: s.test_title || t?.title,
      details: s.details?.length ? s.details : qs.map(q => ({
        question_id: q.id,
        question_text: q.text,
        options: q.options,
        correct_option_id: q.correctKey,
        is_correct: Math.random() > 0.3,
        user_selected_option_id: q.correctKey,
        score: Math.random() > 0.3 ? q.marks : 0,
        max_score: q.marks,
        explanation: q.explanation,
      })),
    }
  }, [submissions, tests, questions])

  const value = useMemo(() => ({
    user, token, isLoading, isAuthenticated,
    login, logout, hasRole,
    teachers, students, admins, subjects, tests, questions, submissions,
    addTeacher, addStudent, toggleUserStatus, deleteUser,
    assignSubjectToTeacher, enrollStudentInSubject,
    createTest, addQuestion,
    gradeSubmission, resolveFlag, submitTestResult,
    getStudentsForTeacher, getTestsForTeacher, getSubmissionsForTeacher,
    getTestsForStudent, getSubmissionsForStudent,
    getTestDetails, getSubmissionById,
  }), [
    user, token, isLoading, isAuthenticated, login, logout, hasRole,
    teachers, students, admins, subjects, tests, questions, submissions,
    addTeacher, addStudent, toggleUserStatus, deleteUser,
    assignSubjectToTeacher, enrollStudentInSubject,
    createTest, addQuestion,
    gradeSubmission, resolveFlag, submitTestResult,
    getStudentsForTeacher, getTestsForTeacher, getSubmissionsForTeacher,
    getTestsForStudent, getSubmissionsForStudent,
    getTestDetails, getSubmissionById,
  ])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export default AuthContext
