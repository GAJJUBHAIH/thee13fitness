import { MainLayout } from '../layouts/index.js'
import Hero from '../components/sections/Hero.jsx'
import {
  Membership, PersonalTrainer, Services, BMICalculator,
  AIPlanner, Transformations, Trainers, Contact,
} from '../components/sections/index.js'
import SEO from '../components/SEO.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { Link } from 'react-router-dom'

export default function Home() {
  const { user } = useAuth()

  return (
    <MainLayout>
      <SEO />
      <main>
        <Hero />
        
        {user ? (
          <>
            <Membership />
            <PersonalTrainer />
            <Services />
            <BMICalculator />
            <AIPlanner />
            <Transformations />
            <Trainers />
          </>
        ) : (
          <section className="relative mx-auto max-w-7xl px-5 py-24 text-center">
             <div className="glass rounded-3xl p-12 md:p-24 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-ink-900/50 to-ink-900/90 z-0"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-6xl mb-6">🔒</span>
                  <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-4">Login to see the information</h2>
                  <p className="text-white/60 max-w-lg mb-8 text-lg">
                    Information about our Trainers, Membership Plans, Transformations, and other exclusive details are hidden for guests.
                  </p>
                  <Link to="/login" className="bg-neon text-black font-bold py-4 px-10 rounded-full hover:bg-neon/90 transition-colors shadow-[0_0_20px_rgba(208,255,0,0.3)] text-lg">
                    Login / Sign Up
                  </Link>
                </div>
             </div>
          </section>
        )}
        
        <Contact />
      </main>
    </MainLayout>
  )
}
