import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext.jsx'

const themes = [
  { id: 'theme-neon', name: 'Neon Green', color: '#39FF14' },
  { id: 'theme-dark-blue', name: 'Dark Blue', color: '#00BFFF' },
  { id: 'theme-red-energy', name: 'Red Energy', color: '#FF2A2A' },
  { id: 'theme-purple-neon', name: 'Purple Neon', color: '#BF40FF' },
  { id: 'theme-light-pro', name: 'Light Pro', color: '#2563EB' },
]

export default function ThemeSwitcher() {
  const { theme, changeTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 mb-2 flex flex-col gap-2 rounded-2xl border border-white/10 bg-ink-900/90 p-3 shadow-neon-sm backdrop-blur-xl"
          >
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  changeTheme(t.id)
                  setOpen(false)
                }}
                className={`group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5 ${
                  theme === t.id ? 'bg-white/10' : ''
                }`}
                title={t.name}
              >
                <span
                  className="h-5 w-5 rounded-full shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: t.color, boxShadow: `0 0 10px ${t.color}` }}
                />
                <span className="whitespace-nowrap text-sm font-medium text-white/80">{t.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-neon bg-ink-900 text-neon shadow-neon-sm transition-transform hover:scale-110 focus:outline-none"
        aria-label="Toggle Theme Switcher"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      </button>
    </div>
  )
}
