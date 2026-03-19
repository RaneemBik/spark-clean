import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col space-y-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>
      )}
      <textarea
        rows={4}
        className={`px-4 py-3 rounded-2xl border border-mint-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-mint-500 transition resize-none ${className}`}
        {...props}
      />
    </div>
  )
}
