import { FOCUS_RING } from '../../constants/index.js'

const VARIANTS = {
  neon: 'border border-neon text-neon hover:bg-neon hover:text-ink-900 hover:shadow-neon',
  solid: 'bg-neon text-ink-900 shadow-neon-sm hover:opacity-90',
  ghost: 'text-white/70 hover:text-neon',
  whatsapp: 'bg-[#25D366] text-ink-900 hover:opacity-90',
}

export default function Button({ as = 'button', variant = 'neon', className = '', children, ...props }) {
  const Tag = as
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-semibold transition ${VARIANTS[variant]} ${FOCUS_RING} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
