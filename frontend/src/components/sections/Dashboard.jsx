import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, Input, Button } from '../ui/index.js'
import WeightChart from './WeightChart.jsx'
import CaloriesChart from './CaloriesChart.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { pb, isPocketBaseEnabled } from '../../services/pocketbase.js'

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
  const [userOrders, setUserOrders] = useState([])
  const [offlineData, setOfflineData] = useState({
    membership_plan: '',
    membership_start: '',
    membership_end: ''
  })

  useEffect(() => {
    if (user?.id) {
      const fetchOrders = async () => {
        try {
          const records = await pb.collection('orders').getFullList({
            filter: `user = "${user.id}"`,
            sort: '-created'
          })
          setUserOrders(records)
        } catch (e) {
          console.error("Failed to fetch orders", e)
        }
      }
      fetchOrders()
      
      setOfflineData({
        membership_plan: user.membership_plan || '',
        membership_start: user.membership_start ? user.membership_start.substring(0, 10) : '',
        membership_end: user.membership_end ? user.membership_end.substring(0, 10) : ''
      })
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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!isPocketBaseEnabled) return alert("Avatar upload requires backend connection.")
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      await pb.collection('users').update(user.id, formData)
      // Refresh auth to get new avatar URL
      await pb.collection('users').authRefresh()
    } catch (err) {
      console.error(err)
      alert("Failed to upload profile picture.")
    }
  }

  const handleUpdateOfflineData = async (e) => {
    e.preventDefault()
    try {
      await pb.collection('users').update(user.id, offlineData)
      await pb.collection('users').authRefresh()
      alert("Membership details updated!")
    } catch (err) {
      console.error(err)
      alert("Failed to update membership details.")
    }
  }

  return (
    <section id="dashboard" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader eyebrow="Members Only" title="Member Dashboard" />
      <div className="grid gap-6 lg:grid-cols-4">
        
        {/* Profile Card */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-6 lg:col-span-4 flex justify-between items-center flex-wrap gap-4">
             <div className="flex items-center gap-4">
              <div className="group relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-neon bg-neon/20 text-2xl font-bold text-neon cursor-pointer">
                 {user.avatar ? (
                   <img src={`${pb.baseUrl}/api/files/users/${user.id}/${user.avatar}`} alt="Avatar" className="h-full w-full object-cover" />
                 ) : (
                   (user.displayName || user.name || 'U').charAt(0).toUpperCase()
                 )}
                 <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 cursor-pointer opacity-0" title="Upload Profile Picture" />
                 <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center text-xs text-white">Edit</div>
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

        {/* Offline Gym Access Section */}
        {user?.offline_access && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-6 lg:col-span-4">
            <h3 className="font-display text-lg font-bold neon-text">Offline Gym Access Details</h3>
            <form onSubmit={handleUpdateOfflineData} className="mt-6 grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm text-white/60 mb-2">Membership Plan</label>
                <select 
                  value={offlineData.membership_plan}
                  onChange={e => setOfflineData({...offlineData, membership_plan: e.target.value})}
                  className="w-full rounded-xl border border-white/10 bg-ink-700/60 px-4 py-2.5 outline-none focus:border-neon"
                >
                  <option value="">Select Plan</option>
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Start Date</label>
                <input 
                  type="date"
                  value={offlineData.membership_start}
                  onChange={e => setOfflineData({...offlineData, membership_start: e.target.value})}
                  className="w-full rounded-xl border border-white/10 bg-ink-700/60 px-4 py-2.5 outline-none focus:border-neon text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">End Date</label>
                <input 
                  type="date"
                  value={offlineData.membership_end}
                  onChange={e => setOfflineData({...offlineData, membership_end: e.target.value})}
                  className="w-full rounded-xl border border-white/10 bg-ink-700/60 px-4 py-2.5 outline-none focus:border-neon text-white"
                />
              </div>
              <div className="md:col-span-3 flex justify-end mt-2">
                <Button type="submit">Save Membership Details</Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Order History */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-3xl p-6 lg:col-span-1 overflow-hidden flex flex-col max-h-[400px]">
          <h3 className="font-display text-lg font-bold neon-text shrink-0">Order History</h3>
          <div className="mt-6 flex-1 overflow-y-auto pr-2 space-y-4">
            {userOrders.length > 0 ? userOrders.map(order => (
              <div key={order.id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm relative group">
                <p className="font-bold text-neon mb-1">{order.orderId}</p>
                <p className="font-mono text-xs text-white/60">₹{order.amount.toFixed(2)} - {order.products?.length || 0} items</p>
                <div className="flex justify-between items-center mt-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {order.paymentStatus}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${order.deliveryStatus === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {order.deliveryStatus}
                  </span>
                  <button onClick={() => alert('Invoice PDF downloaded!')} className="text-xs text-neon hover:text-white underline">
                    Invoice
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-white/40 text-sm italic py-4">No order history available.</div>
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

        {/* Wishlist & Saved Addresses */}
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-bold neon-text">My Wishlist</h3>
          <div className="mt-4 flex flex-col gap-3">
             <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex justify-between items-center text-sm">
                <span>Premium Protein Whey 2kg</span>
                <button className="text-neon hover:text-white underline text-xs">Add to Cart</button>
             </div>
             <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex justify-between items-center text-sm">
                <span>Yoga Mat Pro</span>
                <button className="text-neon hover:text-white underline text-xs">Add to Cart</button>
             </div>
          </div>
        </div>
        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-bold neon-text">Saved Addresses</h3>
          <div className="mt-4 flex flex-col gap-3">
             <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm relative">
                <span className="absolute top-4 right-4 bg-neon/10 text-neon px-2 py-0.5 rounded text-[10px] uppercase font-bold">Default</span>
                <p className="font-bold text-white mb-1">Home</p>
                <p className="text-white/60">A-142, Sector 4, Noida, UP, 201301</p>
             </div>
             <button className="w-full rounded-xl border border-white/10 bg-transparent p-4 text-sm text-neon hover:bg-white/5 transition-colors border-dashed text-center">
               + Add New Address
             </button>
          </div>
        </div>

      </div>
    </section>
  )
}
