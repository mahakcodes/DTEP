import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Bell,
  Calendar,
  Clock,
  ChevronRight,
  GraduationCap,
  User,
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Star,
  Award,
  BarChart2,
  MoreHorizontal,
  Plus,
  LogOut,
  LayoutDashboard,
  FileCheck2,
  FolderOpen,
  Settings,
  Trophy,
} from 'lucide-react'
import MetricCard from '../components/MetricCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { MOCK_USER, MOCK_TESTS, SUBJECTS } from '../services/mockData.js'

const subjectTone = {
  olive: 'bg-olive-50 text-olive-500',
  terracotta: 'bg-terracotta-50 text-terracotta-400',
  charcoal: 'bg-charcoal-300/10 text-charcoal-300',
  beige: 'bg-beige-100 text-charcoal-200',
}

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const me = user || MOCK_USER.student
  const [filter, setFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('upcoming')

  const allCompleted = MOCK_TESTS.completed
  const completedAvg = allCompleted.reduce((s, t) => s + (t.score / t.maxScore) * 100, 0) / allCompleted.length

  const upcomingRows = [
    { ...MOCK_TESTS.upcoming[0], badge: 'tomorrow', tone: 'urgent' },
    { ...MOCK_TESTS.upcoming[1], badge: 'in 4 days', tone: 'upcoming' },
    ...MOCK_TESTS.active.map((t) => ({ ...t, badge: 'Available now', tone: 'active' })),
  ]

  const filteredUpcoming = upcomingRows.filter((t) => {
    if (filter === 'all') return true
    if (filter === 'active') return t.status === 'active'
    if (filter === 'upcoming') return t.status === 'upcoming'
    return true
  })

  const tabs = [
    { key: 'upcoming', label: 'Upcoming / Active', count: upcomingRows.length },
    { key: 'completed', label: 'Past Tests & Scores', count: MOCK_TESTS.completed.length },
    { key: 'analysis', label: 'Performance Analysis' },
  ]

  const statusPill = {
    urgent: 'bg-terracotta-400/10 text-terracotta-400 border-terracotta-400/20',
    upcoming: 'bg-beige-100 text-charcoal-200 border-beige-200',
    active: 'bg-olive-50 text-olive-500 border-olive-400/20',
  }

  const nav = [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/student/tests', label: 'My Tests', icon: FileCheck2 },
    { to: '/student/library', label: 'Practice Bank', icon: FolderOpen },
    { to: '/student/reports', label: 'Reports', icon: BarChart2 },
    { to: '/student/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-cream-100 text-charcoal-300">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden lg:flex w-72 flex-col border-r border-beige-100 bg-cream-100">
        <div className="flex h-20 items-center gap-3 px-7 border-b border-beige-100/60">
          <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-olive-400 transition-transform duration-300 hover:scale-105">
            <svg viewBox="0 0 24 24" className="h-5.5 w-5.5 text-cream-100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 18L13 6L18 18H8Z" strokeLinejoin="round" />
            </svg>
          </Link>
          <div className="leading-none">
            <p className="font-serif text-lg font-semibold tracking-tight">DTEP</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-charcoal-50 mt-0.5">Student Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {nav.map((n) => {
            const Icon = n.icon
            return (
              <Link
                key={n.to}
                to={n.to}
                className="group relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-charcoal-100 transition-all duration-200 hover:bg-beige-50 hover:text-charcoal-300"
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
                {n.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-beige-100/60">
          <div className="rounded-3xl border border-beige-100 bg-white p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-olive-300 to-olive-400 text-sm font-semibold text-cream-100">
                <User className="h-5.5 w-5.5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-charcoal-300 truncate">{me.name}</p>
                <p className="text-xs text-charcoal-50 truncate">{me.program}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-cream-100 p-3">
                <p className="font-serif text-2xl font-semibold text-olive-500">{me.stats.streak}</p>
                <p className="text-[10px] uppercase tracking-wider text-charcoal-50 mt-0.5 font-semibold">Day streak</p>
              </div>
              <div className="rounded-2xl bg-cream-100 p-3">
                <p className="font-serif text-2xl font-semibold text-charcoal-300">{me.stats.percentile}<span className="text-sm">th</span></p>
                <p className="text-[10px] uppercase tracking-wider text-charcoal-50 mt-0.5 font-semibold">Percentile</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-semibold text-charcoal-100 transition-colors duration-200 hover:bg-beige-50 hover:text-terracotta-400"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:pl-72">
        {/* Topbar */}
        <div className="sticky top-0 z-30 border-b border-beige-100/60 bg-cream-100/80 backdrop-blur-md">
          <div className="mx-auto flex h-20 items-center justify-between gap-4 px-6 lg:px-10">
            <div className="flex flex-1 items-center gap-4 max-w-xl">
              <Link to="/" className="lg:hidden flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-olive-400">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-cream-100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 18L13 6L18 18H8Z" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-serif text-lg font-semibold text-charcoal-300">DTEP</span>
              </Link>
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-charcoal-50" strokeWidth={1.75} />
                <input
                  type="search"
                  placeholder="Search tests, subjects, past results…"
                  className="h-12 w-full rounded-full border border-beige-200 bg-cream-50/60 pl-11 pr-4 text-sm text-charcoal-300 placeholder:text-charcoal-50 outline-none transition-all duration-200 focus:border-olive-300 focus:bg-white focus:shadow-soft"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-charcoal-100 transition-colors duration-200 hover:bg-beige-100 hover:text-charcoal-300">
                <Bell className="h-5 w-5" strokeWidth={1.75} />
                <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-terracotta-400 ring-2 ring-cream-100" />
              </button>
              <div className="ml-2 h-8 w-px bg-beige-200" />
              <div className="hidden sm:flex items-center gap-3 rounded-full py-1 pr-2 pl-1 transition-colors duration-200 hover:bg-beige-50 cursor-pointer">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-olive-300 to-olive-400 text-xs font-semibold text-cream-100">
                  {me.avatarInitials || me.name.split(' ').map((w) => w[0]).join('')}
                </div>
                <div className="text-left leading-none">
                  <p className="text-sm font-semibold text-charcoal-300">{me.name.split(' ')[0]}</p>
                  <p className="text-[10px] capitalize text-charcoal-50 mt-0.5">Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-none px-6 py-10 lg:px-10 lg:py-12 space-y-10">
          {/* Header + greet */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-olive-500">Dashboard</p>
              <h1 className="mt-2 font-serif text-h1 font-semibold tracking-tight text-charcoal-300">
                Hi {me.name.split(' ')[0]}, <span className="italic text-olive-500">let&apos;s keep the streak.</span>
              </h1>
              <p className="mt-2.5 text-sm text-charcoal-100">
                You have <span className="font-semibold text-terracotta-400">1 test tomorrow</span> and <span className="font-semibold text-charcoal-300">3 active</span> assignments in progress.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-full border border-beige-200 bg-white px-4 py-2.5 text-sm font-medium text-charcoal-200 transition-all duration-200 hover:border-beige-300 hover:shadow-soft">
                <Calendar className="h-4 w-4" strokeWidth={1.75} />
                This semester
              </button>
              <Link
                to="/test/t_cs301_mid"
                className="group inline-flex items-center gap-2 rounded-full bg-olive-400 px-5 py-2.5 text-sm font-semibold text-cream-100 transition-all duration-300 hover:bg-olive-500 hover:shadow-soft-lg hover:-translate-y-0.5"
              >
                <PlayCircle className="h-4 w-4" strokeWidth={1.75} />
                Start practice test
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.75} />
              </Link>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Tests completed"
              value={`${MOCK_TESTS.completed.length}`}
              sub={`Avg score ${completedAvg.toFixed(0)}% across all tests`}
              accent="charcoal"
              delta={{ positive: true, value: '+3 this month' }}
            />
            <MetricCard
              label="Average score"
              value={`${completedAvg.toFixed(1)}%`}
              sub="Weighted by marks, updated today"
              accent="olive"
              delta={{ positive: true, value: '2.1 pts' }}
            />
            <MetricCard
              label="Pending reviews"
              value={`${MOCK_TESTS.upcoming.length + 1}`}
              sub="2 tests require action this week"
              accent="terracotta"
              delta={{ positive: false, value: '1 due tomorrow' }}
            />
            <MetricCard
              label="Class percentile"
              value={`${me.stats.percentile}th`}
              sub="Top 13% of your cohort this semester"
              accent="olive"
              delta={{ positive: true, value: '+4 rank' }}
            />
          </div>

          {/* Tabs + filter */}
          <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-2 rounded-full border border-beige-100 bg-white p-1.5 shadow-soft-sm">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                      activeTab === t.key
                        ? 'bg-charcoal-300 text-cream-100 shadow-soft'
                        : 'text-charcoal-100 hover:text-charcoal-300 hover:bg-beige-50'
                    }`}
                  >
                    {t.label}
                    {t.count !== undefined && (
                      <span
                        className={`inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-[10px] font-bold ${
                          activeTab === t.key ? 'bg-cream-100/20 text-cream-50' : 'bg-beige-100 text-charcoal-100'
                        }`}
                      >
                        {t.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {activeTab === 'upcoming' && (
                <div className="flex items-center gap-2">
                  {['all', 'active', 'upcoming'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors duration-200 ${
                        filter === f ? 'bg-olive-50 text-olive-500' : 'text-charcoal-100 hover:bg-beige-50 hover:text-charcoal-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming */}
            {activeTab === 'upcoming' && (
              <div className="grid gap-5 md:grid-cols-2">
                {filteredUpcoming.map((t) => {
                  const subj = t.subject
                  return (
                    <div
                      key={t.id}
                      className="group relative overflow-hidden rounded-4xl border border-beige-100 bg-white p-7 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-soft-lg"
                    >
                      <div className={`absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full opacity-50 blur-2xl ${
                        subj.color === 'olive' ? 'bg-olive-200' : subj.color === 'terracotta' ? 'bg-terracotta-100' : 'bg-beige-200'
                      }`} aria-hidden />
                      <div className="relative">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${subjectTone[subj.color]}`}>
                              <FileText className="h-6 w-6" strokeWidth={1.75} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] uppercase tracking-[0.12em] font-semibold text-charcoal-50">{subj.code}</span>
                                <span
                                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusPill[t.tone]}`}
                                >
                                  {t.badge}
                                </span>
                              </div>
                              <h3 className="mt-1 font-serif text-xl font-semibold text-charcoal-300 truncate pr-1">{t.title}</h3>
                            </div>
                          </div>
                          <button className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-charcoal-50 transition-colors duration-200 hover:bg-beige-50 hover:text-charcoal-300">
                            <MoreHorizontal className="h-4.5 w-4.5" strokeWidth={1.75} />
                          </button>
                        </div>

                        <dl className="mt-6 grid grid-cols-3 gap-3">
                          <div className="rounded-2xl bg-cream-100 p-3">
                            <dt className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-50">Duration</dt>
                            <dd className="mt-1 font-serif text-lg font-semibold text-charcoal-300">{t.duration}<span className="text-[11px] text-charcoal-50 ml-1">min</span></dd>
                          </div>
                          <div className="rounded-2xl bg-cream-100 p-3">
                            <dt className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-50">Questions</dt>
                            <dd className="mt-1 font-serif text-lg font-semibold text-charcoal-300">{t.totalQuestions}</dd>
                          </div>
                          <div className="rounded-2xl bg-cream-100 p-3">
                            <dt className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-50">Marks</dt>
                            <dd className="mt-1 font-serif text-lg font-semibold text-charcoal-300">{t.totalMarks}</dd>
                          </div>
                        </dl>

                        <div className="mt-6 flex items-center gap-3 text-xs text-charcoal-100">
                          <Calendar className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.75} />
                          <span>{t.scheduledAt || t.startedAt}</span>
                          <span className="text-beige-200">·</span>
                          <Clock className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.75} />
                          <span>{t.windowCloses || t.expiresAt}</span>
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-3">
                          {t.tone === 'urgent' && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-400">
                              <AlertTriangle className="h-3.5 w-3.5" strokeWidth={1.75} />
                              Remember to revise
                            </span>
                          )}
                          {t.tone === 'active' && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-olive-500">
                              <PlayCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
                              Resume anytime
                            </span>
                          )}
                          {t.tone === 'upcoming' && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-100">
                              <Star className="h-3.5 w-3.5 text-terracotta-400" fill="currentColor" />
                              12 topic suggestions
                            </span>
                          )}
                          <Link
                            to={t.status === 'upcoming' && t.tone !== 'urgent' ? '#' : '/test/t_cs301_mid'}
                            onClick={(e) => {
                              if (t.status === 'upcoming' && t.tone !== 'urgent') {
                                e.preventDefault()
                              }
                            }}
                            className={`ml-auto group inline-flex items-center gap-2 rounded-full px-4.5 py-2.5 text-xs font-semibold transition-all duration-300 ${
                              t.status === 'upcoming' && t.tone !== 'urgent'
                                ? 'bg-beige-100 text-charcoal-100 cursor-not-allowed'
                                : 'bg-charcoal-300 text-cream-100 hover:bg-charcoal-400 hover:shadow-soft hover:-translate-y-0.5'
                            }`}
                          >
                            {t.status === 'upcoming' && t.tone !== 'urgent' ? 'Not open yet' : t.status === 'active' ? 'Resume test' : 'Start test'}
                            {t.status === 'upcoming' && t.tone !== 'urgent' ? null : (
                              <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2} />
                            )}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Past Tests */}
            {activeTab === 'completed' && (
              <div className="overflow-hidden rounded-4xl border border-beige-100 bg-white shadow-soft">
                <div className="flex items-center justify-between px-7 py-6 border-b border-beige-100">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-charcoal-300">Past tests &amp; scores</h3>
                    <p className="mt-1 text-sm text-charcoal-50">Graded results with per-question feedback and ranking</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-olive-50 px-3.5 py-1.5 text-xs font-semibold text-olive-500">
                    <Award className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {MOCK_TESTS.completed.length} graded
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-cream-100/60">
                        <th className="px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50">Test</th>
                        <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50">Submitted</th>
                        <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50 text-right">Score</th>
                        <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50">Grade</th>
                        <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50">Percentile</th>
                        <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50">Class Rank</th>
                        <th className="px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_TESTS.completed.map((t) => {
                        const pct = (t.score / t.maxScore) * 100
                        const grade = pct >= 90 ? { l: 'A+', c: 'bg-olive-50 text-olive-500', ic: CheckCircle2, it: 'text-olive-500' }
                          : pct >= 80 ? { l: 'A', c: 'bg-olive-50 text-olive-400', ic: TrendingUp, it: 'text-olive-400' }
                          : pct >= 70 ? { l: 'B+', c: 'bg-beige-100 text-charcoal-200', ic: TrendingUp, it: 'text-charcoal-200' }
                          : { l: 'B', c: 'bg-terracotta-50 text-terracotta-400', ic: TrendingDown, it: 'text-terracotta-400' }
                        return (
                          <tr key={t.id} className="group border-t border-beige-100/60 transition-colors duration-200 hover:bg-cream-50/40">
                            <td className="px-7 py-5">
                              <div className="flex items-center gap-3 min-w-[280px]">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${subjectTone[t.subject.color]}`}>
                                  <Trophy className="h-5 w-5" strokeWidth={1.75} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-charcoal-300 truncate">{t.title}</p>
                                  <p className="text-xs text-charcoal-50 mt-0.5 flex items-center gap-1.5">
                                    {t.subject.code} · Graded by <span className="font-medium text-charcoal-100">{t.gradedBy}</span>
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <div className="text-sm text-charcoal-300">{t.submittedAt}</div>
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex items-center justify-end gap-4">
                                <div className="w-24 h-1.5 overflow-hidden rounded-full bg-beige-100">
                                  <div
                                    className={`h-full rounded-full ${pct >= 80 ? 'bg-gradient-to-r from-olive-300 to-olive-400' : pct >= 70 ? 'bg-beige-300' : 'bg-gradient-to-r from-terracotta-300 to-terracotta-400'}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="font-serif text-base font-semibold text-charcoal-300 tabular-nums w-16 text-right">{t.score}<span className="text-xs text-charcoal-50">/{t.maxScore}</span></span>
                              </div>
                            </td>
                            <td className="px-4 py-5">
                              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${grade.c}`}>
                                <grade.ic className={`h-3.5 w-3.5 ${grade.it}`} strokeWidth={1.75} />
                                {grade.l}
                              </span>
                            </td>
                            <td className="px-4 py-5">
                              <div className="flex items-center gap-1.5">
                                {pct >= t.percentile ? <TrendingUp className="h-3.5 w-3.5 text-olive-500" /> : <TrendingDown className="h-3.5 w-3.5 text-terracotta-400" />}
                                <span className="font-serif text-base font-semibold text-charcoal-300 tabular-nums">{t.percentile}<span className="text-xs text-charcoal-50">th</span></span>
                              </div>
                            </td>
                            <td className="px-4 py-5 text-sm text-charcoal-300">
                              <span className="tabular-nums font-semibold">#{t.rank}</span>
                              <span className="text-charcoal-50"> / {t.classSize}</span>
                            </td>
                            <td className="px-7 py-5 text-right">
                              <button className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-charcoal-100 transition-colors duration-200 hover:bg-olive-50 hover:text-olive-500 group-hover:shadow-soft-sm">
                                View review
                                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Performance Analysis */}
            {activeTab === 'analysis' && (
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-4xl border border-beige-100 bg-white p-7 shadow-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-2xl font-semibold text-charcoal-300">Performance by subject</h3>
                      <p className="mt-1 text-sm text-charcoal-50">Average score across last 4 completed tests</p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-50">Semester 6</span>
                  </div>
                  <div className="mt-8 space-y-5">
                    {SUBJECTS.slice(0, 5).map((s, i) => {
                      const scores = [88, 82, 76, 90, 71]
                      const v = scores[i]
                      const tone = v >= 85 ? 'from-olive-300 to-olive-400' : v >= 75 ? 'from-beige-200 to-beige-300' : 'from-terracotta-300 to-terracotta-400'
                      return (
                        <div key={s.id} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-50">{s.code}</span>
                              <span className="font-medium text-charcoal-300">{s.name}</span>
                            </div>
                            <span className="font-serif text-base font-semibold tabular-nums text-charcoal-300">{v}<span className="text-xs text-charcoal-50">%</span></span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-beige-100">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${tone}`}
                              style={{ width: `${v}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="rounded-4xl border border-beige-100 bg-olive-50/40 p-7 shadow-soft">
                    <h3 className="font-serif text-2xl font-semibold text-charcoal-300">Semester target</h3>
                    <p className="mt-1 text-sm text-charcoal-100">Overall 85%+ across all subjects</p>
                    <div className="mt-7">
                      <div className="flex items-baseline justify-between">
                        <span className="font-serif text-5xl font-semibold tracking-tight text-olive-500">{completedAvg.toFixed(1)}%</span>
                        <span className="text-xs font-semibold text-charcoal-100">Target: 85%</span>
                      </div>
                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-cream-200/60">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-olive-300 via-olive-400 to-olive-500 relative overflow-hidden"
                          style={{ width: `${Math.min(100, (completedAvg / 85) * 100)}%` }}
                        >
                          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)] animate-[shimmer_2s_infinite]" />
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-charcoal-50">
                        {Math.round(85 - completedAvg)} percentage points to go. Keep the streak alive!
                      </p>
                    </div>
                  </div>
                  <div className="rounded-4xl border border-beige-100 bg-white p-7 shadow-soft">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta-400/10 text-terracotta-400">
                        <Plus className="h-6 w-6" strokeWidth={1.75} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-xl font-semibold text-charcoal-300">Focus areas</h4>
                        <p className="text-sm text-charcoal-100 mt-0.5">Topics to practice before your next test</p>
                      </div>
                    </div>
                    <ul className="mt-5 space-y-2.5">
                      {[
                        { subj: 'DSA', topic: 'Graph algorithms — shortest paths', gap: '-12%' },
                        { subj: 'DBMS', topic: 'Normal forms 3NF vs BCNF', gap: '-8%' },
                        { subj: 'OS', topic: 'Deadlock detection & recovery', gap: '-5%' },
                      ].map((r) => (
                        <li key={r.topic} className="flex items-center justify-between rounded-2xl bg-cream-50/70 px-4 py-3 transition-colors duration-200 hover:bg-cream-100 cursor-pointer group">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-charcoal-50 bg-beige-100 px-2 py-0.5 rounded-lg">{r.subj}</span>
                            <span className="text-sm font-medium text-charcoal-300 truncate">{r.topic}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold text-terracotta-400">
                            {r.gap}
                            <ChevronRight className="h-3.5 w-3.5 text-charcoal-50 transition-colors duration-200 group-hover:text-charcoal-300" strokeWidth={2} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
