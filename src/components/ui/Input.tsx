import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const inputBaseClasses =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-300 focus:border-transparent outline-none transition'

function Input({ label, error, id, className = '', ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input id={id} className={`${inputBaseClasses} ${className}`} {...props} />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default Input
