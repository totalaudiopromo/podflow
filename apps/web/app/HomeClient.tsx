'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Mic,
  Radio,
  Sparkles,
  Zap,
  Target,
  Send,
  Sliders,
  Check,
  ArrowRight,
  TrendingUp,
  Headphones,
  Users,
  Search,
  Copy,
  CheckCircle2,
  Share2,
  FileText
} from 'lucide-react'
import {
  TapBanner,
  MarketingNav,
  AnimatedSection,
  FAQAccordion
} from '@totalaudiopromo/ui'
import { Footer } from '../components/Footer'

// Mock interactive simulator topics
const sampleTopics = [
  {
    topic: 'Indie Artist Sync Licensing',
    podcast: 'The Music Business Podcast',
    host: 'Sammy Andrews',
    matchScore: 94,
    recentEpisode: 'Ep 142: How Indie Labels Land Top Netflix Sync Placements',
    extractedAngles: ['Sync royalty negotiation tips', 'Direct supervisor outreach', 'Unreleased catalogue pitching'],
    pitchPreview: 'Hi Sammy, loved Ep 142 on Netflix sync placements. Our roster artist Nova Echo just secured 3 indie film syncs without a publisher. Would love to share their breakdown on your next episode.',
  },
  {
    topic: 'UK Radio Plugging & Streaming',
    podcast: 'Tape Notes & Music PR',
    host: 'John Kennedy',
    matchScore: 91,
    recentEpisode: 'Ep 98: Breaking New Acts on BBC 6Music in 2026',
    extractedAngles: ['6Music presenter pitching', 'Playlist vs radio plugging synergy', 'DIY PR timing'],
    pitchPreview: 'Hey John, tuned into your 6Music breaking acts episode. We have an indie electronic act touring the UK next month who built 500k monthly streams via regional radio first — great guest fit!',
  },
  {
    topic: 'DIY Electronic Music Production',
    podcast: 'Behind The Board Podcast',
    host: 'Sarah McTaggart',
    matchScore: 88,
    recentEpisode: 'Ep 210: Analog Synth Processing & Live Club Sets',
    extractedAngles: ['Hardware synth chains', 'Touring with portable rigs', 'Stem mastering tricks'],
    pitchPreview: 'Hi Sarah, enjoyed the analog synth processing breakdown. Our producer/DJ Solaric builds custom modular hardware for live sets and would love to break down their live rig on the show.',
  },
]

const features = [
  {
    badge: '01 / EPISODE MONITOR',
    icon: Radio,
    iconColor: 'text-purple-400',
    title: '24/7 Episode Monitoring',
    description: 'Track Apple Podcasts & Spotify RSS feeds round-the-clock to detect fresh episode drops and guest interview calls.',
  },
  {
    badge: '02 / HOST MATCHING',
    icon: Target,
    iconColor: 'text-emerald-400',
    title: 'Smart Host Matching',
    description: 'AI algorithms calculate exact match scores between your artist roster genre, sound, and podcast host preferences.',
  },
  {
    badge: '03 / ONE-CLICK PITCH',
    icon: Send,
    iconColor: 'text-amber-400',
    title: 'One-Click Pitch Generation',
    description: 'Auto-generate hyper-targeted guest pitches referencing specific past episodes, timestamps, and host interviewing styles.',
  },
  {
    badge: '04 / ANGLE EXTRACTOR',
    icon: Sparkles,
    iconColor: 'text-purple-400',
    title: 'Episode Angle Extractor',
    description: 'Extract key discussion themes, open guest slots, and missing perspective angles from podcast transcripts.',
  },
  {
    badge: '05 / GUEST TRACKER',
    icon: Users,
    iconColor: 'text-emerald-400',
    title: 'Roster Pitch Tracker',
    description: 'Manage podcast pitch pipelines across all your agency artists, from host contact to confirmed interview recording.',
  },
  {
    badge: '06 / MEDIA DIGEST',
    icon: FileText,
    iconColor: 'text-cyan-400',
    title: 'Weekly Opportunities Digest',
    description: 'Receive automated Monday morning digests highlighting top 10 podcast interview opportunities for your artists.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Import Artist Roster',
    description: 'Add artist bios, genre tags, latest releases, and target podcast topics into Podflow.',
  },
  {
    number: '02',
    title: 'Podflow Scans & Scores',
    description: 'Our engine monitors thousands of music & culture podcasts, scoring host match relevance in real time.',
  },
  {
    number: '03',
    title: 'Review Pitch & Send',
    description: 'Approve custom AI pitch drafts with 1-click email or host DM outreach, then track replies.',
  },
]

const pricingTiers = [
  {
    name: 'Free',
    price: '0',
    description: 'Ideal for independent artists exploring podcasts',
    features: [
      '3 podcast match searches / day',
      '1 artist profile monitored',
      'Basic pitch draft previews',
      'Web dashboard access',
    ],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Creator',
    price: '19',
    description: 'For managers & self-managed artists',
    features: [
      '25 podcast match searches / day',
      '3 artist profiles monitored',
      'Full pitch generator & export',
      'Weekly podcast digest email',
      'Direct host contact details',
    ],
    cta: 'Start 14-Day Trial',
    popular: true,
  },
  {
    name: 'Pro PR',
    price: '49',
    description: 'For music PR publicists & indie labels',
    features: [
      'Unlimited podcast matching',
      '10 artist profiles monitored',
      'Episode angle extractor',
      'Custom house brand voice profile',
      'Export pitch decks & media lists',
      'Priority queue processing',
    ],
    cta: 'Start 14-Day Trial',
    popular: false,
  },
  {
    name: 'Agency',
    price: '119',
    description: 'For full-service PR agencies & rosters',
    features: [
      'Unlimited artist profiles',
      'Everything in Pro PR plan',
      'Multi-user team seats',
      'Custom podcast CRM sync',
      'Dedicated Slack support channel',
      'API access & webhook integration',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const faqs = [
  {
    question: 'How does Podflow find relevant podcasts for my music genre?',
    answer: 'Podflow monitors RSS feeds, Spotify charts, and Apple Podcast directories across Music, Tech, Culture, and Entertainment. It transcribes episodes and uses NLP to match your artist sound, biography, and release stories with host interview interests.',
  },
  {
    question: 'Can I customise the pitch voice for my PR agency?',
    answer: 'Yes! Pro PR and Agency plans allow you to set custom tone guidelines, boilerplate press info, and pitching rules so every draft matches your team’s voice.',
  },
  {
    question: 'How accurate is host contact information?',
    answer: 'We verify producer and host email addresses against public podcast feed metadata, social channels, and media databases, maintaining over 92% deliverability.',
  },
  {
    question: 'Is Podflow part of the Total Audio Promo suite?',
    answer: 'Yes. Podflow shares the TAP architecture, design system, and single sign-on experience alongside NewsJack and SpotCheck.',
  },
  {
    question: 'Can I trial Podflow before paying?',
    answer: 'Yes! All paid plans feature a 14-day free trial. The Free plan is available indefinitely with no credit card required.',
  },
]

export default function HomeClient() {
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const activeTopic = sampleTopics[selectedTopicIndex]

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(activeTopic.pitchPreview)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#060709] bg-mesh text-slate-100 font-sans">
      {/* Ambient Studio Purple Background Glow */}
      <div className="glow-blob w-96 h-96 -top-48 -left-48" />
      <div className="glow-blob w-80 h-80 top-1/3 -right-40" style={{ animationDelay: '-6s' }} />

      {/* Top TAP Family Banner (Centered, max-w-6xl alignment) */}
      <TapBanner />

      {/* Marketing Navigation (max-w-6xl) */}
      <MarketingNav
        logo={
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/35 flex items-center justify-center">
              <Mic className="w-5 h-5 text-purple-400" />
            </div>
            <span className="font-extrabold text-xl text-white font-heading tracking-tight">
              Podflow
            </span>
          </Link>
        }
        links={[
          { label: 'Features', href: '#features' },
          { label: 'How It Works', href: '#how-it-works' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'FAQ', href: '#faq' },
        ]}
        cta={
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="btn-gradient py-2 px-5 rounded-full text-sm font-bold shadow-glow transition-all inline-flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-white" />
              Open App
            </Link>
          </div>
        }
      />

      {/* Hero Section (2-Column Grid: max-w-6xl) */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 bg-purple-500/15 border border-purple-500/35 text-purple-300 px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Podcast Pitching for Music PR
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-6xl font-extrabold mb-6 leading-[1.08] tracking-tight font-heading text-white">
              Pitch your artists to <br />
              <span className="gradient-text">the right podcasts</span> before anyone else
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed">
              Podflow monitors thousands of music & culture podcast episodes 24/7, extracts interview angles, scores host matches, and drafts tailored pitches for your artist roster.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
              <Link
                href="/dashboard"
                className="btn-gradient inline-flex items-center justify-center gap-2 text-white font-bold text-sm px-7 py-3.5 rounded-full shadow-glow transition-all"
              >
                <Sparkles className="w-4 h-4 text-purple-200" />
                Start Pitching Free
              </Link>
              <a
                href="#simulator"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-all"
              >
                View Live Demo
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            <p className="text-slate-400 text-xs font-mono">
              Built for PR agencies, artist managers, independent publicists & label teams.
            </p>
          </div>

          {/* Right Column - Interactive Podflow Simulator Card (5 cols) */}
          <div id="simulator" className="lg:col-span-5">
            <div className="glass-card p-6 border border-white/10 rounded-3xl shadow-2xl bg-slate-900/80 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/35 flex items-center justify-center">
                    <Radio className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-sm font-bold text-white font-heading">
                    Podflow Simulator
                  </span>
                </div>
                {/* Score uses Mint Green for active high signal */}
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {activeTopic.matchScore}% Match
                </span>
              </div>

              {/* Topic Selector Tabs */}
              <div className="mb-4">
                <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Select sample artist topic:
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-white/10">
                  {sampleTopics.map((t, idx) => (
                    <button
                      key={t.topic}
                      onClick={() => setSelectedTopicIndex(idx)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-medium truncate transition-colors ${
                        selectedTopicIndex === idx
                          ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.topic.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Matched Podcast Card */}
              <div className="bg-slate-950/90 border border-white/10 rounded-2xl p-4 mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-300 font-mono">
                    {activeTopic.podcast}
                  </span>
                  <span className="text-[11px] text-slate-400">Host: {activeTopic.host}</span>
                </div>
                <p className="text-xs font-bold text-white leading-snug">{activeTopic.recentEpisode}</p>

                {/* Extracted Angles in Warm Amber */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                    Extracted Episode Angles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTopic.extractedAngles.map((angle) => (
                      <span
                        key={angle}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300"
                      >
                        {angle}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generated Pitch Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
                    Auto-Generated Guest Pitch:
                  </span>
                  <button
                    onClick={handleCopyPitch}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Pitch
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-slate-950/90 border border-white/10 rounded-xl p-3 text-xs text-slate-300 leading-relaxed font-sans italic">
                  &ldquo;{activeTopic.pitchPreview}&rdquo;
                </div>

                <Link
                  href="/dashboard"
                  className="w-full btn-gradient py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-white mt-3"
                >
                  <Send className="w-3.5 h-3.5" />
                  Generate Custom Pitch in App
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Mockup / Spikes Preview (max-w-5xl) */}
        <div className="mt-20 max-w-5xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 blur-3xl" />
          <div className="relative glass-card p-4 rounded-3xl border border-white/10">
            <div className="bg-slate-950 rounded-2xl overflow-hidden border border-white/5">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-slate-900/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-slate-950 rounded px-3 py-1 text-xs text-slate-400 max-w-xs mx-auto font-mono text-center">
                    app.podflow.co/dashboard
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4 text-left">
                {/* Highlight Banner */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <Radio className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                        Top Opportunity Today
                      </div>
                      <div className="text-sm font-bold text-white">
                        BBC 6Music Interview Slot — Electronic Music Special
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold shrink-0">
                    98% MATCH
                  </span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    ['Episodes Scanned', '1,420', 'text-purple-400'],
                    ['Active Matches', '38', 'text-emerald-400'],
                    ['Pitches Sent', '14', 'text-amber-400'],
                  ].map(([label, val, col]) => (
                    <div key={label} className="rounded-xl bg-white/5 border border-white/10 p-4">
                      <div className={`text-2xl font-bold font-mono ${col}`}>{val}</div>
                      <div className="text-xs text-slate-400 mt-1 font-medium">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid (max-w-6xl) */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 font-heading tracking-tight text-white">
              Built for precision podcast PR
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Stop manually searching podcast feeds. Let Podflow track, match, and draft guest pitches for your entire roster.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="stagger" className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-card p-8 hover:-translate-y-1 transition-all duration-300 border border-white/10 rounded-3xl relative overflow-hidden group hover:border-purple-500/35"
              >
                {/* Background Ambient Glow */}
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all duration-500" />

                {/* Monospace Module Badge */}
                <div className="text-[10px] font-mono font-bold tracking-widest text-purple-300 uppercase mb-4">
                  {feature.badge}
                </div>

                {/* Icon Container with Multi-Accent Variety */}
                <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center shadow-inner mb-6 group-hover:border-purple-500/40 group-hover:bg-purple-500/10 transition-all duration-300">
                  <feature.icon className={`w-7 h-7 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 font-heading group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works (max-w-5xl) */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text-white mb-4">
              How Podflow Works
            </h2>
            <p className="text-lg text-slate-400">
              Three simple steps from artist import to podcast guest bookings
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={step.number} className="glass-card p-6 rounded-2xl border border-white/10">
                <div className={`text-4xl font-bold font-mono mb-3 ${idx === 0 ? 'text-purple-400' : idx === 1 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-heading">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Grid (max-w-6xl) */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white mb-4">
              Transparent PR pricing
            </h2>
            <p className="text-xl text-slate-400">
              Start free. Scale as your artist roster grows.
            </p>
          </AnimatedSection>

          <AnimatedSection animation="stagger" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`glass-card p-6 rounded-2xl relative ${
                  tier.popular ? 'border-purple-500/50 shadow-glow' : 'border-white/10'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md font-mono uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white font-heading">{tier.name}</h3>
                  <div className="mt-2 font-mono">
                    <span className="text-4xl font-bold text-white">
                      {tier.price === '0' ? 'Free' : `£${tier.price}`}
                    </span>
                    {tier.price !== '0' && <span className="text-slate-400 text-sm font-sans">/mo</span>}
                  </div>
                  <p className="text-slate-400 mt-2 text-xs">{tier.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`w-full block text-center py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                    tier.popular
                      ? 'btn-gradient text-white'
                      : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section (max-w-5xl) */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text-white mb-4">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>
          <AnimatedSection>
            <FAQAccordion items={faqs} />
          </AnimatedSection>
        </div>
      </section>

      {/* TAP Family Cross-sell (max-w-6xl) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white mb-1">Part of the Total Audio Promo Suite</p>
              <p className="text-xs text-slate-400">Combine Podflow podcast pitching with NewsJack trend hijacking and SpotCheck BBC playlist monitoring.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://totalaudiopromo.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-500/10 border border-cyan-500/25 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1 font-mono"
              >
                totalaudiopromo.com &rarr;
              </a>
              <a
                href="https://newsjack.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500/10 border border-red-500/25 hover:bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1 font-mono"
              >
                newsjack.cc &rarr;
              </a>
              <a
                href="https://spotcheck.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center gap-1 font-mono"
              >
                spotcheck.cc &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Shared Ecosystem Footer (max-w-6xl) */}
      <Footer />
    </div>
  )
}
