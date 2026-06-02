import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { SectionHeader, Card, Button } from '../ui/index.js'
import { MEMBERSHIP } from '../../data/index.js'

export default function Membership() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const handleGetPlan = async (plan, tier) => {
    if (!user) {
      navigate('/login')
      return
    }
    
    setLoading(true)
    setFeedback(`Processing purchase for ${plan.title} - ${tier.label}...`)
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
      const response = await fetch(`${apiUrl}/payments/create-mock-purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenData: {
            type: 'membership',
            userId: user.uid,
            userName: user.displayName || 'Member',
            email: user.email || '',
            phone: '',
            itemId: `${plan.title}-${tier.label}`,
            itemName: `${plan.title} (${tier.label})`,
            amount: tier.price,
            quantity: 1
          }
        })
      });

      const data = await response.json();
      
      if (data.valid) {
        setFeedback(`Success! Token: ${data.token}`);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setFeedback('Failed to generate token.');
      }
    } catch (err) {
      console.error(err);
      setFeedback('Network error during purchase.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="membership" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader eyebrow="Membership" title="Choose Your Plan" subtitle="Flexible durations. No hidden fees. Cancel anytime." />
      
      {feedback && (
        <div className="mb-8 text-center p-4 bg-white/5 border border-neon rounded-xl text-neon font-bold">
          {feedback}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {MEMBERSHIP.map((plan, i) => (
          <Card key={plan.title} popular={plan.popular} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
            <h3 className="font-display text-2xl font-bold neon-text">{plan.title}</h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {plan.tiers.map((t) => (
                <div key={t.label} className="rounded-2xl border border-white/10 bg-ink-700/50 p-4 transition hover:border-neon/50 flex flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">{t.label}</p>
                    <p className="mt-1 font-display text-2xl font-bold">₹{t.price}</p>
                    {t.save && <p className="mt-1 text-[11px] text-neon/80">{t.save}</p>}
                  </div>
                  <button 
                    disabled={loading}
                    onClick={() => handleGetPlan(plan, t)} 
                    className="mt-4 text-xs font-bold bg-white/5 hover:bg-neon hover:text-black py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
            <ul className="mt-5 space-y-2 text-sm text-white/70">
              {plan.perks.map((p) => (<li key={p} className="flex items-center gap-2"><span className="text-neon">✓</span> {p}</li>))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  )
}
