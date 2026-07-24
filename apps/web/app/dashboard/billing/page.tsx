'use client'

import { useState } from 'react'
import { PageHeader, Card, Button, StatCard } from '@totalaudiopromo/ui/app'
import { CreditCard, Check, ShieldCheck, Cpu, Terminal, ExternalLink } from 'lucide-react'

export default function BillingPage() {
  const [activePlan, setActivePlan] = useState('LOCAL_CLI')

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <PageHeader
        badge="SUBSCRIPTION & LOCAL CLI TIERS"
        title="Billing & Plan Management"
        subtitle="Understand Podflow's open-source local CLI mode vs hosted cloud PR workspace tiers."
      />

      {/* Active Plan Summary */}
      <Card className="border border-purple-500/35 bg-purple-500/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-heading">Local CLI & MCP Mode</h3>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                  ACTIVE & UNLIMITED
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Running via npx podflow / CLI with your own API key (Anthropic/OpenAI/Gemini/Ollama).
              </p>
            </div>
          </div>

          <span className="font-mono text-xl font-bold text-white">£0 / mo</span>
        </div>
      </Card>

      {/* Cloud Hosted Tiers Explanation */}
      <Card className="space-y-6">
        <div className="pb-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white font-heading">Hosted Cloud Plans</h2>
          <p className="text-xs text-slate-400 mt-1">
            Optional 24/7 hosted cloud processing for PR agencies managing multiple artist rosters without running local terminal processes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Creator */}
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white font-heading">Creator</h4>
              <span className="font-mono text-lg font-bold text-white">£19<span className="text-xs text-slate-500 font-sans">/mo</span></span>
            </div>
            <p className="text-xs text-slate-400">For self-managed artists & indie managers</p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                25 match scans / day
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                3 artist profiles
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Weekly podcast digest
              </li>
            </ul>
            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded-xl text-xs font-bold transition-all">
              Switch to Creator
            </button>
          </div>

          {/* Pro PR */}
          <div className="bg-slate-950/80 border border-purple-500/40 rounded-2xl p-5 space-y-4 relative">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              Recommended
            </span>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white font-heading">Pro PR</h4>
              <span className="font-mono text-lg font-bold text-white">£49<span className="text-xs text-slate-500 font-sans">/mo</span></span>
            </div>
            <p className="text-xs text-slate-400">For publicists & indie PR labels</p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Unlimited podcast matching
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                10 artist profiles
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Episode angle extractor
              </li>
            </ul>
            <button className="w-full btn-gradient text-white py-2 rounded-xl text-xs font-bold shadow-glow transition-all">
              Switch to Pro PR
            </button>
          </div>

          {/* Agency */}
          <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white font-heading">Agency</h4>
              <span className="font-mono text-lg font-bold text-white">£119<span className="text-xs text-slate-500 font-sans">/mo</span></span>
            </div>
            <p className="text-xs text-slate-400">For full-service PR agencies</p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Unlimited artist profiles
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Multi-user team seats
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Dedicated API & CRM sync
              </li>
            </ul>
            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded-xl text-xs font-bold transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
