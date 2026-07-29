import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  UserCheck,
  Settings,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { MOCK_USER } from '../services/mockData.js'

export default function Login() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  const initialRole = searchParams.get('role') || 'student'
  const [role, setRole] = useState(initialRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(true)
  const [touched, setTouched] = useState({ email: false, password: false })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (role === 'student') setEmail('aarav.sharma@dtep.edu')
    if (role === 'evaluator') setEmail('priya.natarajan@dtep.edu')
    if (role === 'admin') setEmail('daniel.ortiz@dtep.edu')
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

  const emailValid = !validateEmail(email)
  const passValid = !validatePassword(password)
  const formValid = emailValid && passValid

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    const eErr = validateEmail(email)
    const pErr = validatePassword(password)
    setErrors({ email: eErr, password: pErr })
    if (eErr || pErr) return
    setSubmitting(true)
    setStatus({ type: '', message: '' })
    await new Promise((r) => setTimeout(r, 800))

    const mock = MOCK_USER[role] || MOCK_USER.student
    login({
      token: `mock_${role}_${Date.now()}`,
      user: { ...mock },
    })
    setStatus({ type: 'success', message: 'Signed in. Redirecting to your dashboard…' })
    await new Promise((r) => setTimeout(r, 500))
    setSubmitting(false)
    if (role === 'evaluator' || role === 'admin') navigate('/evaluator')
    else navigate('/student')
  }

  const roleOptions = [
    { key: 'student', label: 'Student', Icon: GraduationCap, tone: 'olive', helper: 'Track tests, take exams, review scores' },
    { key: 'evaluator', label: 'Evaluator', Icon: UserCheck, tone: 'terracotta', helper: 'Author tests, grade submissions' },
    { key: 'admin', label: 'Administrator', Icon: Settings, tone: 'charcoal', helper: 'Program-wide oversight' },
  ]

  const toneClass = {
    olive: {
      ring: 'ring-olive-400/30 bg-olive-50 text-olive-500',
      border: 'border-olive-400/40',
      btnFill: 'bg-olive-400 hover:bg-olive-500',
    },
    terracotta: {
      ring: 'ring-terracotta-400/30 bg-terracotta-50 text-terracotta-400',
      border: 'border-terracotta-400/40',
      btnFill: 'bg-terracotta-400 hover:bg-terracotta-500',
    },
    charcoal: {
      ring: 'ring-charcoal-300/20 bg-cream-200 text-charcoal-300',
      border: 'border-charcoal-300/30',
      btnFill: 'bg-charcoal-300 hover:bg-charcoal-400',
    },
  }[roleOptions.find((r) => r.key === role)?.tone || 'olive']

  return (
    <div className="min-h-screen bg-cream-100 text-charcoal-300">
      <div className="min-h-screen grid lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left column — editorial panel */}
        <div className="relative hidden lg:block overflow-hidden bg-charcoal-300 text-cream-100">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-gradient-to-br from-olive-400/40 to-transparent blur-3xl" aria-hidden />
          <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-gradient-to-br from-terracotta-400/25 to-transparent blur-3xl" aria-hidden />
          <div className="relative h-full flex flex-col justify-between p-14">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-olive-400 transition-transform duration-300 group-hover:scale-105">
                <svg viewBox="0 0 24 24" className="h-5.5 w-5.5 text-cream-100" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 18L13 6L18 18H8Z" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="leading-none">
                <p className="font-serif text-xl font-semibold tracking-tight text-cream-50">DTEP</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-beige-100/70 mt-0.5">Digital Test &amp; Evaluation</p>
              </div>
            </Link>

            <div className="max-w-md space-y-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-olive-200">Welcome back</p>
              <h1 className="font-serif text-[2.75rem] leading-[1.05] tracking-tight text-cream-50">
                Sign in to continue your
                <span className="italic text-olive-200"> evaluation journey.</span>
              </h1>
              <p className="text-beige-100/80 leading-relaxed">
                DTEP keeps every assessment, score, and rubric in one place — so you can spend less time chasing results and more time moving forward.
              </p>
              <div className="space-y-3.5 pt-2">
                {[
                  'Identity verification & secure sessions',
                  'Role-native dashboards (Student / Evaluator / Admin)',
                  'Full audit trail on every submission',
                ].map((l) => (
                  <div key={l} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-olive-300 flex-shrink-0" strokeWidth={1.75} />
                    <p className="text-sm text-beige-100/90">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-beige-100/50">© 2026 DTEP Labs · Crafted with care.</p>
          </div>
        </div>

        {/* Right column — form */}
        <div className="flex flex-col bg-paper">
          <div className="flex items-center justify-between px-6 py-5 lg:px-12 lg:py-7">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-charcoal-100 transition-colors duration-200 hover:text-charcoal-300 lg:hidden">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              Back to home
            </Link>
            <p className="ml-auto text-sm text-charcoal-100">
              Don&apos;t have an account?{' '}
              <Link to={`/signup?role=${role}`} className="font-semibold text-olive-500 transition-colors duration-200 hover:text-olive-400">
                Create one
              </Link>
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-12">
            <div className="w-full max-w-md">
              <div className="animate-fade-in-up">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-olive-500">Sign in</p>
                <h2 className="mt-3 font-serif text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-charcoal-300">
                  Good to see you again.
                </h2>
                <p className="mt-3 text-sm text-charcoal-100">
                  Choose your role below, then sign in with your DTEP credentials.
                </p>
              </div>

              {/* Role switcher */}
              <div className="mt-8 grid grid-cols-3 gap-2.5 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
                {roleOptions.map((opt) => {
                  const { Icon } = opt
                  const selected = role === opt.key
                  const tc = toneClass
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setRole(opt.key)}
                      className={`group relative flex flex-col items-center gap-2 rounded-3xl border p-4 text-center transition-all duration-300 ${
                        selected
                          ? `bg-white border-transparent shadow-soft ring-2 ${tc.ring}`
                          : 'bg-cream-50/40 border-beige-100 hover:border-beige-200 hover:bg-cream-50'
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-colors duration-300 ${
                        selected ? toneClass.ring : 'bg-cream-200 text-charcoal-100'
                      }`}>
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[13px] font-semibold text-charcoal-300 leading-tight">{opt.label}</p>
                        <p className="text-[10.5px] leading-tight text-charcoal-50 hidden sm:block">{opt.helper.split(',')[0]}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5 animate-fade-in-up"
                style={{ animationDelay: '0.16s' }}
                noValidate
              >
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-100">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className={`pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 transition-colors duration-200 ${
                      touched.email && errors.email ? 'text-terracotta-400' : touched.email && emailValid ? 'text-olive-500' : 'text-charcoal-50'
                    }`} strokeWidth={1.75} />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (touched.email) setErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }))
                      }}
                      onBlur={() => {
                        setTouched((prev) => ({ ...prev, email: true }))
                        setErrors((prev) => ({ ...prev, email: validateEmail(email) }))
                      }}
                      placeholder="you@dtep.edu"
                      className={`w-full h-12 rounded-2xl border pl-11 pr-11 text-sm text-charcoal-300 placeholder:text-charcoal-50 bg-white transition-all duration-200 outline-none ${
                        touched.email && errors.email
                          ? 'border-terracotta-400/60 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-400/20'
                          : touched.email && emailValid
                          ? 'border-olive-400/60 focus:border-olive-400 focus:ring-2 focus:ring-olive-400/20'
                          : 'border-beige-200 focus:border-olive-400 focus:ring-2 focus:ring-olive-400/20 hover:border-beige-300'
                      }`}
                    />
                    {touched.email && emailValid && (
                      <CheckCircle2 className="pointer-events-none absolute right-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-olive-500" strokeWidth={1.75} />
                    )}
                    {touched.email && errors.email && (
                      <AlertCircle className="pointer-events-none absolute right-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-terracotta-400" strokeWidth={1.75} />
                    )}
                  </div>
                  <div className="h-4">
                    {touched.email && errors.email && (
                      <p className="animate-fade-in text-xs text-terracotta-400 flex items-center gap-1.5">
                        <AlertCircle className="h-3 w-3" strokeWidth={2} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-[0.12em] text-charcoal-100">
                      Password
                    </label>
                    <a href="#" className="text-xs font-semibold text-olive-500 transition-colors duration-200 hover:text-olive-400">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className={`pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 transition-colors duration-200 ${
                      touched.password && errors.password ? 'text-terracotta-400' : touched.password && passValid ? 'text-olive-500' : 'text-charcoal-50'
                    }`} strokeWidth={1.75} />
                    <input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      placeholder="••••••••"
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (touched.password) setErrors((prev) => ({ ...prev, password: validatePassword(e.target.value) }))
                      }}
                      onBlur={() => {
                        setTouched((prev) => ({ ...prev, password: true }))
                        setErrors((prev) => ({ ...prev, password: validatePassword(password) }))
                      }}
                      className={`w-full h-12 rounded-2xl border pl-11 pr-11 text-sm text-charcoal-300 placeholder:text-charcoal-50 bg-white transition-all duration-200 outline-none ${
                        touched.password && errors.password
                          ? 'border-terracotta-400/60 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-400/20'
                          : touched.password && passValid
                          ? 'border-olive-400/60 focus:border-olive-400 focus:ring-2 focus:ring-olive-400/20'
                          : 'border-beige-200 focus:border-olive-400 focus:ring-2 focus:ring-olive-400/20 hover:border-beige-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      className="absolute right-3 top-1/2 h-8 w-8 inline-flex items-center justify-center -translate-y-1/2 rounded-xl text-charcoal-50 transition-colors duration-200 hover:bg-beige-50 hover:text-charcoal-300"
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? <EyeOff className="h-4 w-4" strokeWidth={1.75} /> : <Eye className="h-4 w-4" strokeWidth={1.75} />}
                    </button>
                  </div>
                  <div className="h-4">
                    {touched.password && errors.password && (
                      <p className="animate-fade-in text-xs text-terracotta-400 flex items-center gap-1.5">
                        <AlertCircle className="h-3 w-3" strokeWidth={2} /> {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                {/* Remember & helper */}
                <div className="flex items-center justify-between">
                  <label className="inline-flex items-center gap-2.5 text-sm text-charcoal-100 cursor-pointer select-none">
                    <span className="relative">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="peer sr-only"
                      />
                      <span className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-all duration-200 ${
                        remember ? 'bg-olive-400 border-olive-400' : 'bg-white border-beige-200 hover:border-beige-300'
                      }`}>
                        {remember && <CheckCircle2 className="h-3.5 w-3.5 text-cream-100" strokeWidth={3} />}
                      </span>
                    </span>
                    Remember me for 30 days
                  </label>
                </div>

                {/* Status banner */}
                {status.message && (
                  <div
                    className={`animate-fade-in rounded-2xl border px-4 py-3 text-sm flex items-start gap-3 ${
                      status.type === 'success'
                        ? 'bg-olive-50 border-olive-400/30 text-olive-500'
                        : 'bg-terracotta-50 border-terracotta-400/30 text-terracotta-400'
                    }`}
                  >
                    {status.type === 'success' ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" strokeWidth={1.75} />
                    )}
                    {status.message}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`group relative w-full inline-flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-semibold text-cream-100 transition-all duration-300 ${toneClass.btnFill} disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-soft-lg hover:-translate-y-0.5`}
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                        <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Signing you in…
                    </>
                  ) : (
                    <>
                      Sign in as {roleOptions.find((r) => r.key === role)?.label}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-charcoal-50 pt-1">
                  Demo: pick a role and use any password of 6+ characters to continue.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
