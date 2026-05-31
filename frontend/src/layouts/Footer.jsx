import { BRAND, CONTACT } from '../constants/index.js'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink-800">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-neon font-display text-neon shadow-neon-sm">
              3B
            </span>
            <span className="font-display text-lg font-bold">
              Three<span className="neon-text">B</span> Fitness
            </span>
          </div>
          <p className="mt-3 text-sm text-white/50">{BRAND.tagline}.</p>
          <p className="mt-1 text-xs text-neon/70">{BRAND.quote}</p>
        </div>
        <div>
          <h4 className="font-display font-bold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li><a href="/#explorer" className="hover:text-neon">Muscle Explorer</a></li>
            <li><a href="/#membership" className="hover:text-neon">Membership</a></li>
            <li><a href="/#services" className="hover:text-neon">Services</a></li>
            <li><a href="/#planner" className="hover:text-neon">AI Planner</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li><a href="/#trainers" className="hover:text-neon">Trainers</a></li>
            <li><a href="/#transformations" className="hover:text-neon">Transformations</a></li>
            <li><a href="/dashboard" className="hover:text-neon">Dashboard</a></li>
            <li><a href="/#contact" className="hover:text-neon">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li>{CONTACT.email}</li>
            <li>{CONTACT.phone}</li>
            <li>ThreeB Fitness, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} ThreeB Fitness. All rights reserved.
      </div>
    </footer>
  )
}
