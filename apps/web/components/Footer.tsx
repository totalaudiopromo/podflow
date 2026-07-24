'use client'

import Link from 'next/link'
import { Mic, ArrowRight } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-slate-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-500/35 flex items-center justify-center">
              <Mic className="w-4 h-4 text-purple-400" />
            </div>
            <span className="font-bold text-lg text-white font-heading">Podflow</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <a href="mailto:info@totalaudiopromo.com" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>

          <p className="text-slate-500 text-xs font-mono">
            © {currentYear} Podflow. Part of{' '}
            <a
              href="https://totalaudiopromo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 hover:text-purple-200 transition-colors font-semibold"
            >
              Total Audio Promo
            </a>.
          </p>
        </div>

        {/* TAP Ecosystem Family Cross-Links */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400">
          <span className="text-slate-500 font-mono text-[11px] font-medium">Total Audio Promo Family:</span>

          <a
            href="https://totalaudiopromo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/25 transition-all font-mono"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform" />
            <span>totalaudiopromo.com</span>
            <span className="text-slate-500 text-[10px]">— Campaign Outreach</span>
          </a>

          <a
            href="https://newsjack.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/25 transition-all font-mono"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 group-hover:scale-125 transition-transform" />
            <span>newsjack.cc</span>
            <span className="text-slate-500 text-[10px]">— Newsjacking</span>
          </a>

          <a
            href="https://spotcheck.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/25 transition-all font-mono"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
            <span>spotcheck.cc</span>
            <span className="text-slate-500 text-[10px]">— Playlist Validation</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
