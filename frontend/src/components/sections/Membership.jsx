import { motion } from 'framer-motion'
import { SectionHeader, Card, Button } from '../ui/index.js'
import { MEMBERSHIP } from '../../data/index.js'

export default function Membership() {
  return (
    <section id="membership" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader eyebrow="Membership" title="Choose Your Plan" subtitle="Flexible durations. No hidden fees. Cancel anytime." />
      <div className="grid gap-8 md:grid-cols-2">
        {MEMBERSHIP.map((plan, i) => (
          <Card key={plan.title} popular={plan.popular} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
            <h3 className="font-display text-2xl font-bold neon-text">{plan.title}</h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {plan.tiers.map((t) => (
                <div key={t.label} className="rounded-2xl border border-white/10 bg-ink-700/50 p-4 transition hover:border-neon/50">
                  <p className="text-xs uppercase tracking-wide text-white/50">{t.label}</p>
                  <p className="mt-1 font-display text-2xl font-bold">₹{t.price}</p>
                  {t.save && <p className="mt-1 text-[11px] text-neon/80">{t.save}</p>}
                </div>
              ))}
            </div>
            <ul className="mt-5 space-y-2 text-sm text-white/70">
              {plan.perks.map((p) => (<li key={p} className="flex items-center gap-2"><span className="text-neon">✓</span> {p}</li>))}
            </ul>
            <Button as="a" href="#contact" className="mt-6 w-full">Get {plan.title}</Button>
          </Card>
        ))}
      </div>
    </section>
  )
}
