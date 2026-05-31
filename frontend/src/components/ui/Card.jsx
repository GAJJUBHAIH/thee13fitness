import { motion } from 'framer-motion'
import { CARD } from '../../constants/index.js'

export default function Card({ popular = false, hover = false, className = '', children, ...motionProps }) {
  return (
    <motion.div
      className={`${CARD} relative ${popular ? 'border-neon/60 shadow-neon' : ''} ${hover ? 'transition hover:border-neon/50 hover:shadow-neon-sm' : ''} ${className}`}
      {...motionProps}
    >
      {popular && (
        <span className="absolute -top-3 right-6 rounded-full bg-neon px-3 py-1 text-xs font-bold text-ink-900 shadow-neon-sm">
          MOST POPULAR
        </span>
      )}
      {children}
    </motion.div>
  )
}
