import { Link } from 'react-router-dom'
import { GraduationCap, UserCheck, Settings, ArrowRight, ChevronRight, Users, BookOpen, Sparkles, Shield, Clock, BarChart3, CheckCircle2, FileCheck2 } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function Landing() {
  const features = [
    {
      icon: BookOpen,
      title: 'Structured Assessments',
      description: 'Design tests with rubrics, timed sections, and adaptive question banks. Publish with one click.',
    },
    {
      icon: Shield,
      title: 'Secure Test Delivery',
      description: 'Identity verification, lock-down mode, and AI proctoring. Every submission timestamped and auditable.',
    },
    {
      icon: Clock,
      title: 'Live Exam Experience',
      description: 'Running timers, question navigation palettes, auto-save, and a clean interface that stays out of the way.',
    },
    {
      icon: FileCheck2,
      title: 'Intelligent Grading',
      description: 'Auto-grade objective questions with detailed explanations. Manual-review workflow for anything subjective.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Class-level trends, difficulty curves, per-topic performance, and exports that work with your LMS.',
    },
    {
      icon: Users,
      title: 'Role-native Workflows',
      description: 'Tailored dashboards for Students, Evaluators, and Admins — each with exactly the controls they need.',
    },
  ]

  const roles = [
    {
      key: 'student',
      icon: GraduationCap,
      eyebrow: 'For learners',
      title: 'Student',
      description: 'See upcoming tests, practice with past papers, review your graded submissions with feedback.',
      bullets: [
        'Upcoming, Active & Completed tests dashboard',
        'Live test interface with timer and palette',
        'Detailed performance review by topic',
      ],
      href: '/login?role=student',
      accent: 'olive',
    },
    {
      key: 'evaluator',
      icon: UserCheck,
      eyebrow: 'For educators',
      title: 'Evaluator',
      description: 'Design tests from rubrics, assign to cohorts, grade submissions, and publish results.',
      bullets: [
        'Full question-bank manager',
        'Live submissions view with grading queue',
        'Per-question analytics & difficulty curves',
      ],
      href: '/login?role=evaluator',
      accent: 'terracotta',
    },
    {
      key: 'admin',
      icon: Settings,
      eyebrow: 'For institutions',
      title: 'Administrator',
      description: 'Oversee programs, manage evaluators and students, and review cohort-level outcomes.',
      bullets: [
        'Multi-program dashboard and roll-up metrics',
        'Evaluator assignment & permissions',
        'Compliance reports & audit trail',
      ],
      href: '/login?role=admin',
      accent: 'charcoal',
    },
  ]

  const accentClasses = {
    olive: 'from-olive-400/15 to-olive-400/0 text-olive-500 ring-olive-400/20 hover:ring-olive-400/40',
    terracotta: 'from-terracotta-400/15 to-terracotta-400/0 text-terracotta-400 ring-terracotta-400/20 hover:ring-terracotta-400/40',
    charcoal: 'from-charcoal-300/15 to-charcoal-300/0 text-charcoal-300 ring-charcoal-300/15 hover:ring-charcoal-300/30',
  }

  return (
    <div className="min-h-screen bg-cream-100 text-charcoal-300">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-paper">
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pt-24 lg:pb-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative">
              <div
                className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-beige-200 bg-cream-50/70 px-4 py-1.5 text-xs font-medium text-charcoal-100 shadow-soft"
                style={{ animationDelay: '0.05s' }}
              >
                <span className="flex h-1.5 w-1.5 rounded-full bg-olive-400" />
                DTEP — A complete test & evaluation platform
                <Sparkles className="h-3.5 w-3.5 text-olive-400" strokeWidth={1.75} />
              </div>

              <h1
                className="animate-fade-in-up mt-7 font-serif text-display font-semibold tracking-tight text-charcoal-300"
                style={{ animationDelay: '0.12s' }}
              >
                Evaluation,
                <br />
                <span className="italic text-olive-500">engineered for rigor.</span>
              </h1>

              <p
                className="animate-fade-in-up mt-7 max-w-xl text-body-lg text-charcoal-100"
                style={{ animationDelay: '0.2s' }}
              >
                One platform for students, evaluators, and administrators. Author tests, deliver them securely, grade at speed, and surface outcomes with a clarity that LMS add-ons never manage.
              </p>

              <div
                className="animate-fade-in-up mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
                style={{ animationDelay: '0.28s' }}
              >
                <Link
                  to="/login?role=student"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-charcoal-300 px-6 py-3.5 text-sm font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft-xl hover:-translate-y-0.5"
                >
                  Sign in as Student
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
                </Link>
                <a
                  href="#roles"
                  className="inline-flex items-center gap-2.5 rounded-full border border-beige-200 bg-cream-50/50 px-6 py-3.5 text-sm font-semibold text-charcoal-300 transition-all duration-300 hover:border-beige-300 hover:bg-white"
                >
                  Choose your role
                </a>
              </div>

              <div
                className="animate-fade-in-up mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
                style={{ animationDelay: '0.36s' }}
              >
                {['AI-proctored exams', 'Auto + manual grading', 'LMS-ready exports'].map((tag) => (
                  <div key={tag} className="flex items-center gap-2 text-sm text-charcoal-100">
                    <CheckCircle2 className="h-4 w-4 text-olive-400" strokeWidth={1.75} />
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Role cards teaser */}
            <div className="animate-scale-in relative h-[460px] w-full lg:h-[520px]" style={{ animationDelay: '0.22s' }}>
              <div className="absolute -right-10 top-6 h-80 w-80 rounded-full bg-gradient-to-br from-olive-200/50 via-beige-100 to-transparent blur-3xl" aria-hidden />
              <div className="absolute -left-6 bottom-0 h-60 w-60 rounded-full bg-gradient-to-br from-terracotta-100/40 to-transparent blur-3xl" aria-hidden />

              <div className="absolute right-0 top-2 w-[80%] rotate-3 rounded-4xl border border-beige-100 bg-white p-6 shadow-soft-xl transition-transform duration-700 hover:rotate-1 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-olive-400/10 text-olive-500">
                      <GraduationCap className="h-5.5 w-5.5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-charcoal-50 font-semibold">Student view</p>
                      <p className="mt-0.5 font-serif text-lg font-semibold text-charcoal-300">My upcoming tests</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-olive-50 px-3 py-1 text-xs font-semibold text-olive-500">3 items</span>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    { label: 'DSA Midterm', sub: 'Jul 05 · 90 min · 60 marks', dot: 'bg-olive-400' },
                    { label: 'Computer Networks Quiz 2', sub: 'Jul 08 · 45 min · 25 marks', dot: 'bg-terracotta-400' },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between rounded-2xl bg-cream-100 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`h-2.5 w-2.5 rounded-full ${r.dot}`} />
                        <div>
                          <p className="text-sm font-semibold text-charcoal-300">{r.label}</p>
                          <p className="text-xs text-charcoal-50 mt-0.5">{r.sub}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-charcoal-50" strokeWidth={1.75} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-2 left-0 w-[78%] -rotate-2 rounded-4xl border border-beige-100 bg-cream-50 p-6 shadow-soft-lg transition-transform duration-700 hover:rotate-0 hover:translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-terracotta-400/10 text-terracotta-400">
                    <UserCheck className="h-5.5 w-5.5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-charcoal-50 font-semibold">Evaluator view</p>
                    <p className="mt-0.5 font-serif text-lg font-semibold text-charcoal-300">Submissions queue</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { k: 'Submitted', v: '176', tone: 'text-charcoal-300' },
                    { k: 'To grade', v: '4', tone: 'text-terracotta-400' },
                    { k: 'Avg score', v: '74%', tone: 'text-olive-500' },
                  ].map((s) => (
                    <div key={s.k} className="rounded-2xl bg-white p-3">
                      <p className="text-[10px] uppercase tracking-wider text-charcoal-50 font-semibold">{s.k}</p>
                      <p className={`mt-1 font-serif text-xl font-semibold ${s.tone}`}>{s.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow font-semibold uppercase text-terracotta-400">Choose your role</p>
            <h2 className="mt-4 font-serif text-h1 font-semibold text-charcoal-300">
              Designed for everyone in the assessment cycle
            </h2>
            <p className="mt-6 text-body-lg text-charcoal-100">
              Every role gets a dedicated experience. Switch effortlessly between student practice, evaluator workflows, and program-wide administration.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3 lg:mt-20">
            {roles.map((r) => {
              const Icon = r.icon
              return (
                <Link
                  key={r.key}
                  to={r.href}
                  className={`group relative flex flex-col overflow-hidden rounded-4xl border border-beige-100 bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft-xl ring-1 ${accentClasses[r.accent]}`}
                >
                  <div className={`absolute inset-x-0 -top-32 h-64 bg-gradient-to-b ${accentClasses[r.accent].split(' ').slice(0, 2).join(' ')} opacity-70 pointer-events-none`} aria-hidden />
                  <div className="relative">
                    <p className="text-xs uppercase tracking-[0.14em] font-semibold text-charcoal-50">{r.eyebrow}</p>
                    <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-cream-200 transition-colors duration-500 group-hover:bg-white group-hover:shadow-soft">
                      <Icon className="h-6.5 w-6.5" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-6 font-serif text-3xl font-semibold text-charcoal-300">{r.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal-100">{r.description}</p>
                    <ul className="mt-6 space-y-3">
                      {r.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-sm text-charcoal-100">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-olive-400" strokeWidth={1.75} />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-10 inline-flex items-center gap-2 text-sm font-semibold">
                      Continue as {r.title}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-beige-50/50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow font-semibold uppercase text-olive-500">What&apos;s under the hood</p>
            <h2 className="mt-4 font-serif text-h1 font-semibold text-charcoal-300">
              A rigorous platform, end to end
            </h2>
            <p className="mt-6 text-body-lg text-charcoal-100">
              Six tightly-integrated capabilities that replace the patchwork of forms, spreadsheets, and LMS plugins most institutions struggle with.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="group relative rounded-4xl border border-beige-100 bg-white p-7 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-soft-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-200 text-charcoal-200 transition-all duration-500 group-hover:bg-olive-400 group-hover:text-cream-100">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-6 font-serif text-2xl font-semibold text-charcoal-300">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-100">{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-5xl bg-charcoal-300 p-12 text-center text-cream-100 shadow-soft-2xl md:p-16">
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-olive-400/40 to-transparent blur-3xl" aria-hidden />
            <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-gradient-to-br from-terracotta-400/30 to-transparent blur-3xl" aria-hidden />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-serif text-h1 font-semibold text-cream-50">
                Your assessment platform, <span className="italic text-olive-200">ready when you are.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-body-lg text-beige-100/80">
                Sign in with your role above, or create an account to explore every screen — from student practice test to evaluator rubric builder.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-cream-50 px-7 py-3.5 text-sm font-semibold text-olive-500 transition-all duration-300 hover:bg-white hover:-translate-y-0.5 hover:shadow-soft-xl"
                >
                  Create an account
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-full border border-beige-100/30 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors duration-200 hover:bg-cream-50/5"
                >
                  Sign in instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
