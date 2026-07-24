import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  glass?: boolean
}

export function Card({ children, className = '', glass = true, ...props }: CardProps) {
  return (
    <div
      className={`${
        glass
          ? 'glass-card border border-white/10 rounded-2xl p-6 bg-slate-900/60 backdrop-blur-xl'
          : 'bg-slate-900 border border-white/10 rounded-2xl p-6'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
