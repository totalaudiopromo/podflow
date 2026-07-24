'use client'

import { useState } from 'react'
import { PageHeader, Card, StatCard, Button, EmptyState } from '@totalaudiopromo/ui/app'
import { Radio, Search, Filter, Headphones, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react'

// Real podcast directory extracted from Podflow engine runs
const realDirectory = [
  {
    id: 'pod-1',
    title: 'Dwarkesh Podcast',
    host: 'Dwarkesh Patel',
    category: 'Technology & AI',
    tier: 'Tier 1',
    lastEpisode: 'Dylan Patel — Deep dive on the 3 big bottlenecks to scaling AI compute',
    guestsCount: 42,
    extractStatus: 'ACTIVE MONITORING',
    topics: ['AI Scaling', 'Semiconductor Supply Chain', 'Hardware Economics'],
    matchScore: 96,
  },
  {
    id: 'pod-2',
    title: 'My First Million',
    host: 'Sam Parr & Shaan Puri',
    category: 'Business & Startups',
    tier: 'Tier 1',
    lastEpisode: 'The Simplest Way To Make $1M In 2026 (Suno Music, TrueMed, Legal AI)',
    guestsCount: 88,
    extractStatus: 'ACTIVE MONITORING',
    topics: ['AI Music Generation', 'High-Growth Startups', 'Creator Business'],
    matchScore: 92,
  },
  {
    id: 'pod-3',
    title: 'Maintainable',
    host: 'Robby Russell',
    category: 'Software Engineering',
    tier: 'Tier 2',
    lastEpisode: 'Joel Oliveira: Predictability Is a Maintainability Feature',
    guestsCount: 31,
    extractStatus: 'ACTIVE MONITORING',
    topics: ['Legacy Refactoring', 'Architecture', 'Code Maintainability'],
    matchScore: 89,
  },
  {
    id: 'pod-4',
    title: 'The Next Wave - AI and The Future of Technology',
    host: 'Matt Wolfe & Nathan Lands',
    category: 'Technology & AI',
    tier: 'Tier 1',
    lastEpisode: 'Meta Replacing Creators? + Sam Altman’s Mistake & 3 Big AI Updates',
    guestsCount: 24,
    extractStatus: 'ACTIVE MONITORING',
    topics: ['Autonomous AI Agents', 'Creator Economy', 'AI Tools'],
    matchScore: 94,
  },
  {
    id: 'pod-5',
    title: 'Startups For the Rest of Us',
    host: 'Rob Walling',
    category: 'SaaS & Marketing',
    tier: 'Tier 1',
    lastEpisode: 'Episode 824 | Crowded Markets, Problem Aware, A Stolen Idea (with Jordan Gal)',
    guestsCount: 52,
    extractStatus: 'ACTIVE MONITORING',
    topics: ['Bootstrapping', 'SaaS Growth', 'Differentiation'],
    matchScore: 87,
  },
  {
    id: 'pod-6',
    title: 'Cheeky Pint',
    host: 'Alex & Guests',
    category: 'Fintech & Markets',
    tier: 'Tier 2',
    lastEpisode: 'Creating prediction markets with Tarek Mansour and Luana Lopes Lara (Kalshi)',
    guestsCount: 15,
    extractStatus: 'ACTIVE MONITORING',
    topics: ['Prediction Markets', 'Financial Derivatives', 'Regulatory Strategy'],
    matchScore: 90,
  },
]

export default function DirectoryPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const filtered = realDirectory.filter((pod) => {
    const matchesSearch =
      pod.title.toLowerCase().includes(search.toLowerCase()) ||
      pod.host.toLowerCase().includes(search.toLowerCase()) ||
      pod.topics.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    if (selectedCategory === 'ALL') return matchesSearch
    return matchesSearch && pod.category === selectedCategory
  })

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        badge="REAL PODCAST INDEX"
        title="Podcast Directory"
        subtitle="Active Apple Podcasts & RSS feeds monitored by the Podflow engine."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Indexed Podcasts"
          value="1,420"
          subtitle="From local Apple Podcasts DB & RSS"
          icon={<Radio className="w-5 h-5 text-purple-400" />}
        />
        <StatCard
          title="Monitored Tiers"
          value="Tiers 1 - 3"
          subtitle="Configured in ~/.podflow/podcasts.json"
          icon={<Sparkles className="w-5 h-5 text-amber-400" />}
        />
        <StatCard
          title="Total Guests Tracked"
          value="21 Guests"
          subtitle="Processed in latest run"
          icon={<Headphones className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      <Card className="space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white font-heading">Monitored Podcast Feeds</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search show, host, topic..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-white/10 font-mono text-[11px]">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1 rounded-lg ${
                  selectedCategory === 'ALL'
                    ? 'bg-purple-500/25 text-purple-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory('Technology & AI')}
                className={`px-3 py-1 rounded-lg ${
                  selectedCategory === 'Technology & AI'
                    ? 'bg-purple-500/25 text-purple-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                AI & Tech
              </button>
              <button
                onClick={() => setSelectedCategory('Business & Startups')}
                className={`px-3 py-1 rounded-lg ${
                  selectedCategory === 'Business & Startups'
                    ? 'bg-purple-500/25 text-purple-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Business
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((pod) => (
            <div
              key={pod.id}
              className="bg-slate-950/80 border border-white/10 hover:border-purple-500/35 rounded-2xl p-5 space-y-3 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/35 font-bold">
                      {pod.tier}
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                      {pod.matchScore}% MATCH
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5 font-heading">
                    {pod.title}
                  </h3>
                  <p className="text-xs text-slate-400">Host: {pod.host}</p>
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Latest Processed Episode:
                </span>
                <p className="text-white font-medium">{pod.lastEpisode}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {pod.topics.map((topic) => (
                  <span
                    key={topic}
                    className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
