import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  children?: React.ReactNode
}

export function Card({ hover = false, children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-gray-100 bg-white overflow-hidden transition-all duration-300 ${
        hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : 'shadow-sm'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
