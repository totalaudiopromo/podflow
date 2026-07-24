'use client'

import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

export interface NavLink {
  label: string
  href: string
}

interface MarketingNavProps {
  /** Brand mark + wordmark, usually wrapped in the product's home link */
  logo: React.ReactNode
  links: NavLink[]
  /** Right-hand call to action (sign in / get started buttons) */
  cta?: React.ReactNode
  className?: string
}

/**
 * Fixed marketing-site navigation with a mobile hamburger panel.
 * Uses max-w-6xl mx-auto container width.
 */
export function MarketingNav({ logo, links, cta, className = '' }: MarketingNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <nav
      className={`sticky top-0 inset-x-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {logo}

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="nav-link text-sm font-medium text-slate-300 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
            {cta}
          </div>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          {cta && <div className="pt-3 border-t border-white/10">{cta}</div>}
        </div>
      )}
    </nav>
  )
}
