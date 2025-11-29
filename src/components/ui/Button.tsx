import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}

const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const baseClasses = 'py-3 rounded-lg font-medium transition duration-200'

  const variantClasses = {
    primary:
      'bg-emerald-300 text-gray-900 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
    outline: 'border-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50',
  }

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
