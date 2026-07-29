import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Clock,
  Trophy,
  GraduationCap,
  BookOpen,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Filter,
  X,
  Edit3,
  Trash2,
  ChevronUp,
  Upload,
  Sparkles,
  Calendar,
  Clock4,
  ListChecks,
  Send,
  Eye,
  BookMarked,
  UserCheck,
  HelpCircle,
  Download,
  Copy,
  TrendingUp,
  User,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import MetricCard from '../components/MetricCard.jsx'
import {
  MOCK_EVALUATOR_TESTS,
  MOCK_SUBMISSIONS,
  MOCK_RUBRIC_QUESTIONS,
  SUBJECTS,
  MOCK_USER,
} from '../services/mockData.js'

const NAV_ITEMS = [
  { id: 'home', label: 'Overview', Icon: LayoutDashboard },
  { id: 'tests', label: 'Tests & Rubrics', Icon: FileText, defaultActive: true },
  { id: 'submissions', label: 'Submissions', Icon: Users },
  { id: 'analytics', label: 'Analytics', Icon: BarChart3 },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

const STATUS_BADGE = {
  draft: 'bg-beige-100 text-charcoal-100 border-beige-200',
  published: 'bg-olive-50 text-olive-500 border-olive-400/30',
  scheduled: 'bg-terracotta-50 text-terracotta-400 border-terracotta-400/30',
  needs_review: 'bg-terracotta-50 text-terracotta-400 border-terracotta-400/30',
  graded: 'bg-olive-50 text-olive-500 border-olive-400/30',
  flagged: 'bg-white text-charcoal-300 border-charcoal-100',
}

export default function EvaluatorDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeNav, setActiveNav] = useState('tests')
  const [tab, setTab] = useState('tests') // 'tests' (list + create) | 'submissions'
  const [activeTests, setActiveTests] = useState(0)
  const [showCreate, setShowCreate] = useState(true)
  const me = user || MOCK_USER.evaluator

  return (
    <div className="min-h-screen bg-cream-100 text-charcoal-300">
      <div className="mx-auto flex max-w-[1500px] gap-6 px-4 py-5 lg:px-7 lg:py-6">
        {/* Sidebar */}
        <aside className="sticky top-5 hidden h-[calc(100vh-2.5rem)] w-64 shrink-0 flex-col rounded-4xl border border-beige-100 bg-white p-5 shadow-soft lg:flex">
          <Link to="/" className="flex items-center gap-2.5 px-1">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-olive-400 text-cream-100">
              <BookMarked className="h-4.5 w-4.5" strokeWidth={1.75} />
            </span>
            <div className="leading-tight">
              <p className="font-serif text-sm font-bold text-charcoal-300 tracking-tight">DTEP</p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-50">Faculty portal</p>
            </div>
          </Link>

          <nav className="mt-7 space-y-1">
            {NAV_ITEMS.map((item) => {
              const { Icon } = item
              const isActive = activeNav === item.id
              const willOpenSubmissions = item.id === 'submissions'
              const onClick = () => {
                setActiveNav(item.id)
                if (willOpenSubmissions) setTab('submissions')
                if (item.id === 'tests') setTab('tests')
              }
              return (
                <button
                  key={item.id}
                  onClick={onClick}
                  className={`group relative flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-olive-50 text-charcoal-300 font-semibold'
                      : 'text-charcoal-100 hover:bg-beige-50 hover:text-charcoal-300'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-olive-400" aria-hidden />
                  )}
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="rounded-3xl border border-beige-100 bg-gradient-to-br from-cream-50 to-beige-100/70 p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-terracotta-400/10 text-terracotta-400">
                  <Sparkles className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal-300">AI Grading Pilot</p>
                  <p className="text-[10px] text-charcoal-50 mt-0.5">Auto-score MCQs + descriptive rubric hints</p>
                </div>
              </div>
              <button className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-charcoal-300 py-2 text-[11px] font-semibold text-cream-100 transition-colors duration-200 hover:bg-charcoal-400">
                Try it now
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>

            {/* User profile */}
            <div className="rounded-3xl border border-beige-100 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-olive-400/15 text-sm font-bold text-olive-500">
                  {me?.avatarInitials || 'PN'}
                </div>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-sm font-bold text-charcoal-300">{me?.name}</p>
                  <p className="truncate text-[11px] text-charcoal-50">Professor · {me?.role}</p>
                </div>
              </div>
              <button
                onClick={() => { logout?.(); navigate('/login') }}
                className="mt-2.5 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-[11px] font-semibold text-charcoal-100 transition-colors duration-200 hover:bg-beige-50 hover:text-charcoal-300"
              >
                <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex min-w-0 flex-1 flex-col gap-6">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4 rounded-4xl border border-beige-100 bg-white px-5 py-3.5 shadow-soft-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-50" strokeWidth={1.75} />
                <input
                  type="text"
                  placeholder="Search tests, students, submissions…"
                  className="w-full min-w-[320px] rounded-full bg-cream-100 py-2.5 pl-10 pr-4 text-sm text-charcoal-300 placeholder:text-charcoal-50 transition-colors duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-olive-400/40"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-2xl text-charcoal-100 transition-colors duration-200 hover:bg-beige-100 hover:text-charcoal-300">
                <Bell className="h-4.5 w-4.5" strokeWidth={1.75} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-terracotta-400" />
              </button>
              <div className="hidden items-center gap-2.5 rounded-full border border-beige-100 bg-cream-50 py-1 pl-1 pr-3.5 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-olive-400/15 text-xs font-bold text-olive-500">
                  {me?.avatarInitials || 'PN'}
                </div>
                <div className="leading-tight">
                  <p className="text-[12px] font-semibold text-charcoal-300">{me?.name}</p>
                  <p className="text-[10px] text-charcoal-50">{me?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1 rounded-full border border-beige-100 bg-white p-1 shadow-soft-sm">
              {[
                { id: 'tests', label: 'Tests & Rubrics', count: MOCK_EVALUATOR_TESTS.length, Icon: FileText },
                { id: 'submissions', label: 'Submissions', count: MOCK_SUBMISSIONS.length, Icon: Users },
              ].map((t) => {
                const { Icon } = t
                const a = tab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-250 ${
                      a ? 'bg-charcoal-300 text-cream-100 shadow-soft-sm' : 'text-charcoal-100 hover:text-charcoal-300'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {t.label}
                    <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold ${a ? 'bg-white/15 text-cream-100' : 'bg-beige-100 text-charcoal-100 group-hover:bg-beige-200'}`}>
                      {t.count}
                    </span>
                  </button>
                )
              })}
            </div>
            {tab === 'tests' && (
              <button
                onClick={() => setShowCreate((s) => !s)}
                className="group inline-flex items-center gap-2 rounded-full bg-charcoal-300 px-4.5 py-2.5 text-xs font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft-lg hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                {showCreate ? 'Collapse composer' : 'Compose new test'}
              </button>
            )}
          </div>

          {/* Metrics (only when on tests tab) */}
          {tab === 'tests' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label="Tests authored"
                value={`${MOCK_EVALUATOR_TESTS.length}`}
                delta={{ value: '+2', label: 'this month', up: true }}
                accent="olive"
                Icon={FileText}
              />
              <MetricCard
                label="Active students"
                value="184"
                delta={{ value: '+6%', label: 'vs last cycle', up: true }}
                accent="charcoal"
                Icon={GraduationCap}
              />
              <MetricCard
                label="Submissions pending"
                value={`${MOCK_SUBMISSIONS.filter((s) => s.status === 'needs_review').length}`}
                delta={{ value: '3 new', label: 'in last hour', up: true }}
                accent="terracotta"
                Icon={AlertCircle}
              />
              <MetricCard
                label="Avg auto-score"
                value="76.8%"
                delta={{ value: '+2.1', label: 'vs previous', up: true }}
                accent="cream"
                Icon={TrendingUp}
              />
            </div>
          )}

          {tab === 'tests' ? (
            <>
              {/* Test creation form */}
              {showCreate && <TestComposer />}

              {/* List of existing tests */}
              <div className="rounded-4xl border border-beige-100 bg-white shadow-soft overflow-hidden">
                <div className="flex items-center justify-between border-b border-beige-100 px-6 py-4.5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-100">My tests</p>
                    <h2 className="mt-1 font-serif text-lg font-semibold text-charcoal-300">Published, drafted &amp; scheduled</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-2 rounded-full border border-beige-100 bg-cream-50 px-3 py-1.5 text-[11px] font-semibold text-charcoal-100 sm:flex">
                      <Filter className="h-3.5 w-3.5" strokeWidth={1.75} />
                      All statuses
                      <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-beige-100">
                  {MOCK_EVALUATOR_TESTS.map((t, idx) => {
                    const subj = SUBJECTS.find((s) => s.code === t.subject.code) || t.subject
                    return (
                      <div key={t.id} className="group px-6 py-5 transition-colors duration-200 hover:bg-beige-50/60">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-start gap-4 min-w-0 flex-1">
                            <span className={`mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${subj.color}`}>
                              <BookOpen className="h-5 w-5 text-white/90" strokeWidth={1.75} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-serif text-[1.05rem] font-semibold text-charcoal-300">
                                  {t.title}
                                </h3>
                                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE[t.status]}`}>
                                  {t.status === 'published' ? <CheckCircle2 className="h-3 w-3" /> : t.status === 'draft' ? <HelpCircle className="h-3 w-3" /> : <Clock4 className="h-3 w-3" />}
                                  {t.status.replace('_', ' ')}
                                </span>
                              </div>
                              <p className="mt-1 text-[12px] text-charcoal-50">
                                <span className="font-semibold text-charcoal-100">{t.subject.code}</span> · {t.subject.name} · Section {t.section || 'A'}
                              </p>

                              <div className="mt-3 grid max-w-xl grid-cols-4 gap-x-4 gap-y-1.5 text-[11px] text-charcoal-100">
                                <Stat label="Duration" value={`${t.duration} min`} Icon={Clock} />
                                <Stat label="Questions" value={`${t.questionCount || t.questions?.length || 20}`} Icon={ListChecks} />
                                <Stat label="Max marks" value={`${t.totalMarks}`} Icon={Trophy} />
                                <Stat label="Scheduled" value={t.date || '—'} Icon={Calendar} />
                              </div>

                              {idx < 2 && (
                                <div className="mt-4 flex max-w-xl items-center gap-3 rounded-2xl bg-cream-100/80 px-4 py-2.5">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-semibold text-charcoal-100">
                                      Class progress · <span className="text-charcoal-300">{t.submissions?.answered || 142} / {t.submissions?.total || 184} submitted</span>
                                    </p>
                                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-beige-200">
                                      <div
                                        className="h-full rounded-full bg-gradient-to-r from-olive-300 to-olive-400"
                                        style={{ width: `${((t.submissions?.answered || 142) / (t.submissions?.total || 184)) * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => setTab('submissions')}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-charcoal-200 border border-beige-100 transition-colors duration-200 hover:text-charcoal-300 hover:border-beige-200"
                                  >
                                    <Eye className="h-3 w-3" strokeWidth={1.75} />
                                    View submissions
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-beige-200 bg-white px-3.5 py-2 text-[11px] font-semibold text-charcoal-100 transition-colors duration-200 hover:border-beige-300 hover:text-charcoal-300">
                              <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
                              Duplicate
                            </button>
                            <button className="inline-flex items-center gap-1.5 rounded-full border border-beige-200 bg-white px-3.5 py-2 text-[11px] font-semibold text-charcoal-100 transition-colors duration-200 hover:border-beige-300 hover:text-charcoal-300">
                              <Edit3 className="h-3.5 w-3.5" strokeWidth={1.75} />
                              Edit
                            </button>
                            <button className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-beige-100 text-charcoal-50 transition-colors duration-200 hover:bg-terracotta-50 hover:border-terracotta-400/30 hover:text-terracotta-400">
                              <MoreHorizontal className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <SubmissionsView />
          )}

          <footer className="mt-4 mb-8 flex items-center justify-between px-3 text-[11px] text-charcoal-50">
            <span>© {new Date().getFullYear()} DTEP — Faculty workspace</span>
            <div className="flex items-center gap-4">
              <span>v2.4.0</span>
              <span>Last synced · just now</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

function Stat({ label, value, Icon }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-charcoal-50" strokeWidth={1.75} />
      <span className="font-semibold text-charcoal-300">{value}</span>
      <span className="text-charcoal-50">{label}</span>
    </div>
  )
}

function TestComposer() {
  const [form, setForm] = useState({
    title: 'Data Structures & Algorithms — Midterm (Practice)',
    subject: 'CS301',
    duration: '60',
    totalMarks: '40',
    positive: '1',
    negative: '0.25',
    scheduled: '2026-03-20T09:30',
    windowEnd: '2026-03-20T11:30',
    section: 'A',
    instructions: true,
  })
  const [questions, setQuestions] = useState(MOCK_RUBRIC_QUESTIONS.map((q) => ({ ...q })))
  const [expandIdx, setExpandIdx] = useState(0)
  const totalMarks = useMemo(() => questions.reduce((s, q) => s + Number(q.marks || 0), 0), [questions])

  const updateField = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const updateQ = (i, k, v) => setQuestions((qs) => qs.map((q, idx) => (idx === i ? { ...q, [k]: v } : q)))
  const updateQOption = (qi, oi, v) =>
    setQuestions((qs) =>
      qs.map((q, idx) =>
        idx === qi ? { ...q, options: q.options.map((o, oi2) => (oi2 === oi ? { ...o, label: v } : o)) } : q,
      ),
    )
  const removeQ = (i) => setQuestions((qs) => qs.filter((_, idx) => idx !== i))
  const addQ = () =>
    setQuestions((qs) => [
      ...qs,
      {
        id: 'q_' + Math.random().toString(36).slice(2, 7),
        number: qs.length + 1,
        text: '',
        marks: 2,
        difficulty: 'medium',
        chapter: 'New chapter',
        options: [
          { key: 'A', label: '' },
          { key: 'B', label: '' },
          { key: 'C', label: '' },
          { key: 'D', label: '' },
        ],
        correctKey: 'A',
        explanation: '',
      },
    ])

  return (
    <div className="overflow-hidden rounded-4xl border border-beige-100 bg-white shadow-soft animate-fade-in-up">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-beige-100 bg-gradient-to-r from-cream-50 via-white to-cream-50 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-olive-400/15 text-olive-500">
            <Edit3 className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-olive-500">New test · Composer</p>
            <h2 className="mt-0.5 font-serif text-xl font-semibold text-charcoal-300 leading-tight">
              Design a rigorous assessment with structured rubrics.
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-full border border-beige-200 bg-white px-4 py-2.5 text-[11px] font-semibold text-charcoal-100 transition-colors duration-200 hover:border-beige-300 hover:text-charcoal-300">
            <Upload className="h-3.5 w-3.5" strokeWidth={1.75} />
            Import Qs
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-beige-200 bg-white px-4 py-2.5 text-[11px] font-semibold text-charcoal-100 transition-colors duration-200 hover:border-beige-300 hover:text-charcoal-300">
            Save draft
          </button>
          <button className="group inline-flex items-center gap-1.5 rounded-full bg-olive-400 px-4 py-2.5 text-[11px] font-semibold text-cream-100 transition-all duration-300 hover:bg-olive-500 hover:shadow-soft-lg hover:-translate-y-0.5">
            <Send className="h-3.5 w-3.5" strokeWidth={2} />
            Publish &amp; schedule
          </button>
        </div>
      </div>

      {/* form */}
      <div className="grid gap-6 p-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left: metadata */}
        <div className="space-y-5">
          <SectionTitle icon={FileText} title="Test details" subtitle="Identity and delivery window" />
          <div className="grid grid-cols-1 gap-4">
            <Field label="Title" required>
              <input
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full rounded-2xl border border-beige-200 bg-white px-4 py-3 text-sm font-medium text-charcoal-300 placeholder:text-charcoal-50 transition-colors duration-200 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                placeholder="e.g. Linear Algebra — Quiz 1"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Subject" required>
                <div className="relative">
                  <select
                    value={form.subject}
                    onChange={(e) => updateField('subject', e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-beige-200 bg-white px-4 py-3 pr-9 text-sm font-medium text-charcoal-300 transition-colors duration-200 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} · {s.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-100" strokeWidth={1.75} />
                </div>
              </Field>
              <Field label="Section / Batch">
                <input
                  value={form.section}
                  onChange={(e) => updateField('section', e.target.value)}
                  className="w-full rounded-2xl border border-beige-200 bg-white px-4 py-3 text-sm font-medium text-charcoal-300 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Duration (minutes)" required>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-50" strokeWidth={1.75} />
                  <input
                    value={form.duration}
                    onChange={(e) => updateField('duration', e.target.value)}
                    type="number"
                    min={5}
                    className="w-full rounded-2xl border border-beige-200 bg-white pl-10 pr-4 py-3 text-sm font-medium text-charcoal-300 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                  />
                </div>
              </Field>
              <Field label="Max marks">
                <div className="relative">
                  <Trophy className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-50" strokeWidth={1.75} />
                  <input
                    value={form.totalMarks}
                    onChange={(e) => updateField('totalMarks', e.target.value)}
                    type="number"
                    className="w-full rounded-2xl border border-beige-200 bg-white pl-10 pr-4 py-3 text-sm font-medium text-charcoal-300 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                  />
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Marking · Positive">
                <input
                  value={form.positive}
                  onChange={(e) => updateField('positive', e.target.value)}
                  className="w-full rounded-2xl border border-beige-200 bg-white px-4 py-3 text-sm font-medium text-charcoal-300 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                />
              </Field>
              <Field label="Marking · Negative">
                <input
                  value={form.negative}
                  onChange={(e) => updateField('negative', e.target.value)}
                  className="w-full rounded-2xl border border-beige-200 bg-white px-4 py-3 text-sm font-medium text-charcoal-300 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Starts at">
                <input
                  type="datetime-local"
                  value={form.scheduled}
                  onChange={(e) => updateField('scheduled', e.target.value)}
                  className="w-full rounded-2xl border border-beige-200 bg-white px-4 py-3 text-sm font-medium text-charcoal-300 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                />
              </Field>
              <Field label="Window closes">
                <input
                  type="datetime-local"
                  value={form.windowEnd}
                  onChange={(e) => updateField('windowEnd', e.target.value)}
                  className="w-full rounded-2xl border border-beige-200 bg-white px-4 py-3 text-sm font-medium text-charcoal-300 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                />
              </Field>
            </div>
          </div>

          <SectionTitle icon={Sparkles} title="Rubric summary" />
          <div className="grid grid-cols-3 gap-3">
            <MiniStat k="Questions" v={`${questions.length}`} tone="olive" />
            <MiniStat k="Marks (Qs)" v={`${totalMarks}`} tone="charcoal" />
            <MiniStat k="Weighted" v={form.totalMarks} tone="terracotta" />
          </div>
        </div>

        {/* Right: Questions manager */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionTitle icon={ListChecks} title="Questions manager" subtitle="Add, edit, reorder, and set correct keys" noMargin />
            <button
              onClick={addQ}
              className="group inline-flex items-center gap-1.5 rounded-full border border-dashed border-olive-400/50 bg-olive-50 px-3.5 py-2 text-[11px] font-semibold text-olive-500 transition-all duration-200 hover:border-olive-400 hover:bg-olive-50/80"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Add question
            </button>
          </div>

          <div className="max-h-[640px] overflow-y-auto pr-1 space-y-3 rounded-3xl border border-beige-100 bg-cream-50/60 p-3.5 custom-scroll">
            {questions.map((q, i) => {
              const isOpen = i === expandIdx
              return (
                <div
                  key={q.id}
                  className={`overflow-hidden rounded-3xl border transition-all duration-300 ${
                    isOpen ? 'border-olive-400/40 bg-white shadow-soft-sm' : 'border-beige-100 bg-white hover:border-beige-200'
                  }`}
                >
                  {/* header */}
                  <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[12px] font-bold ${
                        isOpen ? 'bg-charcoal-300 text-cream-100' : 'bg-beige-100 text-charcoal-200'
                      }`}>
                        {q.number || i + 1}
                      </span>
                      <div className="min-w-0 leading-tight flex-1">
                        <p className={`truncate text-sm ${isOpen ? 'font-semibold text-charcoal-300' : 'text-charcoal-200'}`}>
                          {q.text || 'Untitled question — click to add content'}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-charcoal-50">
                          <span className="inline-flex items-center gap-1 rounded-full bg-beige-100 px-2 py-0.5 font-semibold">
                            <Trophy className="h-3 w-3" strokeWidth={2} />
                            {q.marks} marks
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-beige-100 px-2 py-0.5 font-semibold capitalize">
                            {q.difficulty}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-beige-100 px-2 py-0.5 font-semibold">
                            {q.chapter}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => removeQ(i)}
                        title="Remove question"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-charcoal-50 transition-colors duration-200 hover:bg-terracotta-50 hover:text-terracotta-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => setExpandIdx(isOpen ? -1 : i)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-charcoal-100 transition-colors duration-200 hover:bg-beige-100 hover:text-charcoal-300"
                      >
                        {isOpen ? <ChevronUp className="h-4 w-4" strokeWidth={2} /> : <ChevronDown className="h-4 w-4" strokeWidth={2} />}
                      </button>
                    </div>
                  </div>

                  {/* body */}
                  {isOpen && (
                    <div className="space-y-4 border-t border-beige-100 bg-cream-50/40 px-4 py-4 animate-fade-in">
                      <textarea
                        value={q.text}
                        onChange={(e) => updateQ(i, 'text', e.target.value)}
                        rows={2}
                        placeholder="Enter the question stem here…"
                        className="w-full resize-none rounded-2xl border border-beige-200 bg-white px-4 py-3 text-sm font-medium text-charcoal-300 placeholder:text-charcoal-50 transition-colors duration-200 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                      />

                      <div className="grid grid-cols-3 gap-3">
                        <Field label="Marks">
                          <input
                            type="number"
                            value={q.marks}
                            onChange={(e) => updateQ(i, 'marks', e.target.value)}
                            className="w-full rounded-2xl border border-beige-200 bg-white px-3.5 py-2.5 text-sm font-medium text-charcoal-300 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                          />
                        </Field>
                        <Field label="Difficulty">
                          <div className="relative">
                            <select
                              value={q.difficulty}
                              onChange={(e) => updateQ(i, 'difficulty', e.target.value)}
                              className="w-full appearance-none rounded-2xl border border-beige-200 bg-white px-3.5 py-2.5 pr-9 text-sm font-medium text-charcoal-300 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                            >
                              {['easy', 'medium', 'hard', 'expert'].map((d) => (
                                <option key={d}>{d}</option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal-50" strokeWidth={1.75} />
                          </div>
                        </Field>
                        <Field label="Chapter">
                          <input
                            value={q.chapter}
                            onChange={(e) => updateQ(i, 'chapter', e.target.value)}
                            className="w-full rounded-2xl border border-beige-200 bg-white px-3.5 py-2.5 text-sm font-medium text-charcoal-300 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                          />
                        </Field>
                      </div>

                      {/* Options */}
                      <div className="space-y-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-100">Options · click to set the correct key</p>
                        <div className="space-y-2">
                          {q.options.map((o, oi) => {
                            const correct = o.key === q.correctKey
                            return (
                              <div key={o.key} className="group flex items-center gap-3 rounded-2xl border p-1.5 pr-1.5 transition-colors duration-200 border-beige-100 bg-white hover:border-beige-200">
                                <button
                                  onClick={() => updateQ(i, 'correctKey', o.key)}
                                  title={`Set ${o.key} as correct answer`}
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 text-[11px] font-bold transition-all duration-200 ${
                                    correct
                                      ? 'border-olive-400 bg-olive-400 text-cream-100 shadow-soft-sm'
                                      : 'border-beige-200 bg-white text-charcoal-100 hover:border-olive-400/60 hover:text-olive-500'
                                  }`}
                                >
                                  {o.key}
                                  {correct && <CheckCircle2 className="absolute ml-5 mt-4 h-3.5 w-3.5 text-olive-400" strokeWidth={2.5} />}
                                </button>
                                <input
                                  value={o.label}
                                  onChange={(e) => updateQOption(i, oi, e.target.value)}
                                  placeholder={`Option ${o.key} — ${correct ? 'the correct answer' : 'distractor'}`}
                                  className="flex-1 bg-transparent px-2 py-2 text-sm text-charcoal-300 placeholder:text-charcoal-50 focus:outline-none"
                                />
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <Field label="Explanation (shown post-review)">
                        <textarea
                          value={q.explanation || ''}
                          onChange={(e) => updateQ(i, 'explanation', e.target.value)}
                          rows={2}
                          placeholder="Help students understand why the correct answer is right, and why the distractors are wrong."
                          className="w-full resize-none rounded-2xl border border-beige-200 bg-white px-4 py-3 text-sm text-charcoal-200 placeholder:text-charcoal-50 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
                        />
                      </Field>
                    </div>
                  )}
                </div>
              )
            })}

            <button
              onClick={addQ}
              className="group flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-beige-200 bg-white/60 px-4 py-4 text-[12px] font-semibold text-charcoal-100 transition-all duration-250 hover:border-olive-400/60 hover:bg-olive-50/40 hover:text-olive-500"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              Add another question
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmissionsView() {
  const [filter, setFilter] = useState('all') // all | needs_review | flagged | graded
  const [search, setSearch] = useState('')
  const items = useMemo(() => {
    const base = MOCK_SUBMISSIONS.filter((s) => {
      if (filter !== 'all' && s.status !== filter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          s.student.name.toLowerCase().includes(q) ||
          s.student.roll.toLowerCase().includes(q) ||
          s.test.title.toLowerCase().includes(q)
        )
      }
      return true
    })
    return base
  }, [filter, search])

  const counts = {
    all: MOCK_SUBMISSIONS.length,
    needs_review: MOCK_SUBMISSIONS.filter((s) => s.status === 'needs_review').length,
    flagged: MOCK_SUBMISSIONS.filter((s) => s.status === 'flagged').length,
    graded: MOCK_SUBMISSIONS.filter((s) => s.status === 'graded').length,
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filters */}
      <div className="rounded-4xl border border-beige-100 bg-white p-5 shadow-soft-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex flex-wrap items-center gap-1 rounded-full border border-beige-100 bg-cream-50 p-1">
            {[
              { id: 'all', label: 'All submissions' },
              { id: 'needs_review', label: 'Needs review' },
              { id: 'flagged', label: 'Flagged' },
              { id: 'graded', label: 'Graded' },
            ].map((f) => {
              const a = filter === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold transition-all duration-250 ${
                    a ? 'bg-charcoal-300 text-cream-100 shadow-soft-sm' : 'text-charcoal-100 hover:text-charcoal-300'
                  }`}
                >
                  {f.label}
                  <span className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    a ? 'bg-white/15 text-cream-100' : 'bg-white border border-beige-100 text-charcoal-100 group-hover:bg-beige-100'
                  }`}>
                    {counts[f.id]}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal-50" strokeWidth={1.75} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student, roll, or test…"
                className="w-64 rounded-full border border-beige-100 bg-white py-2 pl-9 pr-3 text-xs font-medium text-charcoal-300 placeholder:text-charcoal-50 focus:border-olive-400 focus:bg-olive-50/20 focus:outline-none focus:ring-2 focus:ring-olive-400/30"
              />
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-beige-200 bg-white px-3.5 py-2 text-[11px] font-semibold text-charcoal-100 transition-colors duration-200 hover:border-beige-300 hover:text-charcoal-300">
              <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-4xl border border-beige-100 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-cream-50/80 text-[10px] uppercase tracking-[0.12em] text-charcoal-50">
                <th className="px-5 py-4 font-bold">Student</th>
                <th className="px-5 py-4 font-bold">Test</th>
                <th className="px-5 py-4 font-bold">Time taken</th>
                <th className="px-5 py-4 font-bold">Score</th>
                <th className="px-5 py-4 font-bold">Percentile</th>
                <th className="px-5 py-4 font-bold">Status</th>
                <th className="px-5 py-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100 text-sm">
              {items.map((s) => {
                const pct = Math.round((s.autoScore / s.maxScore) * 100)
                return (
                  <tr key={s.id} className="transition-colors duration-200 hover:bg-beige-50/60">
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center gap-3 min-w-[180px]">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-olive-400/15 text-xs font-bold text-olive-500">
                          {s.student.avatarInitials}
                        </div>
                        <div className="min-w-0 leading-tight">
                          <p className="font-semibold text-charcoal-300 truncate">{s.student.name}</p>
                          <p className="text-[11px] text-charcoal-50">
                            Roll <span className="font-semibold text-charcoal-100">{s.student.roll}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-middle max-w-[240px]">
                      <p className="font-medium text-charcoal-200 truncate">{s.test.title}</p>
                      <p className="text-[11px] text-charcoal-50 mt-0.5">
                        <span className="font-semibold text-charcoal-100">{s.test.subject.code}</span> · Submitted {s.submittedAt}
                      </p>
                    </td>
                    <td className="px-5 py-4 align-middle tabular-nums text-charcoal-200">
                      {s.timeTaken}
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center gap-3 min-w-[150px]">
                        <div className="flex-1 min-w-0">
                          <p className="font-serif font-bold text-charcoal-300 tabular-nums">
                            {s.autoScore}<span className="text-[11px] text-charcoal-50 font-medium"> / {s.maxScore}</span>
                          </p>
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-beige-100">
                            <div
                              className={`h-full rounded-full ${pct >= 70 ? 'bg-gradient-to-r from-olive-300 to-olive-400' : pct >= 50 ? 'bg-gradient-to-r from-beige-200 to-charcoal-100' : 'bg-gradient-to-r from-terracotta-300 to-terracotta-400'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <span className="inline-flex items-center gap-1 rounded-full bg-cream-100 px-3 py-1 text-[11px] font-bold text-charcoal-200 tabular-nums">
                        <TrendingUp className="h-3 w-3 text-olive-500" strokeWidth={2} />
                        {s.percentile}th
                      </span>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE[s.status]}`}>
                          {s.status === 'needs_review' ? <AlertCircle className="h-3 w-3" /> : s.status === 'graded' ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                          {s.status.replace('_', ' ')}
                        </span>
                        {s.flags?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {s.flags.map((f) => (
                              <span key={f} className="inline-flex items-center gap-1 rounded-full bg-terracotta-50 text-terracotta-400 border border-terracotta-400/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider">
                                <AlertCircle className="h-2.5 w-2.5" strokeWidth={2} />
                                {f.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-middle text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button className="inline-flex items-center gap-1.5 rounded-full border border-beige-200 bg-white px-3 py-2 text-[10px] font-semibold text-charcoal-100 transition-colors duration-200 hover:border-beige-300 hover:text-charcoal-300">
                          <Eye className="h-3 w-3" strokeWidth={1.75} />
                          Review
                        </button>
                        <button className="group inline-flex h-8 w-8 items-center justify-center rounded-full border border-beige-100 text-charcoal-50 transition-colors duration-200 hover:bg-beige-100 hover:text-charcoal-300">
                          <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-beige-100 px-5 py-4 text-[11px] text-charcoal-50">
          <span>Showing <span className="font-semibold text-charcoal-200">{items.length}</span> of <span className="font-semibold text-charcoal-200">{MOCK_SUBMISSIONS.length}</span> submissions</span>
          <div className="flex items-center gap-1.5">
            <button className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-beige-200 bg-white text-charcoal-50 transition-colors duration-200 hover:bg-beige-50 hover:text-charcoal-200">
              <ChevronDown className="h-3.5 w-3.5 rotate-90" strokeWidth={2} />
            </button>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-charcoal-300 text-cream-100 text-[11px] font-bold">1</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl text-charcoal-100 font-semibold hover:bg-beige-50 cursor-pointer">2</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl text-charcoal-100 font-semibold hover:bg-beige-50 cursor-pointer">3</span>
            <button className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-beige-200 bg-white text-charcoal-50 transition-colors duration-200 hover:bg-beige-50 hover:text-charcoal-200">
              <ChevronDown className="h-3.5 w-3.5 -rotate-90" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ icon: Icon, title, subtitle, noMargin }) {
  return (
    <div className={noMargin ? 'mb-0' : ''}>
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-beige-100 text-olive-500">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-charcoal-300">{title}</p>
          {subtitle && <p className="text-[11px] text-charcoal-50 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children, required }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-100 flex items-center gap-1">
        {label}
        {required && <span className="text-terracotta-400 text-[13px] leading-none">*</span>}
      </span>
      {children}
    </label>
  )
}

function MiniStat({ k, v, tone }) {
  const bg = tone === 'olive' ? 'from-olive-50 to-olive-400/10 border-olive-400/20' : tone === 'terracotta' ? 'from-terracotta-50 to-terracotta-400/10 border-terracotta-400/20' : 'from-cream-50 to-beige-100 border-beige-200'
  const num = tone === 'olive' ? 'text-olive-500' : tone === 'terracotta' ? 'text-terracotta-400' : 'text-charcoal-300'
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${bg} border p-3`}>
      <p className={`font-serif text-xl font-bold tabular-nums ${num}`}>{v}</p>
      <p className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-50 mt-0.5">{k}</p>
    </div>
  )
}
