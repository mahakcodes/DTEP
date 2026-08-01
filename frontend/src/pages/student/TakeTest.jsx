import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  AlertOctagon,
  Loader2,
  Maximize2,
  MonitorOff,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react'
import { fetchTestDetails, submitTest } from '../../services/api.js'

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  const pad = (n) => n.toString().padStart(2, '0')
  return `${pad(m)}:${pad(s)}`
}

const MAX_VIOLATIONS = 3
const PAPER = '#FAF9F6'
const IVORY = '#F2F0EA'
const INK = '#161A22'
const FOREST = '#1F4A3D'
const HAIRLINE = '#DEDACE'
const SLATE = '#5C5A52'
const BRASS = '#A8823A'
const ERROR = '#8C3A2E'
const SUCCESS = '#4B6B3A'

const MOCK_TEST_LIBRARY = {
  t_cs301_mid: {
    id: 't_cs301_mid',
    title: 'Midterm Examination: Data Structures & Algorithms',
    description: 'Offline mock test for UI verification. All questions are multiple choice with immediate review enabled.',
    duration_minutes: 30,
    totalMarks: 30,
    questions: [
      {
        id: 'q1',
        number: 1,
        text: 'Which traversal visits the current node before its children?',
        options: [
          { id: 'o1', label: 'Post-order' },
          { id: 'o2', label: 'In-order' },
          { id: 'o3', label: 'Pre-order' },
          { id: 'o4', label: 'Level-order' },
        ],
        correct_option_id: 'o3',
        marks: 2,
      },
      {
        id: 'q2',
        number: 2,
        text: 'Which data structure follows the Last-In-First-Out principle?',
        options: [
          { id: 'o5', label: 'Queue' },
          { id: 'o6', label: 'Stack' },
          { id: 'o7', label: 'Tree' },
          { id: 'o8', label: 'Graph' },
        ],
        correct_option_id: 'o6',
        marks: 2,
      },
      {
        id: 'q3',
        number: 3,
        text: 'What is the average time complexity of a hash table lookup?',
        options: [
          { id: 'o9', label: 'O(1)' },
          { id: 'o10', label: 'O(log n)' },
          { id: 'o11', label: 'O(n)' },
          { id: 'o12', label: 'O(n²)' },
        ],
        correct_option_id: 'o9',
        marks: 3,
      },
      {
        id: 'q4',
        number: 4,
        text: 'Which of these is a valid binary search tree property?',
        options: [
          { id: 'o13', label: 'Every left subtree contains lesser values' },
          { id: 'o14', label: 'Every node can have two parents' },
          { id: 'o15', label: 'Nodes are always stored in a linked list' },
          { id: 'o16', label: 'Only leaf nodes can store data' },
        ],
        correct_option_id: 'o13',
        marks: 2,
      },
      {
        id: 'q5',
        number: 5,
        text: 'What is the maximum number of children a node can have in a binary tree?',
        options: [
          { id: 'o17', label: '1' },
          { id: 'o18', label: '2' },
          { id: 'o19', label: '3' },
          { id: 'o20', label: 'Unlimited' },
        ],
        correct_option_id: 'o18',
        marks: 2,
      },
    ],
    instructions: ['All questions compulsory.', 'Do not leave the full-screen window.'],
  },
}

function getMockTestData(testId) {
  return MOCK_TEST_LIBRARY[testId] || {
    id: testId,
    title: 'Offline Practice Test',
    description: 'A local mock assessment used while the API is unavailable.',
    duration_minutes: 20,
    totalMarks: 20,
    questions: [
      {
        id: 'q1',
        number: 1,
        text: 'Which option correctly represents a safe, local offline test flow?',
        options: [
          { id: 'o1', label: 'Use mock data and keep navigation active' },
          { id: 'o2', label: 'Show an error and stop' },
          { id: 'o3', label: 'Only render a blank page' },
          { id: 'o4', label: 'Disable all controls' },
        ],
        correct_option_id: 'o1',
        marks: 2,
      },
    ],
    instructions: ['Local fallback mode is active.'],
  }
}

export default function TakeTest() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [testData, setTestData] = useState(null)
  const [error, setError] = useState(null)

  const [showRules, setShowRules] = useState(true)
  const [started, setStarted] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [responses, setResponses] = useState({})
  const [visited, setVisited] = useState({})
  const [bookmarks, setBookmarks] = useState({})
  const [showSubmit, setShowSubmit] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [warnLow, setWarnLow] = useState(false)

  const [violations, setViolations] = useState(0)
  const [showViolationModal, setShowViolationModal] = useState(false)
  const [violationMessage, setViolationMessage] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const timerRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await fetchTestDetails(id)
        if (mounted) {
          setTestData(data)
          setSecondsLeft((data.duration_minutes || 30) * 60)
          setError(null)
        }
      } catch (err) {
        const fallback = getMockTestData(id)
        if (mounted) {
          setTestData(fallback)
          setSecondsLeft((fallback.duration_minutes || 30) * 60)
          setError(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [id])

  const registerViolation = useCallback((message) => {
    setViolations((prev) => {
      const next = prev + 1
      setViolationMessage(message)
      setShowViolationModal(true)
      if (next >= MAX_VIOLATIONS) {
        setTimeout(() => {
          handleForceSubmit(true)
        }, 2000)
      }
      return next
    })
  }, [])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && started && !submitting) {
        registerViolation('Tab switch detected. Focus must remain on the test window.')
      }
    }
    const handleContextMenu = (e) => {
      if (started) {
        e.preventDefault()
        registerViolation('Right-click is not permitted during the test.')
      }
    }
    const handleCopy = (e) => {
      if (started) {
        e.preventDefault()
        registerViolation('Copying content is not allowed during the test.')
      }
    }
    const handlePaste = (e) => {
      if (started) {
        e.preventDefault()
        registerViolation('Pasting content is not allowed during the test.')
      }
    }
    const handleCut = (e) => {
      if (started) {
        e.preventDefault()
        registerViolation('Cutting content is not allowed during the test.')
      }
    }
    const handleFullscreenChange = () => {
      const fs = !!(document.fullscreenElement || document.webkitFullscreenElement)
      setIsFullscreen(fs)
      if (started && !fs && !submitting) {
        registerViolation('Full-screen mode was exited. Please remain in full-screen.')
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('copy', handleCopy)
    document.addEventListener('paste', handlePaste)
    document.addEventListener('cut', handleCut)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('paste', handlePaste)
      document.removeEventListener('cut', handleCut)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
  }, [started, submitting, registerViolation])

  const requestFullscreen = async () => {
    const el = containerRef.current || document.documentElement
    try {
      if (el.requestFullscreen) await el.requestFullscreen()
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen()
    } catch (_) {}
  }

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) await document.exitFullscreen()
      else if (document.webkitExitFullscreen) await document.webkitExitFullscreen()
    } catch (_) {}
  }

  const startTest = async () => {
    setShowRules(false)
    setStarted(true)
    setStartTime(Date.now())
    setVisited({ 0: true })
    try {
      await requestFullscreen()
    } catch (_) {
      // Browser may block fullscreen automatically; the test UI should still render.
    }
  }

  useEffect(() => {
    if (started && secondsLeft > 0 && !submitting) {
      timerRef.current = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    }
    if (started && secondsLeft === 0 && !submitting) {
      handleForceSubmit(false)
    }
    const warnAt = Math.max(60, Math.floor((testData?.duration_minutes || 30) * 60 * 0.1))
    if (started && secondsLeft === warnAt && !warnLow) setWarnLow(true)
    return () => clearTimeout(timerRef.current)
  }, [started, secondsLeft, submitting, warnLow, testData])

  const questions = testData?.questions || []
  const total = questions.length
  const q = questions[currentIdx]

  const answeredCount = useMemo(() => Object.values(responses).filter(Boolean).length, [responses])
  const unansweredForSubmit = Math.max(0, total - answeredCount)

  const toneWarn = secondsLeft < 300
    ? { color: ERROR, background: '#F9ECE9', borderColor: '#E7C9C3' }
    : secondsLeft < 600
    ? { color: BRASS, background: '#F8F3E6', borderColor: '#E5D8B8' }
    : { color: FOREST, background: '#EBF1EC', borderColor: '#C9D9D0' }
  const toneNum = secondsLeft < 300 ? { color: ERROR } : secondsLeft < 600 ? { color: BRASS } : { color: INK }

  const selectOption = (optionId) => {
    if (!q) return
    setResponses((prev) => ({ ...prev, [q.id]: prev[q.id] === optionId ? null : optionId }))
  }

  const clearResponse = () => {
    if (!q) return
    setResponses((prev) => ({ ...prev, [q.id]: null }))
  }

  const toggleBookmark = () => {
    if (!q) return
    setBookmarks((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
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

  const getTimeTaken = () => {
    if (!startTime) return (testData?.duration_minutes || 30) * 60 - secondsLeft
    return Math.floor((Date.now() - startTime) / 1000)
  }

  const buildAnswersPayload = () => {
    return Object.entries(responses)
      .filter(([, optId]) => optId != null)
      .map(([qid, optId]) => ({ question_id: qid, selected_option_id: optId }))
  }

  const handleForceSubmit = async (fromViolation) => {
    clearTimeout(timerRef.current)
    setSubmitting(true)
    try {
      const payload = {
        time_taken_seconds: getTimeTaken(),
        answers: buildAnswersPayload(),
      }
      const result = await submitTest(id, payload)
      await exitFullscreen()
      navigate(`/result/${result.submission_id}`)
    } catch (err) {
      alert(err.response?.data?.detail || 'Submission failed. Please try again.')
      setSubmitting(false)
    }
  }

  const confirmSubmit = async () => {
    clearTimeout(timerRef.current)
    setShowSubmit(false)
    setSubmitting(true)
    try {
      const payload = {
        time_taken_seconds: getTimeTaken(),
        answers: buildAnswersPayload(),
      }
      const result = await submitTest(id, payload)
      await exitFullscreen()
      navigate(`/result/${result.submission_id}`)
    } catch (err) {
      alert(err.response?.data?.detail || 'Submission failed. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: PAPER, color: INK }}>
        <div className="flex items-center gap-3" style={{ color: SLATE }}>
          <Loader2 className="h-5 w-5 animate-spin" style={{ color: FOREST }} />
          <span className="text-sm font-semibold font-mono">Loading test…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: PAPER, color: INK }}>
        <div className="max-w-md w-full rounded-md border p-8 text-center" style={{ backgroundColor: 'white', borderColor: HAIRLINE }}>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md" style={{ backgroundColor: '#F9ECE9', color: ERROR }}>
            <AlertTriangle className="h-7 w-7" strokeWidth={1.75} />
          </div>
          <h2 className="mt-5 text-2xl font-semibold" style={{ color: INK }}>Unable to load test</h2>
          <p className="mt-2 text-sm" style={{ color: SLATE }}>{error}</p>
          <button
            onClick={() => navigate('/student')}
            className="mt-6 inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold"
            style={{ backgroundColor: FOREST, color: PAPER }}
          >
            <ArrowLeft className="h-4 w-4" /> Return to dashboard
          </button>
        </div>
      </div>
    )
  }

  if (showRules) {
    return (
      <div className="min-h-screen bg-cream-100 text-charcoal-300" ref={containerRef}>
        <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10 lg:py-14">
          <button onClick={() => navigate('/student')} className="inline-flex items-center gap-2 text-sm font-medium text-charcoal-100 transition-colors duration-200 hover:text-charcoal-300">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Back to my tests
          </button>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-5xl border border-beige-100 bg-white p-8 lg:p-10 shadow-soft overflow-hidden relative">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gradient-to-br from-olive-200/60 to-transparent blur-2xl" aria-hidden />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-olive-500">Test overview</p>
                <h1 className="mt-3 font-serif text-[2.25rem] leading-[1.08] tracking-tight font-semibold text-charcoal-300">
                  {testData.title}
                </h1>
                {testData.description && (
                  <p className="mt-3 text-sm text-charcoal-100 leading-relaxed">{testData.description}</p>
                )}

                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="rounded-3xl bg-cream-100 p-4 text-center">
                    <div className="flex h-9 w-9 mx-auto items-center justify-center rounded-xl bg-white text-olive-500">
                      <Clock className="h-4.5 w-4.5" strokeWidth={1.75} />
                    </div>
                    <p className="mt-3 text-[10px] uppercase tracking-wider font-semibold text-charcoal-50">Duration</p>
                    <p className="mt-1 font-serif text-xl font-semibold text-charcoal-300">{testData.duration_minutes}<span className="text-[11px] text-charcoal-50 ml-1">min</span></p>
                  </div>
                  <div className="rounded-3xl bg-cream-100 p-4 text-center">
                    <div className="flex h-9 w-9 mx-auto items-center justify-center rounded-xl bg-white text-olive-500">
                      <FileText className="h-4.5 w-4.5" strokeWidth={1.75} />
                    </div>
                    <p className="mt-3 text-[10px] uppercase tracking-wider font-semibold text-charcoal-50">Questions</p>
                    <p className="mt-1 font-serif text-xl font-semibold text-charcoal-300">{total}</p>
                  </div>
                  <div className="rounded-3xl bg-cream-100 p-4 text-center">
                    <div className="flex h-9 w-9 mx-auto items-center justify-center rounded-xl bg-white text-olive-500">
                      <Trophy className="h-4.5 w-4.5" strokeWidth={1.75} />
                    </div>
                    <p className="mt-3 text-[10px] uppercase tracking-wider font-semibold text-charcoal-50">Marks</p>
                    <p className="mt-1 font-serif text-xl font-semibold text-charcoal-300">{total}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal-100">Rules &amp; Instructions</p>
                  <ol className="space-y-2.5 text-sm leading-relaxed text-charcoal-200 list-decimal list-inside marker:text-olive-500 marker:font-semibold">
                    <li>Full-screen mode is <span className="font-semibold text-charcoal-300">required</span> throughout the test.</li>
                    <li>Switching tabs, minimizing, or exiting full-screen counts as a violation.</li>
                    <li>Right-click, copy, paste, and cut actions are <span className="font-semibold text-charcoal-300">disabled</span>.</li>
                    <li>3 violations will trigger <span className="font-semibold text-terracotta-400">auto-submission</span> of your test.</li>
                    <li>The timer auto-submits when it reaches 00:00.</li>
                    <li>Once submitted, answers cannot be changed.</li>
                    <li>You may navigate between questions using the palette.</li>
                  </ol>
                </div>

                <div className="mt-8 flex items-start gap-3 rounded-3xl border border-olive-400/20 bg-olive-50/60 p-4">
                  <Shield className="h-5 w-5 text-olive-500 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div className="text-sm">
                    <p className="font-semibold text-olive-500">Proctoring active</p>
                    <p className="text-charcoal-100 mt-0.5">
                      All interactions are logged. Violations (tab switches, fullscreen exit, copy) are recorded and may impact your score.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={startTest}
                    className="group inline-flex items-center gap-2.5 rounded-full bg-charcoal-300 px-6 py-3.5 text-sm font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft-xl hover:-translate-y-0.5"
                  >
                    <Maximize2 className="h-4 w-4" strokeWidth={1.75} />
                    Enter fullscreen &amp; start
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

            <div className="space-y-6 lg:pt-10">
              <div className="rounded-4xl border border-beige-100 bg-white p-6 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-100">Question palette legend</p>
                <div className="mt-5 space-y-3 text-sm">
                  {[
                    { dot: 'bg-olive-400', label: 'Answered' },
                    { dot: 'bg-beige-100 text-charcoal-200', label: 'Not answered' },
                    { dot: 'bg-charcoal-300', label: 'Currently viewing' },
                    { dot: 'bg-white border border-beige-100', label: 'Not visited' },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-2.5">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-cream-100 ${l.dot}`} />
                      <span className="text-charcoal-200">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-4xl border border-terracotta-400/20 bg-terracotta-50/50 p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-terracotta-400/10 text-terracotta-400">
                    <AlertOctagon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal-300">Violation policy</p>
                    <p className="text-sm text-charcoal-100 mt-0.5">
                      <span className="font-semibold text-terracotta-400">3 strikes</span> and the test is auto-submitted immediately.
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" ref={containerRef}>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-18 items-center justify-between gap-4 px-5 lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 flex-shrink-0">
              <FileText className="h-4.5 w-4.5 text-white" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal-50">Test #{testData.id}</p>
              <p className="font-serif text-base font-semibold text-charcoal-300 truncate">{testData.title}</p>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 font-medium shadow-soft-sm ${toneWarn}`}>
            <Clock className="h-4 w-4" strokeWidth={1.75} />
            <span className="text-[11px] uppercase tracking-wider font-semibold opacity-80">Time left</span>
            <span className={`font-serif text-lg font-bold tabular-nums ${toneNum}`}>{formatTime(secondsLeft)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-bold ${
              violations >= 2 ? 'bg-terracotta-50 text-terracotta-400 border-terracotta-400/30' : violations >= 1 ? 'bg-terracotta-50/70 text-terracotta-400 border-terracotta-400/20' : 'bg-olive-50 text-olive-500 border-olive-400/20'
            }`}>
              <MonitorOff className="h-3.5 w-3.5" strokeWidth={2} />
              Violations {violations}/{MAX_VIOLATIONS}
            </span>
            <button
              onClick={() => setShowSubmit(true)}
              className="group inline-flex items-center gap-2 rounded-full bg-charcoal-300 px-4.5 py-2.5 text-xs font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft hover:-translate-y-0.5 disabled:opacity-50"
              disabled={submitting}
            >
              <Send className="h-3.5 w-3.5" strokeWidth={2} />
              {submitting ? 'Submitting…' : 'Submit test'}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1400px] grid gap-6 px-4 py-6 lg:px-8 lg:py-8 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Progress</p>
              <span className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                {answeredCount}<span className="text-xs text-slate-500 font-medium"> / {total}</span>
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                style={{ width: total ? `${(answeredCount / total) * 100}%` : '0%' }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-2xl bg-emerald-50 py-2">
                <p className="font-mono text-base font-bold text-emerald-700">{answeredCount}</p>
                <p className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 mt-0.5">Answered</p>
              </div>
              <div className="rounded-2xl bg-slate-50 py-2">
                <p className="font-mono text-base font-bold text-slate-700">{total - answeredCount}</p>
                <p className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 mt-0.5">Left</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Question palette</p>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {questions.map((qq, i) => {
                  const a = responses[qq.id]
                  const v = visited[i]
                  const b = bookmarks[qq.id]
                  const cur = i === currentIdx
                  return (
                    <button
                      key={qq.id}
                      onClick={() => goTo(i)}
                      className={`group relative inline-flex h-10 items-center justify-center rounded-xl text-xs font-bold transition-all duration-200 ${
                        cur
                          ? 'ring-2 ring-blue-600 bg-blue-50 text-blue-700 shadow-sm scale-[1.03] -translate-y-0.5'
                          : a
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                          : b
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : v
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-y-2 gap-x-3 text-[11px] text-slate-600">
              <LegendDot className="bg-emerald-500" label="Answered" />
              <LegendDot className="bg-amber-500" label="Bookmarked" labelColor="text-amber-700" />
              <LegendDot className="bg-slate-100" label="Visited" labelColor="text-slate-700" />
              <LegendDot className="ring-2 ring-blue-600 bg-blue-50" label="Current" labelColor="text-blue-700" />
            </div>

            <button
              onClick={() => setShowSubmit(true)}
              className="mt-6 group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5 disabled:opacity-50"
              disabled={submitting}
            >
              <Send className="h-3.5 w-3.5" strokeWidth={2} />
              Submit test now
            </button>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-blue-600 text-white font-semibold text-base">
                {currentIdx + 1}
              </span>
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-charcoal-50">Question {currentIdx + 1} of {total}</p>
                <p className="text-sm font-medium text-charcoal-100">
                  Select one option below
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-olive-50 px-3 py-1 text-xs font-bold text-olive-500">
                <Trophy className="h-3 w-3" strokeWidth={2} />
                1 mark
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 lg:p-9 shadow-sm overflow-hidden relative">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-olive-100/50 to-transparent blur-3xl opacity-60" aria-hidden />

            <h2 className="relative font-serif text-2xl leading-[1.35] text-charcoal-300 lg:text-[1.75rem]">
              {q?.text}
            </h2>

            <div className="relative mt-8 grid gap-3.5">
              {q?.options.map((opt) => {
                const isSelected = responses[q.id] === opt.id
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => selectOption(opt.id)}
                    className={`group relative flex items-start gap-4 rounded-2xl border p-4 lg:p-5 text-left transition-all duration-250 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-200 shadow-sm -translate-y-0.5'
                        : 'bg-white border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`relative mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold shrink-0 transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                          : 'border-slate-300 bg-white text-slate-700 group-hover:border-blue-400 group-hover:text-blue-700'
                      }`}
                    >
                      {opt.text.charAt(0)}
                      {isSelected && <Check className="absolute inset-0 m-auto h-3.5 w-3.5 -translate-y-[1px]" strokeWidth={3} />}
                    </span>
                    <span
                      className={`pt-0.5 text-base leading-relaxed transition-colors duration-200 ${
                        isSelected ? 'text-charcoal-300 font-medium' : 'text-charcoal-200'
                      }`}
                    >
                      {opt.text}
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
                  className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-700 disabled:hover:border-slate-200"
                >
                  <Eraser className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Clear response
                </button>
                <button
                  onClick={toggleBookmark}
                  className={`group inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all duration-200 ${
                    bookmarks[q?.id]
                      ? 'border-amber-200 bg-amber-50 text-amber-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-amber-200 hover:text-amber-700'
                  }`}
                >
                  {bookmarks[q?.id] ? <BookmarkCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> : <Bookmark className="h-3.5 w-3.5" strokeWidth={1.75} />}
                  {bookmarks[q?.id] ? 'Bookmarked' : 'Bookmark'}
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
                  className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4.5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:-translate-y-0.5"
                >
                  {responses[q?.id] ? (
                    <>
                      <Save className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Save &amp; Next
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4" strokeWidth={2} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {warnLow && (
            <div className="animate-fade-in flex items-start gap-3 rounded-3xl border border-terracotta-400/30 bg-terracotta-50 p-4.5">
              <AlertTriangle className="h-5 w-5 text-terracotta-400 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="text-sm">
                <p className="font-semibold text-terracotta-400">Time is running low</p>
                <p className="text-charcoal-100 mt-0.5">
                  Save your work. Questions left blank will not earn marks. The test auto-submits when the timer ends.
                </p>
              </div>
            </div>
          )}
        </div>

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
                style={{ width: total ? `${(answeredCount / total) * 100}%` : '0%' }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-2xl bg-cream-100 py-2">
                <p className="font-serif text-base font-bold text-olive-500">{answeredCount}</p>
                <p className="text-[9px] uppercase tracking-wider font-semibold text-charcoal-50 mt-0.5">Answered</p>
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
              <div className="mt-4 grid grid-cols-5 gap-2">
                {questions.map((qq, i) => {
                  const a = responses[qq.id]
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
                    >
                      {i + 1}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-y-2 gap-x-3 text-[11px] text-charcoal-100">
              <LegendDot className="bg-olive-400" label="Answered" />
              <LegendDot className="bg-beige-100" label="Not answered" labelColor="text-charcoal-200" />
              <LegendDot className="bg-charcoal-300" label="Current" />
              <LegendDot className="bg-white border border-beige-100" label="Not visited" labelColor="text-charcoal-100" />
            </div>

            <button
              onClick={() => setShowSubmit(true)}
              className="mt-6 group w-full inline-flex items-center justify-center gap-2 rounded-full bg-charcoal-300 py-3 text-xs font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft-lg hover:-translate-y-0.5 disabled:opacity-50"
              disabled={submitting}
            >
              <Send className="h-3.5 w-3.5" strokeWidth={2} />
              Submit test now
            </button>
          </div>
        </aside>
      </div>

      {showViolationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-charcoal-400/40 backdrop-blur-sm" aria-hidden />
          <div className="relative w-full max-w-md animate-scale-in rounded-4xl border border-beige-100 bg-white p-7 shadow-soft-2xl">
            <div className={`flex h-14 w-14 items-center justify-center rounded-3xl ${
              violations >= MAX_VIOLATIONS ? 'bg-terracotta-400/10 text-terracotta-400' : 'bg-terracotta-400/10 text-terracotta-400'
            }`}>
              {violations >= MAX_VIOLATIONS ? <AlertOctagon className="h-7 w-7" strokeWidth={1.75} /> : <AlertTriangle className="h-7 w-7" strokeWidth={1.75} />}
            </div>
            <h3 className="mt-5 font-serif text-2xl font-semibold text-charcoal-300">
              {violations >= MAX_VIOLATIONS ? 'Maximum violations reached' : 'Violation detected'}
            </h3>
            <p className="mt-2 text-sm text-charcoal-100 leading-relaxed">{violationMessage}</p>
            <div className="mt-5 rounded-3xl border border-beige-100 bg-cream-50/70 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-charcoal-200 font-medium">Strikes used</span>
                <span className={`font-serif text-lg font-bold tabular-nums ${violations >= 2 ? 'text-terracotta-400' : 'text-charcoal-300'}`}>
                  {violations} / {MAX_VIOLATIONS}
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-beige-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${violations >= 2 ? 'bg-gradient-to-r from-terracotta-300 to-terracotta-400' : 'bg-gradient-to-r from-beige-300 to-terracotta-300'}`}
                  style={{ width: `${(violations / MAX_VIOLATIONS) * 100}%` }}
                />
              </div>
            </div>
            {violations < MAX_VIOLATIONS ? (
              <button
                onClick={() => setShowViolationModal(false)}
                className="mt-6 w-full group inline-flex items-center justify-center gap-2 rounded-full bg-charcoal-300 px-5 py-3 text-xs font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft-xl hover:-translate-y-0.5"
              >
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                I understand — continue test
              </button>
            ) : (
              <div className="mt-6 text-center">
                {submitting ? (
                  <div className="flex items-center justify-center gap-2 text-sm font-semibold text-charcoal-200">
                    <Loader2 className="h-4 w-4 animate-spin text-terracotta-400" />
                    Auto-submitting test…
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-terracotta-400">
                    Auto-submitting your test now. You will be redirected shortly.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

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
              You are about to submit <span className="font-semibold text-charcoal-300">{testData?.title}</span>. Once submitted, answers cannot be changed.
            </p>

            <div className="mt-6 rounded-3xl border border-beige-100 bg-cream-50/70 p-5 space-y-3.5">
              <SubmitRow label="Questions answered" value={`${answeredCount} / ${total}`} good={answeredCount === total} />
              <SubmitRow
                label="Time remaining"
                value={formatTime(secondsLeft)}
                good={secondsLeft > 120}
                reverse
              />
              {unansweredForSubmit > 0 && (
                <SubmitRow
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
                disabled={submitting}
                className="flex-1 group inline-flex items-center justify-center gap-2 rounded-full bg-charcoal-300 px-5 py-3 text-xs font-semibold text-cream-100 transition-all duration-300 hover:bg-charcoal-400 hover:shadow-soft-xl hover:-translate-y-0.5 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" strokeWidth={1.75} />
                    Yes, submit now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LegendDot({ className = '', label, labelColor = 'text-cream-100' }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`relative inline-flex h-5 w-5 rounded-lg items-center justify-center ${className}`} />
      <span className={`font-medium ${labelColor}`}>{label}</span>
    </div>
  )
}

function SubmitRow({ label, value, good, reverse, tone }) {
  const toneClass = tone === 'warn' ? 'bg-terracotta-50' : good ? 'bg-olive-50' : 'bg-beige-100'
  const IconComp = reverse ? (good ? CheckCircle2 : HelpCircle) : good ? CheckCircle2 : HelpCircle
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
