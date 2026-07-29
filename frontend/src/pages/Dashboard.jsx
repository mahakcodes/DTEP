import { useState } from 'react'
import {
  Search,
  Bell,
  Plus,
  MoreHorizontal,
  ArrowUpRight,
  TrendingUp,
  Calendar,
  Users,
  Filter,
  Clock,
  CheckCircle2,
  Circle,
  FileText,
  ChevronRight,
  User,
} from 'lucide-react'
import Sidebar from '../components/Sidebar.jsx'
import MetricCard from '../components/MetricCard.jsx'

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false)

  const cycles = [
    {
      id: 'CYC-042',
      name: 'Release 4.2 Acceptance',
      progress: 74,
      evaluators: 12,
      status: 'active',
      due: 'Jul 12',
      avg: 4.2,
    },
    {
      id: 'CYC-041',
      name: 'Security Audit — API v3',
      progress: 100,
      evaluators: 8,
      status: 'completed',
      due: 'Jun 28',
      avg: 4.7,
    },
    {
      id: 'CYC-040',
      name: 'Mobile Onboarding UX',
      progress: 46,
      evaluators: 6,
      status: 'active',
      due: 'Jul 18',
      avg: 3.9,
    },
    {
      id: 'CYC-039',
      name: 'Compliance — GDPR Refresh',
      progress: 18,
      evaluators: 4,
      status: 'draft',
      due: 'Aug 02',
      avg: 0,
    },
  ]

  const activity = [
    { who: 'Sarah Chen', what: 'submitted evaluation for', target: 'Release 4.2 Acceptance', time: '12 min ago', accent: 'olive' },
    { who: 'Marcus Hill', what: 'created a new cycle', target: 'Compliance — GDPR Refresh', time: '1 hr ago', accent: 'charcoal' },
    { who: 'Priya Natarajan', what: 'commented on rubric', target: 'Mobile Onboarding UX', time: '3 hr ago', accent: 'terracotta' },
    { who: 'Daniel Ortiz', what: 'marked cycle complete', target: 'Security Audit — API v3', time: 'Yesterday', accent: 'olive' },
  ]

  const statusMap = {
    active: { label: 'Active', pill: 'bg-olive-50 text-olive-500', dot: 'bg-olive-400', icon: Circle },
    completed: { label: 'Completed', pill: 'bg-charcoal-300/10 text-charcoal-300', dot: 'bg-charcoal-300', icon: CheckCircle2 },
    draft: { label: 'Draft', pill: 'bg-beige-100 text-charcoal-100', dot: 'bg-beige-300', icon: FileText },
  }

  const accentMap = {
    olive: 'bg-olive-400',
    charcoal: 'bg-charcoal-300',
    terracotta: 'bg-terracotta-400',
  }

  return (
    <div className="min-h-screen bg-cream-100 text-charcoal-300">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <main className={`transition-all duration-300 ease-out ${collapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-30 border-b border-beige-100/60 bg-cream-100/80 backdrop-blur-md">
          <div className={`mx-auto flex h-18 items-center justify-between gap-4 px-6 lg:px-10 ${collapsed ? 'max-w-none' : 'max-w-none'}`}>
            <div className="flex flex-1 items-center gap-4 max-w-xl">
              <div className="relative w-full">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-50" strokeWidth={1.75} />
                <input
                  type="search"
                  placeholder="Search cycles, evaluations, evaluators..."
                  className="h-11 w-full rounded-full border border-beige-200 bg-cream-50/60 pl-11 pr-4 text-sm text-charcoal-300 placeholder:text-charcoal-50 outline-none transition-all duration-200 focus:border-olive-300 focus:bg-white focus:shadow-soft"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-charcoal-100 transition-colors duration-200 hover:bg-beige-100 hover:text-charcoal-300 relative">
                <Bell className="h-5 w-5" strokeWidth={1.75} />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-terracotta-400" />
              </button>
              <div className="mx-2 h-6 w-px bg-beige-200" />
              <div className="flex items-center gap-3 rounded-full py-1 pr-2 pl-1 transition-colors duration-200 hover:bg-beige-50 cursor-pointer">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-olive-300 to-olive-400 text-xs font-semibold text-cream-100">
                  <User className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div className="hidden sm:block text-left leading-none">
                  <p className="text-sm font-semibold text-charcoal-300">Alex Morgan</p>
                  <p className="text-[11px] capitalize text-charcoal-50 mt-0.5">Test Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="mx-auto max-w-none px-6 py-10 lg:px-10 lg:py-14">
          {/* Header */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-olive-500">
                <span>Dashboard</span>
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span className="text-charcoal-50">Overview</span>
              </div>
              <h1 className="mt-3 font-serif text-h1 font-semibold tracking-tight text-charcoal-300">
                Welcome back, Alex.
              </h1>
              <p className="mt-2.5 text-sm text-charcoal-100">
                Here's the state of testing as of today, <span className="font-medium text-charcoal-300">July 2nd</span>.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 rounded-full border border-beige-200 bg-white px-4 py-2.5 text-sm font-medium text-charcoal-200 transition-all duration-200 hover:border-beige-300 hover:text-charcoal-300 hover:shadow-soft">
                <Filter className="h-4 w-4" strokeWidth={1.75} />
                Last 30 days
              </button>
              <button className="group inline-flex items-center gap-2 rounded-full bg-charcoal-300 px-5 py-2.5 text-sm font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft-lg hover:-translate-y-0.5">
                <Plus className="h-4 w-4" strokeWidth={2.25} />
                New cycle
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Overall Pass Rate"
              value="86%"
              sub="Across 22 completed cycles"
              accent="olive"
              delta={{ positive: true, value: '3.2%' }}
            />
            <MetricCard
              label="Cycles Completed"
              value="22"
              sub="5 active right now"
              accent="charcoal"
              delta={{ positive: true, value: '+4' }}
            />
            <MetricCard
              label="Pending Evaluations"
              value="38"
              sub="7 overdue, need attention"
              accent="terracotta"
              delta={{ positive: false, value: '12' }}
            />
            <MetricCard
              label="Average Score"
              value="4.3"
              sub="Across all rubric criteria"
              accent="olive"
              delta={{ positive: true, value: '0.2' }}
            />
          </div>

          {/* Main grid */}
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            {/* Test Cycles Table */}
            <section className="rounded-4xl border border-beige-100 bg-white shadow-soft overflow-hidden">
              <div className="flex items-center justify-between px-7 py-6 border-b border-beige-100">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-charcoal-300">Test Cycles</h2>
                  <p className="mt-1 text-sm text-charcoal-50">Active and recent evaluation cycles</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold uppercase tracking-wider bg-olive-50 text-olive-500 transition-colors duration-200 hover:bg-olive-100">
                    5 Active
                  </button>
                  <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-charcoal-100 transition-colors duration-200 hover:bg-beige-50 hover:text-charcoal-300">
                    <MoreHorizontal className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-cream-100/50">
                      <th className="px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50">Cycle</th>
                      <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50">Status</th>
                      <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50">Progress</th>
                      <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50">Team</th>
                      <th className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50">Avg</th>
                      <th className="px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50 text-right">Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cycles.map((c) => {
                      const s = statusMap[c.status]
                      return (
                        <tr
                          key={c.id}
                          className="group border-t border-beige-100/60 transition-colors duration-200 hover:bg-cream-50/40 cursor-pointer"
                        >
                          <td className="px-7 py-5">
                            <div className="flex items-start gap-4">
                              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-cream-200 text-charcoal-200 transition-colors duration-300 group-hover:bg-olive-50 group-hover:text-olive-500">
                                <FileText className="h-5 w-5" strokeWidth={1.75} />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-charcoal-300">{c.name}</p>
                                <p className="mt-0.5 text-xs text-charcoal-50">{c.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.pill}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                              {s.label}
                            </span>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-3 min-w-[140px]">
                              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-beige-100">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-olive-300 to-olive-400 transition-all duration-500"
                                  style={{ width: `${c.progress}%` }}
                                />
                              </div>
                              <span className="w-9 text-right text-xs font-semibold text-charcoal-300 tabular-nums">{c.progress}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-charcoal-50" strokeWidth={1.75} />
                              <span className="text-sm text-charcoal-100">{c.evaluators} evaluators</span>
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <span className={`font-serif text-lg font-semibold ${c.avg >= 4 ? 'text-olive-500' : c.avg === 0 ? 'text-charcoal-50' : 'text-terracotta-400'}`}>
                              {c.avg === 0 ? '—' : c.avg.toFixed(1)}
                            </span>
                          </td>
                          <td className="px-7 py-5 text-right">
                            <div className="inline-flex items-center gap-1.5 text-xs text-charcoal-50">
                              <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                              {c.due}
                              <ArrowUpRight className="h-3.5 w-3.5 ml-1.5 text-charcoal-50 transition-colors duration-200 group-hover:text-olive-500" strokeWidth={1.75} />
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-7 py-5 border-t border-beige-100 bg-cream-100/30">
                <p className="text-xs text-charcoal-50">Showing 4 of 27 cycles</p>
                <div className="flex items-center gap-1.5">
                  {['<', '1', '2', '3', '...', '8', '>'].map((p) => (
                    <button
                      key={p}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 ${
                        p === '1'
                          ? 'bg-charcoal-300 text-cream-100'
                          : 'text-charcoal-100 hover:bg-beige-100 hover:text-charcoal-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Right Column — Activity + Quick Stats */}
            <div className="flex flex-col gap-6">
              {/* Activity Feed */}
              <section className="rounded-4xl border border-beige-100 bg-white shadow-soft p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-charcoal-300">Recent activity</h2>
                    <p className="mt-1 text-sm text-charcoal-50">Team updates, as they happen</p>
                  </div>
                  <button className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-olive-500 transition-colors duration-200 hover:text-olive-400">
                    View all
                    <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                </div>
                <ol className="mt-7 space-y-5">
                  {activity.map((a, i) => (
                    <li key={i} className="relative flex gap-4 pl-1">
                      <div className="absolute left-[1.35rem] top-7 bottom-0 w-px bg-beige-100" aria-hidden />
                      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${accentMap[a.accent]}/10`}>
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${accentMap[a.accent]}/10`}>
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${accentMap[a.accent]} text-[10px] font-bold text-cream-100`}>
                            {a.who.split(' ').map(w => w[0]).join('')}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 pt-1.5 pb-2">
                        <p className="text-sm leading-snug text-charcoal-100">
                          <span className="font-semibold text-charcoal-300">{a.who}</span>{' '}
                          {a.what}{' '}
                          <span className="font-medium text-olive-500">{a.target}</span>.
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-charcoal-50">
                          <Clock className="h-3 w-3" strokeWidth={1.75} />
                          {a.time}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Trend Mini Chart */}
              <section className="rounded-4xl border border-beige-100 bg-olive-50/40 shadow-soft p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-olive-500">30-day trend</p>
                    <h3 className="mt-2 font-serif text-2xl font-semibold text-charcoal-300">Evaluations submitted</h3>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-olive-400/10 px-3 py-1 text-xs font-semibold text-olive-500">
                    <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} />
                    +18%
                  </span>
                </div>
                <div className="mt-7 flex h-28 items-end gap-2">
                  {[32, 48, 40, 56, 62, 52, 68, 74, 60, 82, 70, 88, 92, 78, 96, 88, 102, 94, 110, 104, 118, 108, 122, 116, 128, 120, 134, 126, 140, 132].map((h, i) => (
                    <div
                      key={i}
                      className="relative flex-1 overflow-hidden rounded-t-lg bg-gradient-to-t from-olive-400 to-olive-200 transition-all duration-300 hover:from-olive-500 hover:to-olive-300"
                      style={{ height: `${h / 1.5}%` }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-charcoal-50">
                  <span>Jun 3</span>
                  <span>Jun 17</span>
                  <span>Jul 2</span>
                </div>
              </section>

              {/* Quick Actions */}
              <section className="rounded-4xl border border-beige-100 bg-cream-50 shadow-soft p-7">
                <h3 className="font-serif text-xl font-semibold text-charcoal-300">Quick actions</h3>
                <p className="mt-1 text-sm text-charcoal-50">Jump right into the work that matters.</p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Assign evaluations', icon: Users },
                    { label: 'Create rubric', icon: FileText },
                    { label: 'Export report', icon: ArrowUpRight },
                    { label: 'Review pending', icon: CheckCircle2 },
                  ].map((a) => {
                    const Icon = a.icon
                    return (
                      <button
                        key={a.label}
                        className="group flex items-center gap-3 rounded-2xl bg-white border border-beige-100 px-4 py-3 text-left text-sm font-medium text-charcoal-200 transition-all duration-300 hover:-translate-y-0.5 hover:border-olive-200 hover:shadow-soft hover:text-charcoal-300"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cream-200 text-charcoal-100 transition-colors duration-300 group-hover:bg-olive-400 group-hover:text-cream-100">
                          <Icon className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <span className="text-sm">{a.label}</span>
                      </button>
                    )
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
