import { motion } from 'framer-motion'

export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="mb-12 text-center"
    >
      {eyebrow && (
        <span className="glass inline-block rounded-full px-4 py-1 text-xs font-semibold tracking-widest text-neon">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 font-display text-3xl font-black sm:text-5xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-2xl text-white/60">{subtitle}</p>}
    </motion.div>
  )
}
