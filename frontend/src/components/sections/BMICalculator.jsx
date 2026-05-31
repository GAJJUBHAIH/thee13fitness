import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeader, Input, Button } from '../ui/index.js'
import { calculateBMI, classifyBMI } from '../../utils/index.js'

export default function BMICalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState(null)

  const calc = (e) => {
    e.preventDefault()
    const bmi = calculateBMI(height, weight)
    if (bmi == null) return
    setResult({ bmi, ...classifyBMI(bmi) })
  }

  return (
    <section id="bmi" className="relative mx-auto max-w-7xl px-5 py-24">
      <SectionHeader eyebrow="Know Your Numbers" title="BMI Calculator" />
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <form onSubmit={calc} className="glass rounded-3xl p-7">
          <Input id="h" label="Height (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" />
          <div className="mt-4"><Input id="w" label="Weight (kg)" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" /></div>
          <Button type="submit" className="mt-6 w-full">Calculate</Button>
        </form>
        <div className="glass grid place-items-center rounded-3xl p-7 text-center">
          {result ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="text-sm uppercase tracking-wide text-white/50">Your BMI</p>
              <p className="font-display text-6xl font-black neon-text">{result.bmi}</p>
              <p className={`mt-2 text-xl font-bold ${result.color}`}>{result.cat}</p>
              <p className="mt-3 text-sm text-white/60">{result.advice}</p>
            </motion.div>
          ) : (<p className="text-white/40">Enter your details to see your BMI score and advice.</p>)}
        </div>
      </div>
    </section>
  )
}
