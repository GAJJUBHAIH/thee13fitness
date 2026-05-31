import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Loader, ScrollProgress } from './components/ui/index.js'
import AppRoutes from './routes/AppRoutes.jsx'
import { useGsapReveal } from './hooks/index.js'

export default function App() {
  const location = useLocation()
  const [booting, setBooting] = useState(true)
  useGsapReveal([location.pathname])

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-ink-900 text-[#e6f5e6]">
      <AnimatePresence>{booting && <Loader />}</AnimatePresence>
      <ScrollProgress />
      <AppRoutes />
    </div>
  )
}
