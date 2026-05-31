import { INPUT } from '../../constants/index.js'

export default function Select({ label, id, options, className = '', ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm text-white/60">
          {label}
        </label>
      )}
      <select id={id} className={`${INPUT} ${className}`} {...props}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
