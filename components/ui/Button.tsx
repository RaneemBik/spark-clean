import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  children?: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint-500 disabled:opacity-60 disabled:cursor-not-allowed'

  const variants: Record<string, string> = {
    primary:
      'bg-mint-600 text-white hover:bg-mint-700 shadow-lg shadow-mint-500/30 hover:shadow-mint-500/50',
    secondary:
      'bg-white text-mint-700 hover:bg-mint-50 shadow-lg',
    outline:
      'border-2 border-mint-600 text-mint-600 hover:bg-mint-50',
    ghost:
      'text-gray-700 hover:bg-gray-100',
  }

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span>{icon}</span>}
    </button>
  )
}
