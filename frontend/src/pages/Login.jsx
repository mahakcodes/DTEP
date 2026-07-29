import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  UserCheck,
  Settings,
  BookMarked,
  Loader2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { MOCK_USER } from '../services/mockData.js'

const roles = [
  { key: 'student', label: 'Student', Icon: GraduationCap },
  { key: 'evaluator', label: 'Evaluator', Icon: UserCheck },
  { key: 'admin', label: 'Admin', Icon: Settings },
]

export default function Login() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  const initialRole = useMemo(() => {
    const q = searchParams.get('role')
    return roles.some((r) => r.key === q) ? q : 'student'
  }, [searchParams])

  const [role, setRole] = useState(initialRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(true)
  const [touched, setTouched] = useState({ email: false, password: false })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  // Populate demo email when role changes
  useEffect(() => {
    if (role === 'student') setEmail('aarav.sharma@dtep.edu')
    else if (role === 'evaluator') setEmail('priya.natarajan@dtep.edu')
    else if (role === 'admin') setEmail('daniel.ortiz@dtep.edu')
    setPassword('')
    setTouched({ email: false, password: false })
    setErrors({ email: '', password: '' })
  }, [role])

  function validateEmail(v) {
    if (!v) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Enter a valid email address'
    return ''
  }
  function validatePassword(v) {
    if (!v) return 'Password is required'
    if (v.length < 6) return 'Password must be at least 6 characters'
    return ''
  }

  const emailError = touched.email ? validateEmail(email) : ''
  const passError = touched.password ? validatePassword(password) : ''
  const emailPristineOk = !emailError && email && validateEmail(email) === ''
  const passPristineOk = !passError && password && validatePassword(password) === ''
  const formValid = !validateEmail(email) && !validatePassword(password)

  const roleTone = {
    student: {
      chip: 'bg-olive-50 text-olive-500 border-olive-400/20',
      activeBg: 'bg-charcoal-300 text-cream-100 shadow-soft-sm',
      btn: 'bg-charcoal-300 hover:bg-charcoal-400 text-cream-100',
      focus: 'focus:ring-olive-400/40 focus:border-olive-400',
    },
    evaluator: {
      chip: 'bg-terracotta-50 text-terracotta-400 border-terracotta-400/20',
      activeBg: 'bg-charcoal-300 text-cream-100 shadow-soft-sm',
      btn: 'bg-charcoal-300 hover:bg-charcoal-400 text-cream-100',
      focus: 'focus:ring-terracotta-400/40 focus:border-terracotta-400/70',
    },
    admin: {
      chip: 'bg-charcoal-300/[0.07] text-charcoal-300 border-charcoal-300/15',
      activeBg: 'bg-charcoal-300 text-cream-100 shadow-soft-sm',
      btn: 'bg-charcoal-300 hover:bg-charcoal-400 text-cream-100',
      focus: 'focus:ring-charcoal-300/30 focus:border-charcoal-300/60',
    },
  }[role]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    const emailErr = validateEmail(email)
    const passErr = validatePassword(password)
    setErrors({ email: emailErr, password: passErr })
    if (emailErr || passErr) return

    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 750))

    const user = MOCK_USER[role] || MOCK_USER.student
    login({ token: `demo_token_${role}_${Date.now()}`, user })
    setSubmitting(false)

    if (role === 'student') navigate('/student')
    else navigate('/evaluator')
  }

  return (
    <div className="relative min-h-screen bg-cream-100 text-charcoal-300">
      {/* Soft background */}
      <div className="pointer-events-none absolute inset-0 bg-paper opacity-60" aria-hidden />
      <div className="pointer-events-none absolute -top-24 left-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-olive-200/40 via-transparent to-transparent blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-gradient-to-tr from-beige-200/50 via-transparent to-transparent blur-3xl" aria-hidden />

      {/* Logo row */}
      <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
        <Link to="/" className="group flex items-center gap-3 transition-opacity duration-200 hover:opacity-85">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-olive-400 shadow-soft-sm">
            <BookMarked className="h-4.5 w-4.5 text-cream-100" strokeWidth={1.75} />
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight text-charcoal-300">DTEP</span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-charcoal-100 transition-colors duration-200 hover:text-charcoal-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
          Back
        </Link>
      </div>

      {/* Card, centered */}
      <main className="relative z-10 mx-auto flex max-w-[480px] flex-col items-stretch px-5 pb-16 pt-6 sm:px-6 sm:pt-10">
        <div className="animate-scale-in rounded-4xl border border-beige-100 bg-white p-7 shadow-soft-2xl sm:p-9">
          {/* Heading */}
          <div className="mb-7">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${roleTone.chip}`}>
              {roles.find((r) => r.key === role)?.Icon && (
                (() => {
                  const { Icon } = roles.find((r) => r.key === role)
                  return <Icon className="h-3 w-3" strokeWidth={1.75} />
                })()
              )}
              Signing in as {roles.find((r) => r.key === role)?.label}
            </span>
            <h1 className="mt-4 font-serif text-[1.9rem] font-semibold leading-[1.08] tracking-tight text-charcoal-300 sm:text-[2.1rem]">
              Sign in to DTEP.
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-100">
              Enter your credentials below to access your workspace.
            </p>
          </div>

          {/* Role tabs */}
          <div className="mb-7 grid grid-cols-3 gap-1 rounded-full border border-beige-100 bg-cream-50 p-1">
            {roles.map((r) => {
              const { Icon } = r
              const active = role === r.key
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  className={`group inline-flex items-center justify-center gap-1.5 rounded-full py-2 text-[11px] font-semibold transition-all duration-250 ${
                    active ? roleTone.activeBg : 'text-charcoal-100 hover:text-charcoal-300'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {r.label}
                </button>
              )
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4.5">
            {/* Email */}
            <label className="block">
              <span className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-100">
                Email address
              </span>
              <div className="relative">
                <Mail className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${emailError ? 'text-terracotta-400' : emailPristineOk ? 'text-olive-500' : 'text-charcoal-50'}`} strokeWidth={1.75} />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="you@dtep.edu"
                  className={`w-full rounded-2xl border bg-white px-10 py-3 text-sm font-medium text-charcoal-300 placeholder:text-charcoal-50 transition-all duration-200 outline-none focus:ring-2 ${
                    emailError
                      ? 'border-terracotta-400/70 bg-terracotta-50/40 focus:ring-terracotta-400/30'
                      : emailPristineOk
                      ? 'border-olive-400/60 bg-olive-50/30 focus:ring-olive-400/40'
                      : `border-beige-200 hover:border-beige-300 ${roleTone.focus}`
                  }`}
                />
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2">
                  {emailError && <AlertCircle className="h-4 w-4 text-terracotta-400" strokeWidth={1.75} />}
                  {emailPristineOk && !emailError && <CheckCircle2 className="h-4 w-4 text-olive-500" strokeWidth={1.75} />}
                </span>
              </div>
              {emailError && (
                <p className="mt-1.5 pl-1 text-[11px] text-terracotta-400 animate-fade-in">
                  {emailError}
                </p>
              )}
            </label>

            {/* Password */}
            <label className="block">
              <span className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal-100">
                Password
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  className="text-[11px] font-semibold normal-case tracking-normal text-charcoal-200 transition-colors duration-200 hover:text-charcoal-300"
                >
                  Forgot password?
                </a>
              </span>
              <div className="relative">
                <Lock className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${passError ? 'text-terracotta-400' : passPristineOk ? 'text-olive-500' : 'text-charcoal-50'}`} strokeWidth={1.75} />
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  placeholder="••••••••"
                  className={`w-full rounded-2xl border bg-white px-10 py-3 text-sm font-medium text-charcoal-300 placeholder:text-charcoal-50 transition-all duration-200 outline-none focus:ring-2 ${
                    passError
                      ? 'border-terracotta-400/70 bg-terracotta-50/40 focus:ring-terracotta-400/30'
                      : passPristineOk
                      ? 'border-olive-400/60 bg-olive-50/30 focus:ring-olive-400/40'
                      : `border-beige-200 hover:border-beige-300 ${roleTone.focus}`
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-charcoal-50 transition-colors duration-200 hover:bg-beige-100 hover:text-charcoal-200"
                >
                  {showPass ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
                </button>
              </div>
              {passError && (
                <p className="mt-1.5 pl-1 text-[11px] text-terracotta-400 animate-fade-in">
                  {passError}
                </p>
              )}
            </label>

            {/* Remember */}
            <label className="flex cursor-pointer select-none items-center gap-2.5 pt-0.5">
              <span className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="h-4.5 w-4.5 rounded-[9px] border border-beige-300 bg-white transition-all duration-200 peer-checked:border-charcoal-300 peer-checked:bg-charcoal-300" />
                <CheckCircle2 className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 scale-90 text-cream-100 opacity-0 transition-all duration-200 peer-checked:scale-100 peer-checked:opacity-100" strokeWidth={3} />
              </span>
              <span className="text-[12px] font-medium text-charcoal-100">
                Remember me for 30 days
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !formValid}
              className={`group mt-1.5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${roleTone.btn} hover:shadow-soft-xl hover:-translate-y-0.5`}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  Signing you in…
                </>
              ) : (
                <>
                  Sign In
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-7 text-center text-[12px] text-charcoal-100">
            Don&apos;t have an account?{' '}
            <Link
              to={`/signup?role=${role}`}
              className="font-semibold text-charcoal-300 transition-colors duration-200 hover:text-olive-500"
            >
              Create one
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] text-charcoal-50">
          Secured session · All activity is logged and auditable.
        </p>
      </main>
    </div>
  )
}
