import { motion } from 'framer-motion'
import { BRAND, CONTACT } from '../constants/index.js'

const socialLinks = [
  { name: 'Instagram', href: '#', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { name: 'YouTube', href: '#', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { name: 'WhatsApp', href: '#', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
]

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="border-t border-white/10 bg-ink-800 relative overflow-hidden"
    >
      <div className="absolute inset-0 gradient-radial-primary pointer-events-none" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <img src="/thee13fitness/assets/logos/logo.png" alt="Three13 Fitness Logo" className="h-10 w-auto rounded-full border border-neon/50 shadow-neon-sm" />
            <span className="font-display text-lg font-bold">
              three<span className="neon-text">13</span> Fitness
            </span>
          </div>
          <p className="mt-3 text-sm text-white/50">{BRAND.tagline}.</p>
          <p className="mt-1 text-xs text-neon/70">{BRAND.quote}</p>
          <div className="mt-5 flex gap-3">
            {socialLinks.map(s => (
              <a
                key={s.name}
                href={s.href}
                aria-label={s.name}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-neon hover:border-neon/50 hover:shadow-neon-sm transition-all duration-300 hover:scale-110"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-bold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {['Muscle Explorer|/#explorer', 'Membership|/#membership', 'Services|/#services', 'AI Planner|/#planner'].map(item => {
              const [label, href] = item.split('|')
              return (
                <li key={label}>
                  <a href={href} className="hover:text-neon transition-colors duration-300 relative group">
                    {label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-neon transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {['Trainers|/#trainers', 'Transformations|/#transformations', 'Dashboard|/dashboard', 'Contact|/#contact'].map(item => {
              const [label, href] = item.split('|')
              return (
                <li key={label}>
                  <a href={href} className="hover:text-neon transition-colors duration-300 relative group">
                    {label}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-neon transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neon/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {CONTACT.email}
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neon/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              {CONTACT.phone}
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-neon/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Three13 Fitness, India
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/5 py-5">
        <div className="mx-auto max-w-7xl px-5 text-center text-xs text-white/40">
          <p>© {new Date().getFullYear()} three13 Fitness. All rights reserved.</p>
          <p className="mt-2 text-neon/60">Developed by <span className="font-semibold text-neon">gajjubhai</span></p>
        </div>
      </div>
    </motion.footer>
  )
}
