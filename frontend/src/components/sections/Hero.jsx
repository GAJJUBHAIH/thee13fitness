import { useState } from 'react'
import { motion } from 'framer-motion'
import BodyScene from '../../three/BodyScene.jsx'
import MusclePanel from './MusclePanel.jsx'
import { Toggle } from '../ui/index.js'
import { BRAND } from '../../constants/index.js'

export default function Hero() {
  const [side, setSide] = useState('front')
  const [gender, setGender] = useState('male')
  const [selected, setSelected] = useState(null)

  return (
    <section id="home" className="relative min-h-screen w-full">
      <div className="grid-bg absolute inset-0" />
      <div id="explorer" className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-6 px-5 pt-24 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="order-2 lg:order-1">
          <span className="glass inline-block rounded-full px-4 py-1 text-xs font-semibold tracking-widest text-neon">{BRAND.name}</span>
          <h1 className="mt-4 font-display text-4xl font-black leading-tight sm:text-6xl">Build a Body<br /><span className="neon-text">Worth Flexing</span></h1>
          <p className="mt-4 max-w-md text-lg text-white/70">{BRAND.tagline}. Explore every muscle group in 3D, then train it with a plan engineered for results.</p>
          <p className="mt-2 text-sm font-semibold text-neon/80">{BRAND.quote}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Toggle label="Body side" options={[{ label: 'Front', value: 'front' }, { label: 'Back', value: 'back' }]} value={side} onChange={(v) => { setSide(v); setSelected(null) }} />
            <Toggle label="Gender" options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]} value={gender} onChange={setGender} />
          </div>
          <p className="mt-4 text-xs text-white/40">Tip: drag to rotate 360°, hover to highlight, click a muscle for details.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="order-1 h-[60vh] w-full lg:order-2 lg:h-[80vh]">
          <BodyScene side={side} gender={gender} selected={selected} onSelect={setSelected} />
        </motion.div>
      </div>
      <MusclePanel muscleId={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
