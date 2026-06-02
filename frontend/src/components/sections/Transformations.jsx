import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeader, Button } from '../ui/index.js'

const STORIES = [
  {
    name: 'Amit R.',
    result: '-18 kg in 6 months',
    quote: 'Three13 rebuilt my confidence and my body.',
    beforeImage: '/assets/transformations/amit-before.svg',
    afterImage: '/assets/transformations/amit-after.svg',
  },
  {
    name: 'Neha K.',
    result: '+7 kg lean mass',
    quote: 'The AI planner kept me consistent every single week.',
    beforeImage: '/assets/transformations/neha-before.svg',
    afterImage: '/assets/transformations/neha-after.svg',
  },
  {
    name: 'Vikram S.',
    result: 'Deadlift 80 -> 160 kg',
    quote: 'Best coaching I have ever had. Pure results.',
    beforeImage: '/assets/transformations/vikram-before.svg',
    afterImage: '/assets/transformations/vikram-after.svg',
  },
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
            {[
              { label: 'BEFORE', src: story.beforeImage },
              { label: 'AFTER', src: story.afterImage },
            ].map(({ label, src }) => (
              <div key={label} className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-700/60 shadow-sm">
                <img src={src} alt={`${story.name} ${label}`} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/40 px-3 py-2 text-sm text-white/90 backdrop-blur-sm">
                  {label}
                </div>
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
