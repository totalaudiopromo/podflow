'use client'

import React from 'react'
import { useInView } from './useInView'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: 'slide' | 'stagger'
}

export function AnimatedSection({
  children,
  className = '',
  animation = 'slide',
}: AnimatedSectionProps) {
  const { ref, isInView } = useInView<HTMLDivElement>()

  const animClass = animation === 'stagger' ? 'stagger-grid' : 'animate-slide-in'

  return (
    <div
      ref={ref}
      className={`${animClass} ${isInView ? 'in-view' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
