import { FOCUS_RING } from '../../constants/index.js'

export default function Toggle({ options, value, onChange, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="glass flex rounded-full p-1">
      {options.map((o) => {
        const active = value === o.value
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${FOCUS_RING} ${
              active ? 'bg-neon text-ink-900 shadow-neon-sm' : 'text-white/70 hover:text-neon'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
