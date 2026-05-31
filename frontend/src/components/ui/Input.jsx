import { INPUT } from '../../constants/index.js'

export default function Input({ label, id, className = '', ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm text-white/60">
          {label}
        </label>
      )}
      <input id={id} className={`${INPUT} ${className}`} {...props} />
    </div>
  )
}
