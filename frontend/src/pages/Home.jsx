import { MainLayout } from '../layouts/index.js'
import Hero from '../components/sections/Hero.jsx'
import {
  Membership, PersonalTrainer, Services, BMICalculator,
  AIPlanner, Transformations, Trainers, Contact,
} from '../components/sections/index.js'

export default function Home() {
  return (
    <MainLayout>
      <main>
        <Hero />
        <Membership />
        <PersonalTrainer />
        <Services />
        <BMICalculator />
        <AIPlanner />
        <Transformations />
        <Trainers />
        <Contact />
      </main>
    </MainLayout>
  )
}
