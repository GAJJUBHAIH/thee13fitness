import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS } from '../constants/index.js'
import { Button } from '../components/ui/index.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-neon-sm' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-neon font-display text-neon shadow-neon-sm">
            🌲
          </span>
          <span className="font-display text-lg font-bold tracking-wider">
            three<span className="neon-text">13</span> Fitness
          </span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm font-medium text-white/70 transition hover:text-neon">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Button as="a" href="/#membership" className="text-sm">Join Now</Button>
          </li>
        </ul>

        <button
          className="md:hidden text-neon"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-neon" />
            <span className="block h-0.5 w-6 bg-neon" />
            <span className="block h-0.5 w-6 bg-neon" />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass overflow-hidden md:hidden"
          >
            {NAV_LINKS.map((l) => (
              <li key={l.href} className="border-b border-white/5">
                <a href={l.href} onClick={() => setOpen(false)} className="block px-6 py-3 text-white/80 hover:text-neon">
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}
