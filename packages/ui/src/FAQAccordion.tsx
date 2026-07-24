'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  className?: string
}

export function FAQAccordion({ items, className = '' }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndex === idx
        return (
          <div
            key={idx}
            className="glass-card p-6 rounded-2xl border border-white/10 transition-colors"
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between text-left gap-4 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="text-lg font-bold text-white font-heading">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-purple-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="mt-4 pt-4 border-t border-white/10 text-slate-300 leading-relaxed text-sm">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
