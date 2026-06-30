import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS } from '../constants/index.js'
import { Button } from '../components/ui/index.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href) || location.hash === href
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-neon-sm backdrop-blur-2xl' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/thee13fitness/assets/logos/logo.png" alt="Three13 Fitness Logo" className="h-10 w-auto rounded-full border border-neon/50 shadow-neon-sm group-hover:shadow-neon transition-shadow duration-500" />
          <span className="font-display text-lg font-bold tracking-wider hidden sm:inline-block">
            three<span className="neon-text">13</span> Fitness
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                to={l.href}
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  isActive(l.href) ? 'text-neon' : 'text-white/70 hover:text-neon'
                }`}
              >
                {l.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-neon transition-all duration-300 ${
                  isActive(l.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            </li>
          ))}
          <li>
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 mr-2">
                  <div className="h-8 w-8 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold border border-neon/50 shadow-neon-sm">
                    {(user.name || user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white/80">{user.name || user.displayName || 'Member'}</span>
                </div>
                {user.role === 'Admin' && (
                  <Button as={Link} to="/admin" variant="outline" className="text-sm border-neon text-neon">Admin</Button>
                )}
                <Button as={Link} to="/dashboard" className="text-sm">Dashboard</Button>
                <Button variant="ghost" onClick={logout} className="text-sm hover:text-rose-400">Logout</Button>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link to="/login" className="text-sm font-medium text-white/70 hover:text-neon transition">Login</Link>
                <Button as={Link} to="/signup" className="text-sm">Join Now</Button>
              </div>
            )}
          </li>
        </ul>

        {/* Animated Hamburger */}
        <button
          className="lg:hidden text-neon ml-auto relative w-7 h-6 flex flex-col justify-center items-center"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={`block h-0.5 w-6 bg-neon rounded-full transition-all duration-300 absolute ${open ? 'rotate-45 top-[11px]' : 'top-1'}`} />
          <span className={`block h-0.5 w-6 bg-neon rounded-full transition-all duration-300 ${open ? 'opacity-0 scale-0' : 'opacity-100'}`} />
          <span className={`block h-0.5 w-6 bg-neon rounded-full transition-all duration-300 absolute ${open ? '-rotate-45 bottom-[11px]' : 'bottom-1'}`} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="glass overflow-hidden lg:hidden border-t border-white/5"
          >
            {NAV_LINKS.map((l, i) => (
              <motion.li
                key={l.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-white/5"
              >
                <Link
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className={`block px-6 py-3 transition-colors ${isActive(l.href) ? 'text-neon bg-neon/5' : 'text-white/80 hover:text-neon'}`}
                >
                  {l.label}
                </Link>
              </motion.li>
            ))}
            {!user ? (
              <>
                <li className="border-b border-white/5">
                  <Link to="/login" onClick={() => setOpen(false)} className="block px-6 py-3 text-white/80 hover:text-neon">Login</Link>
                </li>
                <li className="p-4">
                  <Button as={Link} to="/signup" onClick={() => setOpen(false)} className="flex w-full justify-center">Join Now</Button>
                </li>
              </>
            ) : (
              <>
                <li className="p-4 border-b border-white/5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-neon/20 flex items-center justify-center text-neon font-bold border border-neon/50 text-lg">
                    {(user.name || user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{user.name || user.displayName || 'Member'}</span>
                    <span className="text-white/50 text-xs">{user.email}</span>
                  </div>
                </li>
                {user.role === 'Admin' && (
                  <li className="p-4 pb-0">
                    <Button as={Link} to="/admin" variant="outline" onClick={() => setOpen(false)} className="flex w-full justify-center border-neon text-neon">Admin Panel</Button>
                  </li>
                )}
                <li className="p-4 pb-2">
                  <Button as={Link} to="/dashboard" onClick={() => setOpen(false)} className="flex w-full justify-center">Dashboard</Button>
                </li>
                <li className="p-4 pt-2">
                  <Button variant="ghost" onClick={() => { logout(); setOpen(false) }} className="flex w-full justify-center text-rose-400 hover:text-rose-300">Logout</Button>
                </li>
              </>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}
