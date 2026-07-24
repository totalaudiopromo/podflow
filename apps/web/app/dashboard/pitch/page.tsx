'use client'

import { useState } from 'react'
import { PageHeader, Card, Button } from '@totalaudiopromo/ui/app'
import { Send, Sparkles, Copy, CheckCircle2, User, Radio, RefreshCw } from 'lucide-react'

export default function PitchDrafterPage() {
  const [podcastName, setPodcastName] = useState('Dwarkesh Podcast')
  const [hostName, setHostName] = useState('Dwarkesh Patel')
  const [artistName, setArtistName] = useState('Remy Gaskell')
  const [episodeAngle, setEpisodeAngle] = useState('Model Context Protocol (MCP) & AI Agent SOPs')
  const [copied, setCopied] = useState(false)

  const pitchText = `Hi ${hostName},

Loved your recent episode on AI scaling bottlenecks. Our roster expert ${artistName} has built production AI agent systems with Model Context Protocol (MCP) that automate entire content & PR workflows.

Given your focus on ${episodeAngle}, I think ${artistName} would be a fantastic guest fit for a deep-dive episode on your show.

Would love to send over brief bio notes and audio snippets if you're open to it!

Best,
Total Audio PR`

  const handleCopy = () => {
    navigator.clipboard.writeText(pitchText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        badge="AI PITCH GENERATOR"
        title="Pitch Drafter"
        subtitle="Generate personalized, episode-specific guest pitches for podcast hosts."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pitch Controls Form */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Pitch Parameters
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Podcast</label>
              <input
                type="text"
                value={podcastName}
                onChange={(e) => setPodcastName(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Host Name</label>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Roster Artist / Guest</label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Reference Episode Angle</label>
              <textarea
                rows={3}
                value={episodeAngle}
                onChange={(e) => setEpisodeAngle(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
              />
            </div>
          </Card>
        </div>

        {/* Generated Draft Output */}
        <div className="lg:col-span-7">
          <Card className="space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-mono uppercase font-bold text-purple-300">
                  Generated Pitch Email Draft
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Email Draft
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-white/10 font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {pitchText}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={handleCopy}
                className="btn-gradient py-2.5 px-6 rounded-xl font-bold text-xs flex items-center gap-2 text-white shadow-glow"
              >
                <Send className="w-4 h-4" />
                Copy & Send Outreach
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
