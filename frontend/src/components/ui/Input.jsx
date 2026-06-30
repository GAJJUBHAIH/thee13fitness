import { INPUT } from '../../constants/index.js'

export default function Input({ label, id, error, success, icon, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-white/60">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`${INPUT} ${icon ? 'pl-11' : ''} ${error ? '!border-rose-500/60 focus:!border-rose-500' : ''} ${success ? '!border-emerald-500/60' : ''} transition-all duration-300 ${className}`}
          {...props}
        />
        {success && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </span>
        )}
      </div>
      {error && <p className="text-xs text-rose-400 mt-1 animate-fadeInUp">{error}</p>}
    </div>
  )
}
