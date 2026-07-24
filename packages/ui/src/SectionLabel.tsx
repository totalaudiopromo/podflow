import React from 'react'

export interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <div className={`text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase mb-3 ${className}`}>
      {children}
    </div>
  )
}
