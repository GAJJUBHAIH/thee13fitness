import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, Input, Button } from '../ui/index.js'
import WeightChart from './WeightChart.jsx'

export default function Dashboard() {
  const [weightLog, setWeightLog] = useState([
    { date: '2026-04-01', kg: 78 },
    { date: '2026-04-15', kg: 76.5 },
    { date: '2026-05-01', kg: 75 },
    { date: '2026-05-20', kg: 73.8 },
  ])
  const [newWeight, setNewWeight] = useState('')
  const [measurements, setMeasurements] = useState({ chest: 98, waist: 82, arms: 36, thighs: 56 })

  const stats = useMemo(() => {
    const first = weightLog[0]?.kg
    const last = weightLog[weightLog.length - 1]?.kg
    const diff = first && last ? (last - first).toFixed(1) : 0
    return { first, last, diff }
  }, [weightLog])

  const addWeight = (e) => {
    e.preventDefault()
    const kg = parseFloat(newWeight)
    if (!kg) return
    setWeightLog((l) => [...l, { date: new Date().toISOString().slice(0, 10), kg }])
    setNewWeight('')
  }

  return (
    <section id="dashboard" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader eyebrow="Members Only" title="Member Dashboard" />
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-6">
          <h3 className="font-display text-lg font-bold neon-text">Membership Status</h3>
          <p className="mt-3 text-sm text-white/60">Plan</p>
          <p className="font-semibold">Cardio · 6 Month</p>
          <p className="mt-3 text-sm text-white/60">Status</p>
          <span className="mt-1 inline-block rounded-full border border-neon px-3 py-1 text-xs font-bold text-neon">ACTIVE</span>
          <div className="mt-4 rounded-xl border border-yellow-300/40 bg-yellow-300/5 p-3 text-sm text-yellow-200">Renewal reminder: expires in 23 days. Renew to keep your streak.</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-6">
          <h3 className="font-display text-lg font-bold neon-text">Attendance</h3>
          <p className="mt-2 text-sm text-white/60">This month</p>
          <p className="font-display text-4xl font-black">18<span className="text-base text-white/40">/22</span></p>
          <div className="mt-4 grid grid-cols-7 gap-1.5">{Array.from({ length: 28 }).map((_, i) => (<span key={i} className={`aspect-square rounded ${i % 7 === 6 ? 'bg-white/10' : i < 18 ? 'bg-neon/80' : 'bg-white/10'}`} />))}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-6">
          <h3 className="font-display text-lg font-bold neon-text">Progress</h3>
          <p className="mt-2 text-sm text-white/60">Weight change</p>
          <p className={`font-display text-4xl font-black ${stats.diff <= 0 ? 'text-neon' : 'text-orange-400'}`}>{stats.diff > 0 ? '+' : ''}{stats.diff} kg</p>
          <p className="mt-1 text-xs text-white/40">{stats.first} kg -> {stats.last} kg</p>
        </motion.div>
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-bold neon-text">Weight Log</h3>
          <div className="mt-4"><WeightChart data={weightLog} /></div>
          <form onSubmit={addWeight} className="mt-4 flex gap-3">
            <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="Log today's weight (kg)" className="flex-1 rounded-xl border border-white/10 bg-ink-700/60 px-4 py-2.5 outline-none focus:border-neon" aria-label="Log weight" />
            <Button type="submit">Add</Button>
          </form>
        </div>
        <div className="glass rounded-3xl p-6">
          <h3 className="font-display text-lg font-bold neon-text">Body Measurements</h3>
          <div className="mt-4 space-y-3">
            {Object.entries(measurements).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-sm capitalize text-white/60">{k}</span>
                <div className="flex items-center gap-2">
                  <input type="number" value={v} onChange={(e) => setMeasurements((m) => ({ ...m, [k]: e.target.value }))} className="w-20 rounded-lg border border-white/10 bg-ink-700/60 px-2 py-1 text-right outline-none focus:border-neon" aria-label={k} />
                  <span className="text-xs text-white/40">cm</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
