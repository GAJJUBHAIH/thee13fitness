import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MUSCLES } from '../../data/index.js'
import { DIFFICULTY_COLOR } from '../../constants/index.js'
import { VideoModal } from '../ui/index.js'

export default function MusclePanel({ muscleId, onClose }) {
  const [activeVideo, setActiveVideo] = useState(null)
  const data = muscleId ? MUSCLES[muscleId] : null

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {data && (
        <motion.aside
          key={muscleId}
          role="dialog"
          aria-modal="true"
          aria-label={data.name}
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 24 }}
          className="glass fixed right-0 top-0 z-40 flex h-full w-full max-w-md flex-col overflow-y-auto p-6 pt-24 shadow-neon"
        >
          <button onClick={onClose} className="absolute right-5 top-20 text-2xl text-white/60 hover:text-neon" aria-label="Close panel">✕</button>
          <h2 className="font-display text-2xl font-bold neon-text">{data.name}</h2>
          <span className={`mt-2 w-fit rounded-full border px-3 py-1 text-xs font-semibold ${DIFFICULTY_COLOR[data.difficulty]}`}>{data.difficulty}</span>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{data.description}</p>
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wider text-neon/80">Function</p>
            <p className="mt-1 text-sm text-white/80">{data.function}</p>
          </div>
          <h3 className="mt-6 font-display text-lg font-semibold">Related Exercises</h3>
          <div className="mt-3 space-y-3">
            {data.exercises.map((ex) => (
              <div key={ex.name} className="flex gap-3 rounded-xl border border-white/10 bg-ink-700/60 p-3 transition hover:border-neon/50">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-ink-800">
                  <img src={ex.image} alt={ex.name} className="h-full w-full object-cover" onError={(e) => { e.currentTarget.src = `${import.meta.env.BASE_URL}assets/exercises/_placeholder.svg` }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{ex.name}</p>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-white/60">
                    <span>{ex.sets} sets</span><span>{ex.reps} reps</span><span>Rest {ex.rest}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="inline-block text-[11px] text-neon/80">{ex.difficulty}</span>
                    {ex.videoId && (
                      <button 
                        onClick={() => setActiveVideo(ex.videoId)}
                        className="flex items-center gap-1 rounded bg-neon/10 px-2 py-1 text-[11px] font-semibold text-neon transition hover:bg-neon hover:text-black"
                      >
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        Watch Video
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.aside>
      )}
      
      {/* Video Modal Rendered Outside the Panel so it overlays everything */}
      <VideoModal 
        videoId={activeVideo} 
        isOpen={!!activeVideo} 
        onClose={() => setActiveVideo(null)} 
      />
    </AnimatePresence>
  )
}
