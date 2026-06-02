import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, Input, Button } from '../ui/index.js'
import WeightChart from './WeightChart.jsx'
import CaloriesChart from './CaloriesChart.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  
  const [weightLog, setWeightLog] = useState([
    { date: '2026-04-01', kg: 78 },
    { date: '2026-04-15', kg: 76.5 },
    { date: '2026-05-01', kg: 75 },
    { date: '2026-05-20', kg: 73.8 },
  ])
  
  const calorieLog = [
    { day: 'Mon', calories: 2400 },
    { day: 'Tue', calories: 2100 },
    { day: 'Wed', calories: 2600 },
    { day: 'Thu', calories: 2200 },
    { day: 'Fri', calories: 2500 },
    { day: 'Sat', calories: 2800 },
    { day: 'Sun', calories: 2300 },
  ]

  const [newWeight, setNewWeight] = useState('')
  const [measurements, setMeasurements] = useState({ chest: 98, waist: 82, arms: 36, thighs: 56 })
  const [userTokens, setUserTokens] = useState([])

  useEffect(() => {
    if (user?.uid) {
      const fetchTokens = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL
          const res = await fetch(`${apiUrl}/tokens/user/${user.uid}`)
          const data = await res.json()
          if (Array.isArray(data)) setUserTokens(data)
        } catch (e) {
          console.error("Failed to fetch tokens", e)
        }
      }
      fetchTokens()
    }
  }, [user])

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

  const getJoinDate = () => {
    if (user?.metadata?.creationTime) {
      return new Date(user.metadata.creationTime).toLocaleDateString()
    }
    return 'Recent'
  }

  const downloadQRCode = (token) => {
    if (!token.qrCodeData) return;
    const a = document.createElement('a');
    a.href = token.qrCodeData;
    a.download = `QR_${token.tokenId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section id="dashboard" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader eyebrow="Members Only" title="Member Dashboard" />
      <div className="grid gap-6 lg:grid-cols-4">
        
        {/* Profile Card */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-6 lg:col-span-4 flex justify-between items-center flex-wrap gap-4">
             <div className="flex items-center gap-4">
               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neon/20 border-2 border-neon text-neon text-2xl font-bold">
                 {(user.displayName || 'U').charAt(0).toUpperCase()}
               </div>
               <div>
                 <h2 className="font-display text-2xl font-bold neon-text">{user.displayName || 'Premium User'}</h2>
                 <p className="text-white/60">{user.email}</p>
                 <p className="text-sm text-white/40 mt-1">Joined: {getJoinDate()}</p>
               </div>
             </div>
             <div className="flex gap-4 text-center">
               <div className="bg-ink-800/50 rounded-2xl p-4 border border-white/5 min-w-[120px]">
                 <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Workouts</p>
                 <p className="font-display text-3xl font-bold text-neon">42</p>
               </div>
               <div className="bg-ink-800/50 rounded-2xl p-4 border border-white/5 min-w-[120px]">
                 <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Streak</p>
                 <p className="font-display text-3xl font-bold text-neon">7 <span className="text-sm text-white/40">days</span></p>
               </div>
             </div>
          </motion.div>
        )}

        {/* My Tokens / Memberships */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-6 lg:col-span-1 overflow-hidden flex flex-col max-h-[400px]">
          <h3 className="font-display text-lg font-bold neon-text shrink-0">My Purchases</h3>
          <div className="mt-6 flex-1 overflow-y-auto pr-2 space-y-4">
            {userTokens.length > 0 ? userTokens.map(t => (
              <div key={t.tokenId} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm relative group">
                <p className="font-bold text-neon mb-1">{t.itemName}</p>
                <p className="font-mono text-xs text-white/60">ID: {t.tokenId}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${t.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {t.status}
                  </span>
                  {t.qrCodeData && (
                    <button onClick={() => downloadQRCode(t)} className="text-xs text-neon hover:text-white underline">
                      QR Code
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div className="text-white/40 text-sm italic py-4">No active tokens or memberships.</div>
            )}
          </div>
        </motion.div>

        {/* Calories Tracker */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-bold neon-text">Calories Burned (This Week)</h3>
          <div className="mt-4"><CaloriesChart data={calorieLog} /></div>
        </motion.div>

        {/* Progress & Attendance */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-6 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-bold neon-text">Weight Progress</h3>
            <p className="mt-2 text-sm text-white/60">Change this month</p>
            <p className={`font-display text-4xl font-black ${stats.diff <= 0 ? 'text-neon' : 'text-orange-400'}`}>{stats.diff > 0 ? '+' : ''}{stats.diff} kg</p>
            <p className="mt-1 text-xs text-white/40">{stats.first} kg {'->'} {stats.last} kg</p>
          </div>
          <div className="mt-6">
            <h3 className="font-display text-lg font-bold neon-text">Attendance</h3>
            <p className="mt-2 font-display text-2xl font-black">18<span className="text-base text-white/40">/22</span></p>
            <div className="mt-3 flex gap-1">
               {Array.from({ length: 7 }).map((_, i) => (<span key={i} className={`h-8 flex-1 rounded ${i < 5 ? 'bg-neon' : 'bg-white/10'}`} />))}
            </div>
          </div>
        </motion.div>

        {/* Weight Log Chart */}
        <div className="glass rounded-3xl p-6 lg:col-span-3">
          <h3 className="font-display text-lg font-bold neon-text">Weight History</h3>
          <div className="mt-4"><WeightChart data={weightLog} /></div>
          <form onSubmit={addWeight} className="mt-4 flex gap-3">
            <input type="number" step="0.1" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} placeholder="Log today's weight (kg)" className="flex-1 rounded-xl border border-white/10 bg-ink-700/60 px-4 py-2.5 outline-none focus:border-neon" aria-label="Log weight" />
            <Button type="submit">Log Weight</Button>
          </form>
        </div>

        {/* Body Measurements */}
        <div className="glass rounded-3xl p-6 lg:col-span-1">
          <h3 className="font-display text-lg font-bold neon-text">Measurements</h3>
          <div className="mt-6 space-y-4">
            {Object.entries(measurements).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-sm capitalize font-medium text-white/80">{k}</span>
                <div className="flex items-center gap-2">
                  <input type="number" value={v} onChange={(e) => setMeasurements((m) => ({ ...m, [k]: e.target.value }))} className="w-16 rounded bg-transparent text-right font-display text-lg font-bold text-neon outline-none" aria-label={k} />
                  <span className="text-xs text-white/40 font-bold">cm</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
