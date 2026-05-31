import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, Input, Select, Button } from '../ui/index.js'
import { buildPlan, GOALS } from '../../utils/index.js'

function Stat({ label, value }) {
  return (
    <div className="flex-1 rounded-2xl border border-white/10 bg-ink-700/50 p-3 text-center">
      <p className="text-[11px] uppercase tracking-wide text-white/50">{label}</p>
      <p className="mt-1 font-display text-lg font-bold">{value}</p>
    </div>
  )
}

export default function AIPlanner() {
  const [form, setForm] = useState({ age: '', gender: 'male', height: '', weight: '', goal: 'fat_loss' })
  const [plan, setPlan] = useState(null)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.age || !form.height || !form.weight) return
    setPlan(buildPlan(form))
  }

  return (
    <section id="planner" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader eyebrow="AI Powered" title="AI Fitness Planner" subtitle="A rule-based engine that builds calories, training and nutrition around your goal." />
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={submit} className="glass rounded-3xl p-7">
          <div className="grid grid-cols-2 gap-4">
            <Input id="age" label="Age" type="number" value={form.age} onChange={set('age')} placeholder="25" />
            <Select id="gender" label="Gender" value={form.gender} onChange={set('gender')} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
            <Input id="height" label="Height (cm)" type="number" value={form.height} onChange={set('height')} placeholder="175" />
            <Input id="weight" label="Weight (kg)" type="number" value={form.weight} onChange={set('weight')} placeholder="70" />
          </div>
          <div className="mt-4"><Select id="goal" label="Goal" value={form.goal} onChange={set('goal')} options={GOALS} /></div>
          <Button type="submit" className="mt-6 w-full">Generate Plan</Button>
        </form>
        <div className="glass rounded-3xl p-7">
          {plan ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap gap-3">
                <Stat label="Daily Calories" value={`${plan.calories} kcal`} />
                <Stat label="Protein" value={`${plan.protein}g`} />
                <Stat label="Carbs" value={`${plan.carbs}g`} />
                <Stat label="Fats" value={`${plan.fats}g`} />
              </div>
              <h4 className="mt-6 font-display text-lg font-bold neon-text">Workout Plan</h4>
              <ul className="mt-2 space-y-1 text-sm text-white/70">{plan.workouts.map((d) => (<li key={d} className="flex gap-2"><span className="text-neon">▹</span>{d}</li>))}</ul>
              <h4 className="mt-6 font-display text-lg font-bold neon-text">Nutrition Plan</h4>
              <p className="mt-2 text-sm text-white/70">{plan.nutrition}</p>
            </motion.div>
          ) : (<p className="grid h-full place-items-center text-center text-white/40">Fill the form to generate your personalised plan.</p>)}
        </div>
      </div>
    </section>
  )
}
