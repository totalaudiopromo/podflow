'use client'

import { useState } from 'react'
import { PageHeader, Card, StatCard, Button } from '@totalaudiopromo/ui/app'
import { Sparkles, Search, Copy, CheckCircle2, Lightbulb, Tag } from 'lucide-react'

// Real extracted ideas from Podflow digest pipeline
const realExtractedAngles = [
  {
    id: 'angle-1',
    category: 'Technology & AI',
    title: 'Model Context Protocol (MCP) & Agent Skills SOPs',
    sourcePodcast: 'The Startup Ideas Podcast',
    guest: 'Remy Gaskell (AI Agents Expert)',
    angleText: 'MCP acts as a universal translator between AI agents and workspace tools (Gmail, Notion, Stripe). Creating reusable markdown SOP skills allows agents to automate entire PR & content departments.',
    guestFit: 'Great angle for pitching technical AI agency founders & developer tool builders.',
  },
  {
    id: 'angle-2',
    category: 'Business & Strategy',
    title: 'Scaling Derivatives Markets & Product-Market Fit',
    sourcePodcast: 'Cheeky Pint',
    guest: 'Tarek Mansour & Luana Lopes Lara (Kalshi Co-founders)',
    angleText: 'Kalshi achieved 11x revenue growth in 6 months by solving market-making mechanics for non-financial prediction contracts (Oscars, GPU shipments).',
    guestFit: 'Perfect guest pitching angle for fintech podcasts & founder interviews.',
  },
  {
    id: 'angle-3',
    category: 'AI & Music Industry',
    title: 'Breakout Categories & AI Music Generation',
    sourcePodcast: 'My First Million',
    guest: 'Sam Parr & Shaan Puri',
    angleText: 'Suno in AI music generation and Harvey in legal AI represent category-defining breakthroughs with high margins and employee wealth potential.',
    guestFit: 'Pitching angle for music tech founders and AI music creators.',
  },
  {
    id: 'angle-4',
    category: 'Product & SaaS',
    title: 'Product-Led Growth in One-Person Teams',
    sourcePodcast: 'Marketing School',
    guest: 'Neil Patel & Eric Siu',
    angleText: 'Anthropic’s growth team operates with product-led velocity: great products drive adoption faster than bloated marketing teams.',
    guestFit: 'Ideal pitch angle for solo founders & product-led SaaS growth guests.',
  },
]

export default function AnglesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filtered = realExtractedAngles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.angleText.toLowerCase().includes(search.toLowerCase()) ||
    a.sourcePodcast.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        badge="AI EXTRACTOR"
        title="Extracted Episode Angles"
        subtitle="Key interview topics, guest slots, and discussion angles extracted by Podflow."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Extracted Ideas"
          value="53 Ideas"
          subtitle="Processed in latest digest run"
          icon={<Lightbulb className="w-5 h-5 text-amber-400" />}
        />
        <StatCard
          title="Follow-Worthy Guests"
          value="21 Guests"
          subtitle="Flagged by AI extraction engine"
          icon={<Sparkles className="w-5 h-5 text-purple-400" />}
        />
        <StatCard
          title="Average Cost / Run"
          value="$0.06"
          subtitle="Anthropic / OpenAI API cost"
          icon={<Tag className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      <Card className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white font-heading">Recent Extracted Pitch Angles</h2>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search angles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((angle) => (
            <div
              key={angle.id}
              className="bg-slate-950/80 border border-white/10 hover:border-purple-500/35 rounded-2xl p-5 space-y-3 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-purple-300 font-semibold">{angle.sourcePodcast}</span>
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25">
                  {angle.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-heading">{angle.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/10">
                &ldquo;{angle.angleText}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">Guest: <strong className="text-white">{angle.guest}</strong></span>
                <button
                  onClick={() => handleCopy(angle.id, angle.angleText)}
                  className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1 font-mono"
                >
                  {copiedId === angle.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Angle
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
