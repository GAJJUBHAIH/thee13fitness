import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Input, Button } from '../components/ui/index.js'

export default function Signup() {
  const { signup } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(form.name, form.email, form.password)
      nav('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid-bg grid min-h-screen place-items-center px-5 pt-20">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-8">
        <h1 className="font-display text-3xl font-black">Join <span className="neon-text">ThreeB</span></h1>
        <p className="mt-1 text-sm text-white/50">Body Makes You 80% Ahead.</p>
        <div className="mt-6"><Input id="name" label="Name" value={form.name} onChange={set('name')} required /></div>
        <div className="mt-4"><Input id="email" label="Email" type="email" value={form.email} onChange={set('email')} required /></div>
        <div className="mt-4"><Input id="password" label="Password" type="password" value={form.password} onChange={set('password')} required minLength={6} /></div>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <Button type="submit" className="mt-6 w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</Button>
        <p className="mt-4 text-center text-sm text-white/50">
          Have an account? <Link to="/login" className="text-neon">Log in</Link>
        </p>
      </form>
    </div>
  )
}
