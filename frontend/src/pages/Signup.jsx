import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Input, Button } from '../components/ui/index.js'

const passwordChecks = [
  { id: 'length', label: 'At least 8 characters', rule: (value) => value.length >= 8 },
  { id: 'uppercase', label: 'At least one uppercase letter', rule: (value) => /[A-Z]/.test(value) },
  { id: 'number', label: 'At least one number', rule: (value) => /\d/.test(value) },
  { id: 'special', label: 'At least one special character', rule: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value) },
]

export default function Signup() {
  const { signup, googleLogin } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', email: '', mobile: '', role: 'User', password: '', confirmPassword: '', agreed: false })
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const passwordStatus = useMemo(
    () => passwordChecks.map((check) => ({ ...check, valid: check.rule(form.password) })),
    [form.password]
  )

  const isPasswordValid = passwordStatus.every((check) => check.valid)
  const passwordsMatch = form.password && form.password === form.confirmPassword
  const canSubmit =
    form.name && form.username && form.email && form.mobile && form.password && form.confirmPassword && form.role && form.agreed && isPasswordValid && passwordsMatch

  const submit = async (e) => {
    e.preventDefault()
    
    if (!form.name || !form.username || !form.email || !form.mobile || !form.password || !form.confirmPassword || !form.role) {
      setFeedback('Please fill out all fields.')
      return
    }
    if (!isPasswordValid) {
      setFeedback('Please complete all password strength requirements.')
      return
    }
    if (!passwordsMatch) {
      setFeedback('Passwords do not match.')
      return
    }
    if (!form.agreed) {
      setFeedback('You must agree to the Terms & Conditions and Privacy Policy.')
      return
    }

    setFeedback('')
    setLoading(true)
    try {
      await signup(form.name, form.email, form.password, form.role, form.username, form.mobile)
      nav('/')
    } catch (err) {
      if (err.response && err.response.data) {
        const messages = Object.values(err.response.data).map(d => d.message).join(' ')
        setFeedback(err.message + (messages ? ' ' + messages : ''))
      } else {
        setFeedback(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    if (!form.agreed) {
      setFeedback('You must agree to the Terms & Conditions and Privacy Policy to sign up with Google.')
      return
    }
    setFeedback('')
    setLoading(true)
    try {
      await googleLogin()
      nav('/')
    } catch (err) {
      setFeedback(err?.message || 'Google sign-up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid-bg grid min-h-screen place-items-center px-5 py-20">
      <form onSubmit={submit} className="glass w-full max-w-xl rounded-[2rem] border border-white/10 p-8 shadow-neon-sm">
        <div className="mb-8 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.4em] text-neon shadow-neon-sm">
            <span>🏋️</span> Signup Here
          </p>
          <h1 className="mt-6 text-3xl font-black text-white sm:text-4xl">Create your account</h1>
        </div>

        <div className="grid gap-4">
          <Input id="name" label="Full Name" value={form.name} onChange={set('name')} placeholder="Your full name" required />
          <Input id="username" label="Username" value={form.username} onChange={set('username')} placeholder="Choose a username" required />
          <Input id="email" label="Email" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
          <div>
            <label htmlFor="mobile" className="block text-sm text-white/60">Mobile Number</label>
            <div className="mt-2 flex overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
              <span className="flex items-center bg-white/5 px-4 text-sm text-white/70">+91</span>
              <input
                id="mobile"
                type="tel"
                value={form.mobile}
                onChange={set('mobile')}
                placeholder="10-digit number"
                className="w-full border-none bg-transparent px-4 py-3 text-white outline-none focus:ring-0"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm text-white/60">Role</label>
            <select
              id="role"
              value={form.role}
              onChange={set('role')}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-ink-900 px-4 py-3 text-white outline-none focus:border-neon"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <Input
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="Create a strong password"
            required
          />
          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={set('confirmPassword')}
            placeholder="Confirm your password"
            required
          />
        </div>

        <div className="mt-5 rounded-3xl bg-white/5 p-4 text-sm text-white/80">
          {passwordStatus.map((check) => (
            <p key={check.id} className={`flex items-center gap-2 ${check.valid ? 'text-emerald-300' : 'text-red-400'}`}>
              <span>{check.valid ? '✓' : '✕'}</span> {check.label}
            </p>
          ))}
        </div>

        <label className="mt-6 flex items-start gap-3 text-sm text-white/70">
          <input
            type="checkbox"
            checked={form.agreed}
            onChange={(e) => setForm((f) => ({ ...f, agreed: e.target.checked }))}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-ink-900 text-neon focus:ring-neon"
          />
          <span>
            I agree to the <Link to="/terms" className="text-neon underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-neon underline">Privacy Policy</Link>.
          </span>
        </label>

        {feedback && <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{feedback}</p>}

        <Button type="submit" className="mt-6 w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-white/10" />
          <span className="px-3 text-sm text-white/50">or</span>
          <hr className="w-full border-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign up with Google
        </button>

        <p className="mt-4 text-center text-sm text-white/50">
          Already have an account? <Link to="/login" className="text-neon">Login</Link>
        </p>
      </form>
    </div>
  )
}
