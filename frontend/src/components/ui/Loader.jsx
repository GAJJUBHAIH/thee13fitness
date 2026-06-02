import { motion } from 'framer-motion'

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] grid place-items-center bg-ink-900"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="mx-auto h-16 w-16 rounded-full border-2 border-white/10 border-t-neon shadow-neon"
        />
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="mt-5 font-display text-xl font-bold"
        >
          Three13 Fitness
        </motion.p>
        <p className="mt-1 text-xs tracking-widest text-white/40">HEALTH IS REAL WEALTH</p>
      </div>
    </motion.div>
  )
}
