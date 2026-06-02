import { useState, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BodyScene from '../../three/BodyScene.jsx'
import MusclePanel from './MusclePanel.jsx'
import { Button, Toggle, ErrorBoundary } from '../ui/index.js'
import { BRAND } from '../../constants/index.js'
import { MUSCLES } from '../../data/index.js'

// Muscle selector chips — since the GLB is a single mesh, users pick a
// muscle group here to open its info panel.
const MUSCLE_IDS = Object.keys(MUSCLES)

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
            <Toggle label="Body side" options={[{ label: 'Front', value: 'front' }, { label: 'Back', value: 'back' }]} value={side} onChange={setSide} />
            <Toggle label="Gender" options={[{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }]} value={gender} onChange={setGender} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button as={Link} to="/store" variant="solid">
              Visit Gym Store
            </Button>
            <Button as="a" href="#membership" variant="ghost">
              Explore Membership
            </Button>
          </div>

          <p className="mt-5 text-xs uppercase tracking-wider text-white/40">Select a muscle group</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {MUSCLE_IDS.map((id) => (
              <button
                key={id}
                onClick={() => setSelected(id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neon ${
                  selected === id ? 'border-neon bg-neon text-ink-900 shadow-neon-sm' : 'border-white/15 text-white/70 hover:border-neon/60 hover:text-neon'
                }`}
              >
                {MUSCLES[id].name.split(' (')[0]}
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs text-white/40">Tip: drag to rotate the model 360°. Use the toggles for front/back & gender.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="order-1 h-[60vh] w-full lg:order-2 lg:h-[80vh]">
          <ErrorBoundary>
            <Suspense fallback={<div className="flex h-full items-center justify-center text-neon">Loading 3D Engine...</div>}>
              <BodyScene side={side} gender={gender} />
            </Suspense>
          </ErrorBoundary>
        </motion.div>
      </div>

      <MusclePanel muscleId={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
