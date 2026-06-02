import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Input, Button } from '../components/ui/index.js'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      await resetPassword(email)
      setMessage('Password reset email sent! Please check your inbox.')
    } catch (err) {
      setError(err?.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950 px-5 py-20 text-white flex items-center justify-center">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-neon/15 via-transparent to-transparent blur-3xl" />
      <div className="relative w-full max-w-md">
        <form onSubmit={submit} noValidate className="glass rounded-[32px] border border-white/10 bg-slate-950/85 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="flex flex-col gap-3 text-center">
            <div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-neon/10 text-neon mb-4 text-2xl">
                🔑
              </span>
              <h2 className="text-3xl font-black text-white">Reset Password</h2>
            </div>
            <p className="text-sm text-white/60">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          <div className="mt-8 space-y-5">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email address"
              autoComplete="email"
              spellCheck="false"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200" aria-live="assertive">
              {error}
            </p>
          )}
          
          {message && (
            <p className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200" aria-live="assertive">
              {message}
            </p>
          )}

          <Button type="submit" className="mt-8 w-full px-6 py-3" disabled={loading || !email}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <div className="mt-6 text-center text-sm text-white/60">
            Remember your password? <Link to="/login" className="text-neon hover:text-white">Log in</Link>
          </div>
        </form>
      </div>
    </section>
  )
}
