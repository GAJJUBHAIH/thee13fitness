import { FOCUS_RING } from '../../constants/index.js'

const VARIANTS = {
  neon: 'border border-neon text-neon hover:bg-neon hover:text-ink-900 hover:shadow-neon',
  solid: 'bg-neon text-ink-900 shadow-neon-sm hover:shadow-neon hover:brightness-110',
  ghost: 'text-white/70 hover:text-neon hover:bg-white/5',
  whatsapp: 'bg-[#25D366] text-ink-900 hover:opacity-90',
  danger: 'border border-rose-500/50 text-rose-400 hover:bg-rose-500 hover:text-white',
}

const SIZES = {
  sm: 'px-4 py-1.5 text-sm gap-1.5',
  md: 'px-6 py-2.5 gap-2',
  lg: 'px-8 py-3.5 text-lg gap-2.5',
}

export default function Button({
  as = 'button',
  variant = 'neon',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}) {
  const Tag = as
  const isDisabled = disabled || loading
  return (
    <Tag
      className={`inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 relative overflow-hidden
        ${VARIANTS[variant] || VARIANTS.neon}
        ${SIZES[size] || SIZES.md}
        ${isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'active:scale-[0.97]'}
        ${FOCUS_RING} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </Tag>
  )
}
