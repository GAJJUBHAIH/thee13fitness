import { motion } from 'framer-motion'
import { SectionHeader } from '../ui/index.js'
import { SERVICES } from '../../data/index.js'

export default function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader eyebrow="What We Offer" title="Our Services" subtitle="Everything you need under one roof." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s, i) => (
          <motion.div key={s.title} data-reveal initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 4) * 0.08 }} whileHover={{ y: -6 }} className="glass group rounded-2xl p-6 transition hover:border-neon/50 hover:shadow-neon-sm">
            <div className="grid h-14 w-14 place-items-center rounded-xl border border-neon/40 text-2xl transition group-hover:shadow-neon-sm">{s.icon}</div>
            <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-white/60">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
