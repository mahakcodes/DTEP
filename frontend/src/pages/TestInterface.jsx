import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
  HelpCircle,
  Send,
  Eraser,
  Save,
  Info,
  Trophy,
  Check,
  Circle,
  CircleDot,
  CornerDownLeft,
  Eye,
} from 'lucide-react'
import { getActiveTestDetail } from '../services/mockData.js'

function formatTime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  const pad = (n) => n.toString().padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

export default function TestInterface() {
  const { id = 't_cs301_mid' } = useParams()
  const navigate = useNavigate()
  const data = getActiveTestDetail(id)

  const [started, setStarted] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState((data?.duration || 60) * 60)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [responses, setResponses] = useState({})
  const [marked, setMarked] = useState({})
  const [visited, setVisited] = useState({ 0: true })
  const [showSubmit, setShowSubmit] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [warnLow, setWarnLow] = useState(false)
  const timerRef = useRef(null)

  const questions = data?.questions || []
  const total = questions.length
  const q = questions[currentIdx]

  useEffect(() => {
    if (started && secondsLeft > 0 && !submitted) {
      timerRef.current = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    }
    if (started && secondsLeft === 0 && !submitted) {
      handleForceSubmit()
    }
    if (started && secondsLeft === 5 * 60 && !warnLow) setWarnLow(true)
    return () => clearTimeout(timerRef.current)
  }, [started, secondsLeft, submitted, warnLow])

  const answeredCount = useMemo(() => Object.values(responses).filter(Boolean).length, [responses])
  const markedCount = useMemo(() => Object.values(marked).filter(Boolean).length, [marked])
  const unansweredForSubmit = Math.max(0, total - answeredCount)

  const toneWarn = secondsLeft < 300 ? 'text-terracotta-400 bg-terracotta-50 border-terracotta-400/30' : secondsLeft < 600 ? 'text-terracotta-400 bg-terracotta-50/70 border-terracotta-400/20' : 'text-olive-500 bg-olive-50 border-olive-400/20'
  const toneNum = secondsLeft < 300 ? 'text-terracotta-400' : secondsLeft < 600 ? 'text-terracotta-400' : 'text-charcoal-300'

  const selectOption = (key) => {
    setResponses((prev) => ({ ...prev, [q.id]: prev[q.id] === key ? null : key }))
  }

  const clearResponse = () => {
    setResponses((prev) => ({ ...prev, [q.id]: null }))
  }

  const toggleMark = () => {
    setMarked((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
  }

  const goPrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1)
      setVisited((v) => ({ ...v, [currentIdx - 1]: true }))
    }
  }
  const goNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx(currentIdx + 1)
      setVisited((v) => ({ ...v, [currentIdx + 1]: true }))
    } else {
      setShowSubmit(true)
    }
  }
  const goTo = (i) => {
    setCurrentIdx(i)
    setVisited((v) => ({ ...v, [i]: true }))
  }

  const handleForceSubmit = () => {
    clearTimeout(timerRef.current)
    setSubmitted(true)
    setShowSubmit(false)
  }

  const confirmSubmit = () => {
    clearTimeout(timerRef.current)
    setSubmitted(true)
    setShowSubmit(false)
  }

  // Scoring (for post-submit summary)
  const postSubmit = useMemo(() => {
    if (!submitted) return null
    let earned = 0
    let correct = 0
    const perQ = questions.map((qq) => {
      const ans = responses[qq.id]
      const isCorrect = ans === qq.correctKey
      if (isCorrect) {
        earned += qq.marks * (data?.positiveMarking || 1)
        correct++
      } else if (ans) {
        earned -= qq.marks * (data?.negativeMarking || 0)
      }
      return { qq, ans, isCorrect }
    })
    const maxScore = questions.reduce((s, qq) => s + qq.marks, 0)
    const pct = Math.max(0, Math.round((earned / maxScore) * 100))
    const timeTaken = (data?.duration || 60) * 60 - secondsLeft
    return { earned: Math.round(earned * 10) / 10, maxScore, pct, correct, total, perQ, timeTaken }
  }, [submitted, responses, questions, secondsLeft, data])

  // ===== Start / Instructions screen =====
  if (!started) {
    return (
      <div className="min-h-screen bg-cream-100 text-charcoal-300">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10 lg:py-14">
          <Link to="/student" className="inline-flex items-center gap-2 text-sm font-medium text-charcoal-100 transition-colors duration-200 hover:text-charcoal-300">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Back to my tests
          </Link>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-5xl border border-beige-100 bg-white p-8 lg:p-10 shadow-soft overflow-hidden relative">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-olive-200/60 to-transparent blur-2xl" aria-hidden />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-olive-500">Test overview</p>
                <h1 className="mt-3 font-serif text-[2.25rem] leading-[1.08] tracking-tight font-semibold text-charcoal-300">
                  {data?.title}
                </h1>
                <p className="mt-2 text-sm text-charcoal-100">
                  <span className="font-semibold">{data?.subject?.code}</span> · {data?.subject?.name}
                </p>

                <div className="mt-8 grid grid-cols-4 gap-3">
                  {[
                    { k: 'Duration', v: `${data?.duration} min`, Icon: Clock },
                    { k: 'Questions', v: `${total}`, Icon: FileText },
                    { k: 'Max marks', v: `${data?.totalMarks}`, Icon: Trophy },
                    { k: 'Negative', v: `-${data?.negativeMarking * 100}%`, Icon: AlertTriangle },
                  ].map((it) => {
                    const { Icon } = it
                    return (
                      <div key={it.k} className="rounded-3xl bg-cream-100 p-4 text-center">
                        <div className="flex h-9 w-9 mx-auto items-center justify-center rounded-xl bg-white text-olive-500">
                          <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                        </div>
                        <p className="mt-3 text-[10px] uppercase tracking-wider font-semibold text-charcoal-50">{it.k}</p>
                        <p className="mt-1 font-serif text-xl font-semibold text-charcoal-300">{it.v}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-8 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal-100">Instructions</p>
                  <ol className="space-y-2.5 text-sm leading-relaxed text-charcoal-200 list-decimal list-inside marker:text-olive-500 marker:font-semibold">
                    {data?.instructions?.map((ins, i) => (
                      <li key={i}>{ins}</li>
                    ))}
                  </ol>
                </div>

                <div className="mt-8 flex items-start gap-3 rounded-3xl border border-olive-400/20 bg-olive-50/60 p-4">
                  <Shield className="h-5 w-5 text-olive-500 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div className="text-sm">
                    <p className="font-semibold text-olive-500">Proctoring &amp; security</p>
                    <p className="text-charcoal-100 mt-0.5">
                      This session is recorded. Full-screen mode is required; tab switches are flagged. Your camera &amp; identity were verified at sign-in.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={() => setStarted(true)}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-charcoal-300 px-6 py-3.5 text-sm font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft-xl hover:-translate-y-0.5"
                  >
                    Start test
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={() => navigate('/student')}
                    className="inline-flex items-center gap-2 rounded-full border border-beige-200 bg-white px-6 py-3.5 text-sm font-semibold text-charcoal-200 transition-colors duration-200 hover:border-beige-300 hover:text-charcoal-300"
                  >
                    Cancel &amp; return later
                  </button>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-6 lg:pt-10">
              <div className="rounded-4xl border border-beige-100 bg-white p-6 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-100">Question palette legend</p>
                <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {[
                    { dot: 'bg-olive-400', label: 'Answered' },
                    { dot: 'bg-beige-200 border-2 border-beige-300', label: 'Not answered' },
                    { dot: 'bg-white border-2 border-olive-400 ring-2 ring-olive-400/20', label: 'Currently viewing' },
                    { dot: 'bg-white border-2 border-charcoal-300 relative after:absolute after:inset-0 after:m-auto after:h-1.5 after:w-1.5 after:rounded-full after:bg-terracotta-400', label: 'Marked for review' },
                    { dot: 'bg-terracotta-400', label: 'Not visited' },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-2.5">
                      <span className={`relative inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold ${l.dot}`} />
                      <span className="text-charcoal-200">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-4xl border border-beige-100 bg-cream-50 p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-terracotta-400/10 text-terracotta-400">
                    <Info className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal-300">Ready when you are</p>
                    <p className="text-sm text-charcoal-100 mt-0.5">
                      The timer starts the moment you click <span className="font-semibold text-charcoal-300">Start test</span>. You can submit early or wait for auto-submit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ===== Post-submit summary =====
  if (submitted && postSubmit) {
    const tone = postSubmit.pct >= 85 ? { pill: 'bg-olive-50 text-olive-500 border-olive-400/30', num: 'text-olive-500', bg: 'from-olive-200/50 via-transparent to-transparent' }
      : postSubmit.pct >= 70 ? { pill: 'bg-beige-100 text-charcoal-200 border-beige-200', num: 'text-charcoal-300', bg: 'from-beige-100/70 via-transparent to-transparent' }
      : { pill: 'bg-terracotta-50 text-terracotta-400 border-terracotta-400/30', num: 'text-terracotta-400', bg: 'from-terracotta-100/40 via-transparent to-transparent' }

    return (
      <div className="min-h-screen bg-cream-100 text-charcoal-300">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10 lg:py-16">
          <div className={`relative overflow-hidden rounded-5xl border border-beige-100 bg-white shadow-soft-2xl`}>
            <div className={`absolute inset-x-0 -top-1 h-64 bg-gradient-to-b ${tone.bg} pointer-events-none`} aria-hidden />
            <div className="relative p-8 lg:p-12 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-soft-xl ring-1 ring-beige-100">
                {postSubmit.pct >= 70 ? (
                  <Trophy className="h-10 w-10 text-olive-500" strokeWidth={1.75} />
                ) : (
                  <CheckCircle2 className="h-10 w-10 text-charcoal-200" strokeWidth={1.75} />
                )}
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-100">Test submitted successfully</p>
              <h1 className="mt-3 font-serif text-[2.5rem] leading-tight tracking-tight font-semibold text-charcoal-300">
                Nicely done, <span className="italic text-olive-500">{postSubmit.correct}/{postSubmit.total}</span> correct.
              </h1>
              <p className="mt-2 text-sm text-charcoal-100 max-w-lg mx-auto">
                {data?.title} · {data?.subject?.name}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-4 max-w-2xl mx-auto">
                {[
                  { k: 'Score', v: `${postSubmit.earned} / ${postSubmit.maxScore}` },
                  { k: 'Percentage', v: `${postSubmit.pct}%` },
                  { k: 'Correct', v: `${postSubmit.correct}/${postSubmit.total}` },
                  { k: 'Time taken', v: formatTime(postSubmit.timeTaken) },
                ].map((s) => (
                  <div key={s.k} className="rounded-3xl bg-cream-100/70 p-4 text-center">
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-50">{s.k}</p>
                    <p className={`mt-1 font-serif text-xl font-semibold ${tone.num}`}>{s.v}</p>
                  </div>
                ))}
              </div>

              <div className={`mt-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm ${tone.pill}`}>
                {postSubmit.pct >= 85 ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Info className="h-4 w-4" />
                )}
                {postSubmit.pct >= 85 ? 'Excellent performance — keep the streak!' : postSubmit.pct >= 70 ? 'Solid attempt — review the ones you missed.' : 'Review the solutions below and try again.'}
              </div>

              {/* Quick per-Q summary */}
              <div className="mt-10 max-w-3xl mx-auto text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-100 mb-4">Response summary</p>
                <div className="rounded-4xl border border-beige-100 bg-cream-50/60 divide-y divide-beige-100">
                  {postSubmit.perQ.slice(0, 6).map((r) => (
                    <div key={r.qq.id} className="px-5 py-3.5 flex items-center gap-4">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white border border-beige-100 text-xs font-bold text-charcoal-200">
                        {r.qq.number}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-charcoal-300 truncate">{r.qq.text.split('.')[0]}…</p>
                        <p className="text-[11px] text-charcoal-50 mt-0.5">
                          {r.ans ? `Your answer: <span class="font-semibold">${r.ans}</span>` : 'Not answered'} <span className="mx-1.5">·</span> Correct: <span className="font-semibold">{r.qq.correctKey}</span>
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        r.isCorrect
                          ? 'bg-olive-50 text-olive-500'
                          : r.ans
                          ? 'bg-terracotta-50 text-terracotta-400'
                          : 'bg-beige-100 text-charcoal-100'
                      }`}
                      >
                        {r.isCorrect ? <Check className="h-3 w-3" /> : r.ans ? <X className="h-3 w-3" /> : '-'}
                        {r.isCorrect ? 'Correct' : r.ans ? 'Incorrect' : 'Skipped'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => navigate('/student')}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-charcoal-300 px-6 py-3.5 text-sm font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft-xl hover:-translate-y-0.5"
                >
                  Return to dashboard
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-beige-200 bg-white px-6 py-3.5 text-sm font-semibold text-charcoal-200 transition-colors duration-200 hover:border-beige-300 hover:text-charcoal-300">
                  <Eye className="h-4 w-4" strokeWidth={1.75} />
                  View full review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ===== Active test =====
  return (
    <div className="min-h-screen bg-cream-100 text-charcoal-300">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-beige-100 bg-cream-100/95 backdrop-blur-md">
        <div className="mx-auto flex h-18 items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-olive-400 flex-shrink-0">
              <FileText className="h-4.5 w-4.5 text-cream-100" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50">{data?.subject?.code} · {data?.subject?.name}</p>
              <p className="font-serif text-base font-semibold text-charcoal-300 truncate">{data?.title}</p>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 font-medium shadow-soft-sm ${toneWarn}`}>
            <Clock className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-80">Time left</span>
            <span className={`font-serif text-lg font-bold tabular-nums ${toneNum}`}>{formatTime(secondsLeft)}</span>
          </div>

          <button
            onClick={() => setShowSubmit(true)}
            className="group inline-flex items-center gap-2 rounded-full bg-charcoal-300 px-4.5 py-2.5 text-xs font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft hover:-translate-y-0.5"
          >
            <Send className="h-3.5 w-3.5" strokeWidth={2} />
            Submit test
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] grid gap-6 px-4 py-6 lg:px-8 lg:py-8 lg:grid-cols-[1fr_320px]">
        {/* Question panel */}
        <div className="space-y-6">
          {/* Breadcrumb + marks */}
          <div className="flex items-center justify-between rounded-4xl border border-beige-100 bg-white px-6 py-4 shadow-soft-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-2xl bg-charcoal-300 text-cream-100 font-serif font-bold text-base">
                {q?.number}
              </span>
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-charcoal-50">Question {q?.number} of {total}</p>
                <p className="text-sm font-medium text-charcoal-100">
                  <span className="font-semibold text-charcoal-300">{q?.chapter}</span> · {q?.subject}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-olive-50 px-3 py-1 text-xs font-bold text-olive-500">
                <Trophy className="h-3 w-3" strokeWidth={2} />
                {q?.marks} marks
              </span>
              <button
                onClick={toggleMark}
                title="Mark for review"
                className={`group inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition-all duration-200 ${
                  marked[q?.id]
                    ? 'border-terracotta-400/40 bg-terracotta-50 text-terracotta-400'
                    : 'border-beige-200 bg-white text-charcoal-100 hover:border-beige-300 hover:text-charcoal-300'
                }`}
              >
                {marked[q?.id] ? <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.75} /> : <HelpCircle className="h-3.5 w-3.5" strokeWidth={1.75} />}
                {marked[q?.id] ? 'Marked' : 'Mark for review'}
              </button>
            </div>
          </div>

          {/* Question + options */}
          <div className="rounded-5xl border border-beige-100 bg-white p-7 lg:p-9 shadow-soft overflow-hidden relative">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-olive-100/50 to-transparent blur-3xl opacity-60" aria-hidden />

            <h2 className="relative font-serif text-2xl leading-[1.35] text-charcoal-300 lg:text-[1.75rem]">
              {q?.text}
            </h2>

            <div className="relative mt-8 grid gap-3.5">
              {q?.options.map((opt) => {
                const isSelected = responses[q?.id] === opt.key
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => selectOption(opt.key)}
                    className={`group relative flex items-start gap-4 rounded-3xl border p-4 lg:p-5 text-left transition-all duration-250 ${
                      isSelected
                        ? 'bg-olive-50/60 border-olive-400/40 shadow-soft-sm -translate-y-0.5'
                        : 'bg-white border-beige-100 hover:border-beige-200 hover:bg-cream-50/50'
                    }`}
                  >
                    <span
                      className={`relative mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold shrink-0 transition-all duration-200 ${
                        isSelected
                          ? 'border-olive-400 bg-olive-400 text-cream-100 shadow-soft-sm'
                          : 'border-beige-200 bg-white text-charcoal-100 group-hover:border-olive-400/50 group-hover:text-olive-500'
                      }`}
                    >
                      {opt.key}
                      {isSelected && <Check className="absolute inset-0 m-auto h-3.5 w-3.5 -translate-y-[1px]" strokeWidth={3} />}
                    </span>
                    <span
                      className={`pt-0.5 text-base leading-relaxed transition-colors duration-200 ${
                        isSelected ? 'text-charcoal-300 font-medium' : 'text-charcoal-200'
                      }`}
                    >
                      {opt.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="relative mt-8 flex flex-col items-start justify-between gap-4 border-t border-beige-100 pt-6 md:flex-row md:items-center">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={clearResponse}
                  disabled={!responses[q?.id]}
                  className="group inline-flex items-center gap-2 rounded-full border border-beige-200 bg-white px-4 py-2.5 text-xs font-semibold text-charcoal-100 transition-all duration-200 hover:border-terracotta-400/30 hover:bg-terracotta-50 hover:text-terracotta-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-charcoal-100 disabled:hover:border-beige-200"
                >
                  <Eraser className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Clear response
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-beige-200 bg-white px-4 py-2.5 text-xs font-semibold text-charcoal-100 transition-colors duration-200 hover:border-beige-300 hover:text-charcoal-300">
                  <HelpCircle className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Unsure? Flag for review
                </button>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                <button
                  onClick={goPrev}
                  disabled={currentIdx === 0}
                  className="group inline-flex items-center gap-2 rounded-full border border-beige-200 bg-white px-4.5 py-2.5 text-xs font-semibold text-charcoal-200 transition-colors duration-200 hover:border-beige-300 hover:text-charcoal-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                  Previous
                </button>
                <button
                  onClick={goNext}
                  className="group inline-flex items-center gap-2 rounded-full bg-charcoal-300 px-4.5 py-2.5 text-xs font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft-lg hover:-translate-y-0.5"
                >
                  {responses[q?.id] ? (
                    <>
                      <Save className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Save &amp; Next
                    </>
                  ) : (
                    <>
                      <CornerDownLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Next (no answer)
                    </>
                  )}
                  <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          {/* Low-time warning */}
          {warnLow && (
            <div className="animate-fade-in flex items-start gap-3 rounded-3xl border border-terracotta-400/30 bg-terracotta-50 p-4.5">
              <AlertTriangle className="h-5 w-5 text-terracotta-400 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="text-sm">
                <p className="font-semibold text-terracotta-400">5 minutes remaining</p>
                <p className="text-charcoal-100 mt-0.5">
                  Save your work. Questions left blank will not earn marks. The test auto-submits when the timer ends.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Palette + progress */}
        <aside className="space-y-6">
          <div className="rounded-4xl border border-beige-100 bg-white p-5 shadow-soft sticky top-24">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-100">Progress</p>
              <span className="font-serif text-lg font-bold text-charcoal-300 tabular-nums">
                {answeredCount}<span className="text-xs text-charcoal-50 font-medium"> / {total}</span>
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-beige-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-olive-300 to-olive-400 transition-all duration-500"
                style={{ width: `${(answeredCount / total) * 100}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-cream-100 py-2">
                <p className="font-serif text-base font-bold text-olive-500">{answeredCount}</p>
                <p className="text-[9px] uppercase tracking-wider font-semibold text-charcoal-50 mt-0.5">Answered</p>
              </div>
              <div className="rounded-2xl bg-cream-100 py-2">
                <p className="font-serif text-base font-bold text-terracotta-400">{markedCount}</p>
                <p className="text-[9px] uppercase tracking-wider font-semibold text-charcoal-50 mt-0.5">Marked</p>
              </div>
              <div className="rounded-2xl bg-cream-100 py-2">
                <p className="font-serif text-base font-bold text-charcoal-100">{total - answeredCount}</p>
                <p className="text-[9px] uppercase tracking-wider font-semibold text-charcoal-50 mt-0.5">Left</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-100">Question palette</p>
              </div>
              <div className="mt-4 grid grid-cols-6 gap-2">
                {questions.map((qq, i) => {
                  const a = responses[qq.id]
                  const m = marked[qq.id]
                  const v = visited[i]
                  const cur = i === currentIdx
                  return (
                    <button
                      key={qq.id}
                      onClick={() => goTo(i)}
                      className={`group relative inline-flex h-10 items-center justify-center rounded-xl text-xs font-bold transition-all duration-200 ${
                        cur
                          ? 'bg-charcoal-300 text-cream-100 shadow-soft scale-[1.03] -translate-y-0.5'
                          : a
                          ? 'bg-olive-400 text-cream-100 hover:bg-olive-500'
                          : v
                          ? 'bg-beige-100 text-charcoal-200 hover:bg-beige-200'
                          : 'bg-white border border-beige-100 text-charcoal-100 hover:bg-beige-50'
                      }`}
                      title={`Q${qq.number} — ${a ? 'Answered' : v ? 'Visited, no answer' : 'Not yet visited'}${m ? ' · Marked for review' : ''}`}
                    >
                      {qq.number}
                      {m && (
                        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-terracotta-400 ring-2 ring-white" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 grid grid-cols-2 gap-y-2 gap-x-3 text-[11px] text-charcoal-100">
              <LegendDot className="bg-olive-400" label="Answered" />
              <LegendDot className="bg-beige-100" label="Not answered" />
              <LegendDot className="bg-charcoal-300" label="Current" />
              <LegendDot className="bg-white border border-beige-200 relative [&_span]:bg-terracotta-400" label="Marked" dotExtra />
            </div>

            <button
              onClick={() => setShowSubmit(true)}
              className="mt-6 group w-full inline-flex items-center justify-center gap-2 rounded-full bg-charcoal-300 py-3 text-xs font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft-lg hover:-translate-y-0.5"
            >
              <Send className="h-3.5 w-3.5" strokeWidth={2} />
              Submit test now
            </button>
          </div>
        </aside>
      </div>

      {/* Submit modal */}
      {showSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-charcoal-400/40 backdrop-blur-sm"
            onClick={() => setShowSubmit(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-md animate-scale-in rounded-4xl border border-beige-100 bg-white p-7 shadow-soft-2xl">
            <button
              onClick={() => setShowSubmit(false)}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl text-charcoal-100 transition-colors duration-200 hover:bg-beige-100 hover:text-charcoal-300"
              aria-label="Close"
            >
              <X className="h-4.5 w-4.5" strokeWidth={1.75} />
            </button>

            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-terracotta-400/10 text-terracotta-400">
              <AlertTriangle className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <h3 className="mt-5 font-serif text-2xl font-semibold text-charcoal-300">Submit your test?</h3>
            <p className="mt-2 text-sm text-charcoal-100 leading-relaxed">
              You are about to submit <span className="font-semibold text-charcoal-300">{data?.title}</span>. Once submitted, answers cannot be changed.
            </p>

            <div className="mt-6 rounded-3xl border border-beige-100 bg-cream-50/70 p-5 space-y-3.5">
              <Row label="Questions answered" value={`${answeredCount} / ${total}`} good={answeredCount === total} />
              <Row label="Marked for review" value={`${markedCount}`} good={markedCount === 0} reverse />
              <Row
                label="Time remaining"
                value={formatTime(secondsLeft)}
                good={secondsLeft > 120}
                reverse
              />
              {unansweredForSubmit > 0 && (
                <Row
                  label={<span className="text-terracotta-400 font-semibold flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5" />Unanswered questions</span>}
                  value={<span className="font-bold text-terracotta-400">{unansweredForSubmit}</span>}
                  tone="warn"
                />
              )}
            </div>

            <div className="mt-7 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => setShowSubmit(false)}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-beige-200 bg-white px-5 py-3 text-xs font-semibold text-charcoal-200 transition-colors duration-200 hover:border-beige-300 hover:text-charcoal-300"
              >
                Continue test
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 group inline-flex items-center justify-center gap-2 rounded-full bg-charcoal-300 px-5 py-3 text-xs font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft-xl hover:-translate-y-0.5"
              >
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                Yes, submit now
              </button>
            </div>
            <p className="mt-4 text-center text-[11px] text-charcoal-50">
              Or wait for the timer — the test will auto-submit when time ends.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function LegendDot({ className = '', label, dotExtra }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`relative inline-flex h-5 w-5 rounded-lg items-center justify-center ${className}`}>
        {dotExtra && <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full" />}
      </span>
      <span className="font-medium">{label}</span>
    </div>
  )
}

function Row({ label, value, good, reverse, tone }) {
  const toneClass = tone === 'warn' ? 'bg-terracotta-50' : good ? 'bg-olive-50' : 'bg-beige-100'
  const IconComp = reverse ? (good ? CheckCircle2 : Circle) : good ? CheckCircle2 : CircleDot
  const iconTone = reverse ? (good ? 'text-olive-500' : 'text-terracotta-400') : good ? 'text-olive-500' : 'text-charcoal-100'
  return (
    <div className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 ${toneClass}`}>
      <div className="flex items-center gap-2 text-sm text-charcoal-200">
        {typeof label === 'string' ? (
          <>
            <IconComp className={`h-4 w-4 ${iconTone}`} /> {label}
          </>
        ) : (
          label
        )}
      </div>
      <span className="font-serif text-sm font-bold text-charcoal-300 tabular-nums">{value}</span>
    </div>
  )
}
