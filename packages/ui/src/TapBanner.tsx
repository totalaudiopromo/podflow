import React from 'react'

export interface TapBannerProps {
  className?: string
}

/**
 * Standard Total Audio Promo family banner rendered at the top of TAP applications.
 * Centered banner with brand pill badge, middle subtext, and right CTA pill button.
 */
export function TapBanner({ className = '' }: TapBannerProps) {
  return (
    <div className={`tap-banner bg-[#060709] border-b border-white/10 py-2 px-4 w-full relative z-51 text-xs text-slate-300 font-sans ${className}`}>
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 text-center flex-wrap">
        <span className="bg-purple-500/15 text-purple-300 border border-purple-500/35 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider">
          TOTAL AUDIO PROMO SYSTEM
        </span>
        <span className="text-slate-300 font-medium">
          Podflow is part of the Total Audio Promo suite for music PR.
        </span>
        <a
          href="https://totalaudiopromo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-xs font-semibold text-purple-300 hover:text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-3 py-0.5 rounded-full transition-colors"
        >
          totalaudiopromo.com &rarr;
        </a>
      </div>
    </div>
  )
}
