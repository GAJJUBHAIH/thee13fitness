import { useState } from 'react'
import { SectionHeader, Card, Button } from '../ui/index.js'
import { useNavigate } from 'react-router-dom'
import { TRAINER_PLANS, TRAINERS } from '../../data/index.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { pb } from '../../services/pocketbase.js'

export default function PersonalTrainer() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedTrainer, setSelectedTrainer] = useState(TRAINERS[0]?.name || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const handleBookClick = (plan) => {
    if (!user) {
      navigate('/login')
      return
    }
    setSelectedPlan(plan)
    setIsModalOpen(true)
    setSuccessMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await pb.collection('pt_requests').create({
        user: user.id,
        plan: selectedPlan.months,
        trainer: selectedTrainer,
        status: 'Pending'
      })
      
      setSuccessMsg('Request submitted successfully! We will contact you soon.')
      setTimeout(() => {
        setIsModalOpen(false)
      }, 2000)
    } catch (err) {
      console.error(err)
      alert('Failed to submit request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="personal-trainer" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader eyebrow="Personal Training" title="Train With a Pro" subtitle="Dedicated coaching to accelerate your transformation." />
      
      {!user ? (
        <div className="mt-8 text-center bg-white/5 border border-white/10 p-10 rounded-[2rem] max-w-2xl mx-auto">
          <h3 className="font-display text-2xl font-bold text-white mb-2">Login to see the information</h3>
          <p className="text-white/60 mb-6">Discover our elite personal trainers and bespoke training plans.</p>
          <Button onClick={() => navigate('/login')}>Login Now</Button>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-3">
          {TRAINER_PLANS.map((p, i) => (
            <Card key={p.months} popular={p.popular} className="text-center" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <h3 className="font-display text-xl font-bold">{p.months}</h3>
              <p className="mt-1 text-sm text-white/50">{p.sessions} Sessions</p>
              <p className="mt-5 font-display text-4xl font-black neon-text">₹{p.price}</p>
              <p className="mt-1 text-xs text-white/40">≈ ₹{Math.round(p.price / p.sessions)} / session</p>
              <Button onClick={() => handleBookClick(p)} className="mt-6 w-full">Book Now</Button>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-ink-900 border border-white/10 rounded-2xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-6 font-display">Book Personal Training</h3>
            
            {successMsg ? (
              <div className="bg-green-500/10 text-green-400 p-4 rounded-xl text-center border border-green-500/20">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-white/50 mb-1">Selected Plan</label>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10 font-bold">
                    {selectedPlan?.months} - ₹{selectedPlan?.price}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-white/50 mb-1">Select Trainer</label>
                  <select 
                    value={selectedTrainer}
                    onChange={(e) => setSelectedTrainer(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-lg text-white outline-none focus:border-neon transition-colors"
                  >
                    {TRAINERS.map(t => (
                      <option key={t.name} value={t.name} className="bg-ink-900">{t.name}</option>
                    ))}
                  </select>
                </div>
                
                <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
