import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { Loader, ScrollProgress, ThemeSwitcher } from './components/ui/index.js'
import AppRoutes from './routes/AppRoutes.jsx'
import { useGsapReveal } from './hooks/index.js'

export default function App() {
  const location = useLocation()
  const [booting, setBooting] = useState(true)
  useGsapReveal([location.pathname])

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1400)
    
    // Handle Session Persistence / Remember Me
    const handleUnload = () => {
      if (window.sessionStorage.getItem('three13_no_remember') === 'true') {
        // Clear local storage auth if they didn't want to be remembered
        window.localStorage.removeItem('pocketbase_auth')
      }
    }
    window.addEventListener('beforeunload', handleUnload)
    
    return () => {
      clearTimeout(t)
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 0)
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }, [location])

  return (
    <div className="min-h-screen bg-ink-900">
      <AnimatePresence>{booting && <Loader />}</AnimatePresence>
      <ScrollProgress />
      <ThemeSwitcher />
      <AppRoutes />
    </div>
  )
}
