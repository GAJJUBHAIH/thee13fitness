import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { pb } from '../../services/pocketbase.js'
import { SectionHeader, Card, Button } from '../ui/index.js'
import { MEMBERSHIP } from '../../data/index.js'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

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
      const tokenId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `TK-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      const record = await pb.collection('tokens').create({
        tokenId: tokenId,
        type: 'membership',
        userId: user?.id || user?.uid || '',
        user: {
          name: user?.displayName || 'Member',
          email: user?.email || '',
          phone: ''
        },
        itemId: `${plan.title}-${tier.label}`,
        itemName: `${plan.title} (${tier.label})`,
        amount: tier.price,
        quantity: 1,
        status: 'success',
        purchaseDate: new Date().toISOString()
      });
      
      if (record) {
        setFeedback(`Success! Token: ${record.tokenId}`);
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
      <div className="absolute inset-0 gradient-radial-primary pointer-events-none" />
      <SectionHeader eyebrow="Membership" title="Choose Your Plan" subtitle="Flexible durations. No hidden fees. Cancel anytime." />
      
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center p-4 bg-white/5 border border-neon rounded-xl text-neon font-bold"
        >
          {feedback}
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid gap-8 md:grid-cols-2 relative"
      >
        {MEMBERSHIP.map((plan) => (
          <motion.div key={plan.title} variants={cardVariants}>
            <Card popular={plan.popular} className={plan.popular ? 'animated-border' : ''}>
              <h3 className="font-display text-2xl font-bold neon-text">{plan.title}</h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {plan.tiers.map((t) => (
                  <div key={t.label} className="rounded-2xl border border-white/10 bg-ink-700/50 p-4 transition-all duration-300 hover:border-neon/50 hover:bg-neon/5 flex flex-col justify-between group">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-white/50">{t.label}</p>
                      <p className="mt-1 font-display text-2xl font-bold">₹{t.price}</p>
                      {t.save && <p className="mt-1 text-[11px] text-neon/80">{t.save}</p>}
                    </div>
                    <button
                      disabled={loading}
                      onClick={() => handleGetPlan(plan, t)}
                      className="mt-4 text-xs font-bold bg-white/5 hover:bg-neon hover:text-black py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50 group-hover:bg-neon/10 active:scale-95"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
              <ul className="mt-5 space-y-2 text-sm text-white/70">
                {plan.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-neon shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
