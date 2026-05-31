import { SectionHeader, Card, Button } from '../ui/index.js'
import { TRAINER_PLANS } from '../../data/index.js'

export default function PersonalTrainer() {
  return (
    <section id="personal-trainer" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader eyebrow="Personal Training" title="Train With a Pro" subtitle="Dedicated coaching to accelerate your transformation." />
      <div className="grid gap-8 sm:grid-cols-3">
        {TRAINER_PLANS.map((p, i) => (
          <Card key={p.months} popular={p.popular} className="text-center" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
            <h3 className="font-display text-xl font-bold">{p.months}</h3>
            <p className="mt-1 text-sm text-white/50">{p.sessions} Sessions</p>
            <p className="mt-5 font-display text-4xl font-black neon-text">₹{p.price}</p>
            <p className="mt-1 text-xs text-white/40">≈ ₹{Math.round(p.price / p.sessions)} / session</p>
            <Button as="a" href="#contact" className="mt-6 w-full">Book Now</Button>
          </Card>
        ))}
      </div>
    </section>
  )
}
