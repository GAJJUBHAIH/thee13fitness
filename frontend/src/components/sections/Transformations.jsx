import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeader, Button } from '../ui/index.js'

const STORIES = [
  { name: 'Amit R.', result: '-18 kg in 6 months', quote: 'ThreeB rebuilt my confidence and my body.' },
  { name: 'Neha K.', result: '+7 kg lean mass', quote: 'The AI planner kept me consistent every single week.' },
  { name: 'Vikram S.', result: 'Deadlift 80 -> 160 kg', quote: 'Best coaching I have ever had. Pure results.' },
]

export default function Transformations() {
  const [i, setI] = useState(0)
  const story = STORIES[i]
  const go = (d) => setI((p) => (p + d + STORIES.length) % STORIES.length)

  return (
    <section id="transformations" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader eyebrow="Real Results" title="Transformations" subtitle="Success stories from our members." />
      <div className="glass mx-auto max-w-4xl rounded-3xl p-6">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div className="grid grid-cols-2 gap-3">
            {['BEFORE', 'AFTER'].map((label, idx) => (
              <div key={label} className={`grid aspect-[3/4] place-items-center rounded-2xl border ${idx ? 'border-neon/60 shadow-neon-sm' : 'border-white/10'} bg-ink-700/60`}>
                <span className={idx ? 'neon-text font-display font-bold' : 'text-white/40 font-display font-bold'}>{label}</span>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }}>
              <p className="font-display text-2xl font-bold neon-text">{story.result}</p>
              <p className="mt-3 text-white/70">“{story.quote}”</p>
              <p className="mt-2 text-sm text-white/40">— {story.name}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Button onClick={() => go(-1)} className="px-4 py-1.5" aria-label="Previous story">‹</Button>
          <div className="flex gap-2">{STORIES.map((_, idx) => (<span key={idx} className={`h-2 w-2 rounded-full ${idx === i ? 'bg-neon shadow-neon-sm' : 'bg-white/20'}`} />))}</div>
          <Button onClick={() => go(1)} className="px-4 py-1.5" aria-label="Next story">›</Button>
        </div>
      </div>
    </section>
  )
}
