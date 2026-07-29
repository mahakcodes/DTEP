import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  BarChart3,
  Shield,
  Users,
  Zap,
  Play,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function Landing() {
  const features = [
    {
      icon: ClipboardList,
      title: 'Structured Test Cycles',
      description: 'Plan with precision. Define scope, timelines, and rubrics that align every evaluator on the same standard.',
    },
    {
      icon: FileCheck2,
      title: 'Evaluator Workflows',
      description: 'Assign, track, and score with consistency. Guided rubrics eliminate drift and keep quality uniform.',
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Turn evaluations into decisions. See trends, patterns, and anomalies the moment data is submitted.',
    },
    {
      icon: Shield,
      title: 'Audit & Compliance',
      description: 'Every action, timestamped and traceable. Demonstrate rigor with zero preparation overhead.',
    },
    {
      icon: Users,
      title: 'Collaborative Review',
      description: 'Align cross-functional teams without the overhead. Context persists, discussions stay focused.',
    },
    {
      icon: Zap,
      title: 'Template Library',
      description: 'Start fast from battle-tested frameworks. Customize once, reuse across every cycle.',
    },
  ]

  const steps = [
    { n: '01', title: 'Define the cycle', desc: 'Set scope, pick a template, and assign your evaluation team in minutes.' },
    { n: '02', title: 'Execute with rigor', desc: 'Evaluators follow structured rubrics. Draft, refine, submit — all in one place.' },
    { n: '03', title: 'Decide with clarity', desc: 'Aggregated scores, narrative summaries, and trends surface the insight you need.' },
  ]

  const tier = [
    {
      name: 'Essential',
      price: '$29',
      period: '/seat /month',
      features: ['Up to 15 evaluators', '10 active test cycles', 'Standard rubrics', 'Email support', 'SSO (single sign-on)'],
      highlight: false,
    },
    {
      name: 'Professional',
      price: '$69',
      period: '/seat /month',
      features: ['Unlimited evaluators', 'Unlimited test cycles', 'Custom rubric builder', 'Priority support', 'Advanced analytics', 'Full audit log & export'],
      highlight: true,
      badge: 'Most used',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: ['Everything in Professional', 'Dedicated CSM', 'Custom SLA', 'On-premise option', 'Advanced security & compliance', 'Integrations engineering'],
      highlight: false,
    },
  ]

  const logos = ['Lumen Labs', 'Meridian', 'Northwind QA', 'Cedar & Co', 'Helios Testing', 'Axon Institute']

  return (
    <div className="min-h-screen bg-cream-100 text-charcoal-300">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-paper">
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-10 lg:pt-32 lg:pb-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative">
              <div
                className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-beige-200 bg-cream-50/70 px-4 py-1.5 text-xs font-medium text-charcoal-100 shadow-soft"
                style={{ animationDelay: '0.05s' }}
              >
                <span className="flex h-1.5 w-1.5 rounded-full bg-olive-400" />
                Introducing DTEP 2.0 — now with advanced rubric scoring
                <Sparkles className="h-3.5 w-3.5 text-olive-400" strokeWidth={1.75} />
              </div>

              <h1
                className="animate-fade-in-up mt-7 font-serif text-display font-semibold tracking-tight text-charcoal-300"
                style={{ animationDelay: '0.12s' }}
              >
                Evaluation,
                <br />
                <span className="italic text-olive-400">engineered for rigor.</span>
              </h1>

              <p
                className="animate-fade-in-up mt-7 max-w-xl text-body-lg text-charcoal-100"
                style={{ animationDelay: '0.2s' }}
              >
                The precision platform for teams that ship confidently. Plan test cycles, coordinate evaluators, and surface insights with a clarity that spreadsheets and legacy tools cannot match.
              </p>

              <div
                className="animate-fade-in-up mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
                style={{ animationDelay: '0.28s' }}
              >
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-charcoal-300 px-6 py-3.5 text-sm font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft-xl hover:-translate-y-0.5"
                >
                  Start a free 14-day trial
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
                </Link>
                <button
                  type="button"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-beige-200 bg-cream-50/50 px-6 py-3.5 text-sm font-semibold text-charcoal-300 transition-all duration-300 hover:border-beige-300 hover:bg-white"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-olive-400/10 text-olive-500 transition-colors duration-300 group-hover:bg-olive-400 group-hover:text-cream-100">
                    <Play className="h-3.5 w-3.5 ml-0.5" fill="currentColor" strokeWidth={0} />
                  </span>
                  Watch the 2-min overview
                </button>
              </div>

              <div
                className="animate-fade-in-up mt-12 flex flex-wrap items-center gap-x-8 gap-y-4"
                style={{ animationDelay: '0.36s' }}
              >
                {[
                  'No credit card required',
                  'SOC 2 Type II ready',
                  'Setup in under a day',
                ].map((tag) => (
                  <div key={tag} className="flex items-center gap-2 text-sm text-charcoal-100">
                    <CheckCircle2 className="h-4 w-4 text-olive-400" strokeWidth={1.75} />
                    {tag}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual — Editorially Composed Card Stack */}
            <div className="animate-scale-in relative h-[440px] w-full lg:h-[520px]" style={{ animationDelay: '0.2s' }}>
              {/* Background shape */}
              <div
                className="absolute -right-12 top-10 h-80 w-80 rounded-full bg-gradient-to-br from-olive-200/40 via-beige-100 to-transparent blur-3xl"
                aria-hidden
              />
              {/* Top Card — Scorecard */}
              <div className="absolute right-0 top-0 w-[78%] rotate-3 rounded-4xl border border-beige-100 bg-white p-6 shadow-soft-xl transition-transform duration-700 hover:rotate-1 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-charcoal-50">Cycle Overview · Q3</p>
                    <p className="mt-1 font-serif text-lg font-semibold text-charcoal-300">Release 4.2 Acceptance</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-olive-50 px-3 py-1 text-xs font-semibold text-olive-500">
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-olive-400" />
                    Active
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {[
                    { k: 'Completion', v: '74%' },
                    { k: 'Avg Score', v: '4.2' },
                    { k: 'Evaluators', v: '12' },
                  ].map((stat) => (
                    <div key={stat.k} className="rounded-2xl bg-cream-100 p-3">
                      <p className="text-[11px] uppercase tracking-wider text-charcoal-50">{stat.k}</p>
                      <p className="mt-1 font-serif text-xl font-semibold text-charcoal-300">{stat.v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-beige-100">
                  <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-olive-300 to-olive-400" />
                </div>
              </div>

              {/* Bottom-left — Evaluation snippet */}
              <div className="absolute bottom-0 left-0 w-[70%] -rotate-2 rounded-4xl border border-beige-100 bg-cream-50 p-6 shadow-soft-lg transition-transform duration-700 hover:rotate-0 hover:translate-y-0.5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-charcoal-50">Rubric · User Experience</p>
                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Navigation clarity', score: 4, max: 5 },
                    { label: 'Error recovery', score: 5, max: 5 },
                    { label: 'Onboarding flow', score: 4, max: 5 },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-4">
                      <span className="w-40 flex-shrink-0 text-sm text-charcoal-100 truncate">{row.label}</span>
                      <div className="flex flex-1 gap-1.5">
                        {Array.from({ length: row.max }).map((_, i) => (
                          <span
                            key={i}
                            className={`h-2.5 flex-1 rounded-full ${
                              i < row.score ? 'bg-olive-400' : 'bg-beige-100'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="w-8 text-right text-sm font-semibold text-charcoal-300">{row.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGO MARQUEE */}
      <section className="border-y border-beige-100 bg-cream-200/40">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
          <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-charcoal-50">
            Trusted by teams doing their best work
          </p>
          <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {logos.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center font-serif text-xl font-medium text-charcoal-100/70 transition-colors duration-300 hover:text-charcoal-300"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-26 lg:py-34">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow font-semibold uppercase text-olive-500">Capabilities</p>
            <h2 className="mt-4 font-serif text-h1 font-semibold text-charcoal-300">
              Built for the full evaluation lifecycle
            </h2>
            <p className="mt-6 text-body-lg text-charcoal-100">
              From planning to reporting, DTEP replaces ad-hoc systems with a single, disciplined foundation — so your team can focus on judgment, not administration.
            </p>
          </div>

          <div className="mt-18 grid gap-6 md:grid-cols-2 lg:mt-22 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon
              const bg = i % 2 === 0 ? 'bg-white' : 'bg-olive-50/50'
              return (
                <div
                  key={f.title}
                  className={`group relative rounded-4xl border border-beige-100 p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-soft-xl ${bg}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-100 text-olive-500 transition-all duration-500 group-hover:bg-olive-400 group-hover:text-cream-100">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-6 font-serif text-h3 font-semibold text-charcoal-300">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-100">{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="bg-beige-50/50 py-26 lg:py-34">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-start gap-14 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-eyebrow font-semibold uppercase text-terracotta-400">How it works</p>
              <h2 className="mt-4 font-serif text-h1 font-semibold text-charcoal-300">
                Three steps from plan to decision.
              </h2>
              <p className="mt-6 text-body-lg text-charcoal-100">
                Teams that adopt DTEP cut evaluation time almost in half. Here's the happy path most teams follow.
              </p>
            </div>
            <ol className="relative space-y-6">
              <span className="absolute left-[4.25rem] top-2 bottom-2 w-px bg-beige-200" aria-hidden />
              {steps.map((s) => (
                <li key={s.n} className="relative flex gap-6 rounded-4xl bg-white p-7 shadow-soft transition-all duration-500 hover:shadow-soft-lg">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-3xl bg-charcoal-300 font-serif text-lg font-semibold text-cream-100">
                    {s.n}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-serif text-2xl font-semibold text-charcoal-300">{s.title}</h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-charcoal-100">{s.desc}</p>
                  </div>
                  <ChevronRight className="absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-beige-300" strokeWidth={1.75} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-26 lg:py-34">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <svg className="mx-auto h-8 w-auto text-olive-300" viewBox="0 0 32 24" fill="currentColor" aria-hidden>
            <path d="M0 24V14.4C0 8.4 1.6 4 4.8 1.2 8-1.6 11.6-1.2 14.4 0.8L12.8 4C11.2 2.8 9.2 2.8 8 4 6.8 5.2 6.4 6.8 6.4 8.8H11.2V24H0Zm17.6 0V14.4c0-6 1.6-10.4 4.8-13.2 3.2-2.8 6.8-2.4 9.6-0.4L30.4 4C28.8 2.8 26.8 2.8 25.6 4c-1.2 1.2-1.6 2.8-1.6 4.8H30.4V24H17.6Z" />
          </svg>
          <p className="mt-8 font-serif text-3xl leading-[1.3] tracking-tight text-charcoal-300 md:text-4xl lg:text-5xl">
            "We used to spend weeks reconciling evaluations across spreadsheets and email threads. <span className="italic text-olive-500">DTEP cut it to days.</span> The rigor is built in — we just bring the judgment."
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-olive-300 to-olive-400 font-semibold text-cream-100">
              EP
            </div>
            <div className="text-left">
              <p className="font-semibold text-charcoal-300">Elena Park</p>
              <p className="text-sm text-charcoal-50">Head of Quality · Meridian Systems</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-charcoal-300 py-26 text-cream-100 lg:py-34">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow font-semibold uppercase text-olive-200">Pricing</p>
            <h2 className="mt-4 font-serif text-h1 font-semibold text-cream-50">
              Designed for teams of every size.
            </h2>
            <p className="mt-6 text-body-lg text-beige-100/80">
              Start free. Upgrade when the rigor compounds. Cancel anytime — because we'd rather earn your renewal than trap it.
            </p>
          </div>

          <div className="mt-18 grid gap-6 lg:mt-22 lg:grid-cols-3">
            {tier.map((t) => (
              <div
                key={t.name}
                className={`relative flex flex-col rounded-4xl p-8 transition-all duration-500 ${
                  t.highlight
                    ? 'bg-olive-400 text-cream-50 -translate-y-4 shadow-soft-2xl'
                    : 'bg-charcoal-200 text-cream-100 border border-charcoal-100 hover:-translate-y-1'
                }`}
              >
                {t.badge && (
                  <span className="absolute right-6 top-6 inline-flex items-center rounded-full bg-cream-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-olive-500">
                    {t.badge}
                  </span>
                )}
                <p className={`font-serif text-lg font-semibold ${t.highlight ? 'text-cream-50' : 'text-beige-100'}`}>
                  {t.name}
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-serif text-5xl font-semibold tracking-tight">{t.price}</span>
                  <span className={`text-sm ${t.highlight ? 'text-cream-100/80' : 'text-beige-100/60'}`}>{t.period}</span>
                </div>
                <ul className="mt-8 space-y-3.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className={`mt-0.5 h-4.5 w-4.5 flex-shrink-0 ${t.highlight ? 'text-cream-50' : 'text-olive-300'}`} strokeWidth={2} />
                      <span className={t.highlight ? 'text-cream-100/90' : 'text-beige-100/80'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={`mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold transition-all duration-300 ${
                    t.highlight
                      ? 'bg-cream-50 text-olive-500 hover:bg-white'
                      : 'bg-olive-400 text-cream-50 hover:bg-olive-500'
                  }`}
                >
                  Get started
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-cream-200/60 py-26 lg:py-34">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="relative overflow-hidden rounded-5xl bg-cream-50 p-12 text-center shadow-soft-xl md:p-16">
            <div className="absolute -left-16 -top-16 h-60 w-60 rounded-full bg-gradient-to-br from-olive-200/60 to-transparent blur-3xl" aria-hidden />
            <div className="absolute -right-16 -bottom-16 h-60 w-60 rounded-full bg-gradient-to-br from-terracotta-100/50 to-transparent blur-3xl" aria-hidden />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-serif text-h1 font-semibold text-charcoal-300">
                Stop managing evaluations. <span className="italic text-olive-500">Lead them.</span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-body-lg text-charcoal-100">
                Your team deserves better than patchwork tools. Start a free trial today — no sales demo, no credit card, no friction.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-charcoal-300 px-7 py-3.5 text-sm font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:-translate-y-0.5 hover:shadow-soft-xl"
                >
                  Start free trial
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
                </Link>
                <button className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-300 transition-colors duration-200 hover:text-olive-500">
                  Talk to our team
                  <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
