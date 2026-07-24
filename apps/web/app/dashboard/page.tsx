'use client'

import { useState } from 'react'
import {
  PageHeader,
  Card,
  StatCard,
  ActionTile,
  EmptyState
} from '@totalaudiopromo/ui/app'
import {
  Radio,
  Sparkles,
  Send,
  Users,
  Search,
  CheckCircle2,
  Clock,
  FileText,
  Plus
} from 'lucide-react'

// Sample Podcast Opportunities Data
const opportunitiesData = [
  {
    id: 'opp-1',
    podcast: 'The Music Business Podcast',
    host: 'Sammy Andrews',
    email: 'sammy@musicbizpodcast.com',
    matchScore: 98,
    status: 'NEW EPISODE',
    statusVariant: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    episodeTitle: 'Ep 142: Independent Label Distribution & Sync Licensing',
    extractedTopics: ['Sync Licensing', 'Indie Distribution', 'Catalogue Pitching'],
    artistFit: 'Nova Echo (Indie Electronic / Sync focused)',
    dateAdded: '2 hours ago',
  },
  {
    id: 'opp-2',
    podcast: 'Tape Notes & Music PR',
    host: 'John Kennedy',
    email: 'john@tapenotes.co.uk',
    matchScore: 94,
    status: 'HOST RESPONDED',
    statusVariant: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    episodeTitle: 'Ep 98: Breaking New Acts on BBC 6Music in 2026',
    extractedTopics: ['Radio Plugging', 'BBC 6Music', 'Tour PR'],
    artistFit: 'Solaric (Live Hardware Producer)',
    dateAdded: 'Yesterday',
  },
  {
    id: 'opp-3',
    podcast: 'Behind The Board Podcast',
    host: 'Sarah McTaggart',
    email: 'sarah@behindtheboard.fm',
    matchScore: 89,
    status: 'PITCH SENT',
    statusVariant: 'bg-purple-500/20 text-purple-300 border-purple-500/35',
    episodeTitle: 'Ep 210: Analog Synth Processing & Live Club Sets',
    extractedTopics: ['Modular Synths', 'Live Performance', 'Mixing Tricks'],
    artistFit: 'Solaric (Live Hardware Producer)',
    dateAdded: '2 days ago',
  },
  {
    id: 'opp-4',
    podcast: 'Indie Artist Insider',
    host: 'Mark Peterson',
    email: 'mark@indieartistinsider.com',
    matchScore: 85,
    status: 'MATCHED',
    statusVariant: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    episodeTitle: 'Ep 75: Building 100k Streams Without A Major Label',
    extractedTopics: ['DIY Marketing', 'Playlist Pitching', 'Fan Funnels'],
    artistFit: 'Kira V (Alt-Pop Singer/Songwriter)',
    dateAdded: '3 days ago',
  },
]

export default function DashboardPage() {
  const [filter, setFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [sentPitches, setSentPitches] = useState<string[]>([])

  const handleSendPitch = (id: string) => {
    setSentPitches((prev) => [...prev, id])
  }

  const filteredOpportunities = opportunitiesData.filter((opp) => {
    const matchesSearch =
      opp.podcast.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.episodeTitle.toLowerCase().includes(searchQuery.toLowerCase())
    if (filter === 'ALL') return matchesSearch
    if (filter === 'HIGH_MATCH') return matchesSearch && opp.matchScore >= 90
    if (filter === 'NEW') return matchesSearch && opp.status === 'NEW EPISODE'
    return matchesSearch
  })

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <PageHeader
        badge="PODCAST INTELLIGENCE & GUEST PITCHING"
        title="Podcast Opportunities"
        subtitle="Real-time episode monitoring, match scores, and automated guest pitching for your roster."
        action={
          <button className="btn-gradient py-2.5 px-5 rounded-xl font-bold text-xs flex items-center gap-2 text-white shadow-glow">
            <Plus className="w-4 h-4" />
            Scan New Podcasts
          </button>
        }
      />

      {/* Stat Metrics Grid with Distinct Multi-Color Accents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monitored Podcasts"
          value="1,420"
          change="+12 this week"
          trend="up"
          subtitle="Active RSS feeds & Spotify charts"
          icon={<Radio className="w-5 h-5 text-purple-400" />}
        />
        <StatCard
          title="Host Match Rate"
          value="92.4%"
          change="+4.1%"
          trend="up"
          subtitle="Relevance match across active roster"
          icon={<Sparkles className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          title="Pitches Sent"
          value="48"
          change="+8 today"
          trend="up"
          subtitle="Outreach to verified hosts"
          icon={<Send className="w-5 h-5 text-cyan-400" />}
        />
        <StatCard
          title="Host Responses"
          value="19"
          change="39.5% rate"
          trend="up"
          subtitle="Confirmed interview bookings"
          icon={<Users className="w-5 h-5 text-amber-400" />}
        />
      </div>

      {/* Action Tiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionTile
          title="Scan New Episodes"
          description="Run real-time NLP analysis on latest podcast drops in your genre."
          icon={<Radio className="w-5 h-5" />}
          badge="AUTOMATED"
        />
        <ActionTile
          title="Draft Roster Pitch"
          description="Generate personalized guest pitch emails referencing host episode angles."
          icon={<Sparkles className="w-5 h-5" />}
          badge="AI GENERATED"
        />
        <ActionTile
          title="Export Weekly Digest"
          description="Download PDF/Markdown digest of top podcast opportunities for your team."
          icon={<FileText className="w-5 h-5" />}
          badge="EXPORT"
        />
      </div>

      {/* Main Opportunities Feed */}
      <Card className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white font-heading">
              Live Opportunity Feed
            </h2>
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {filteredOpportunities.length} Available
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search podcast, host, topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-white/10 font-mono text-[11px]">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filter === 'ALL'
                    ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('HIGH_MATCH')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filter === 'HIGH_MATCH'
                    ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                90%+ Match
              </button>
              <button
                onClick={() => setFilter('NEW')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filter === 'NEW'
                    ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                New
              </button>
            </div>
          </div>
        </div>

        {/* Opportunity List */}
        {filteredOpportunities.length === 0 ? (
          <EmptyState
            icon={<Radio className="w-6 h-6" />}
            title="No podcast opportunities found"
            description="Try adjusting your search query or filter to see more podcast host matches."
          />
        ) : (
          <div className="space-y-4">
            {filteredOpportunities.map((opp) => {
              const isSent = sentPitches.includes(opp.id) || opp.status === 'PITCH SENT'
              return (
                <div
                  key={opp.id}
                  className="bg-slate-950/80 border border-white/10 hover:border-purple-500/35 rounded-2xl p-5 transition-all duration-200 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/35 flex items-center justify-center shrink-0 text-purple-300">
                        <Radio className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white font-heading">
                            {opp.podcast}
                          </h3>
                          {/* Status Badge */}
                          <span
                            className={`font-mono text-xs border rounded-full px-2.5 py-0.5 font-bold ${
                              isSent
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                : opp.statusVariant
                            }`}
                          >
                            {isSent ? 'PITCH SENT' : opp.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Host: <span className="text-slate-200 font-medium">{opp.host}</span>{' '}
                          <span className="font-mono text-slate-500">({opp.email})</span>
                        </p>
                      </div>
                    </div>

                    {/* Match Score Badge in Emerald Mint */}
                    <div className="flex items-center gap-3 self-start sm:self-center">
                      <div className="text-right">
                        <div className="font-mono text-xl font-bold text-emerald-400">
                          {opp.matchScore}%
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono uppercase">
                          MATCH SCORE
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Episode Details */}
                  <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{opp.episodeTitle}</span>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {opp.dateAdded}
                      </span>
                    </div>

                    {/* Extracted Topics Pills in Amber */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        Extracted Topics:
                      </span>
                      {opp.extractedTopics.map((topic) => (
                        <span
                          key={topic}
                          className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Artist Fit & Pitch CTA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="text-xs text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>
                        Recommended Roster Fit:{' '}
                        <strong className="text-white font-medium">{opp.artistFit}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSendPitch(opp.id)}
                        disabled={isSent}
                        className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isSent
                            ? 'bg-slate-800 text-slate-400 border border-white/10 cursor-default'
                            : 'btn-gradient text-white shadow-glow'
                        }`}
                      >
                        {isSent ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
                            Pitch Sent
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            One-Click Pitch
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
