'use client'

import { useState } from 'react'
import { PageHeader, Card, Button } from '@totalaudiopromo/ui/app'
import { Settings, Key, Cpu, Calendar, CheckCircle2, Save, Globe } from 'lucide-react'

export default function SettingsPage() {
  const [provider, setProvider] = useState('openrouter')
  const [model, setModel] = useState('anthropic/claude-3.5-haiku')
  const [apiKey, setApiKey] = useState('sk-or-v1-****************')
  const [scheduleTime, setScheduleTime] = useState('08:00')
  const [saved, setSaved] = useState(false)

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider)
    if (newProvider === 'openrouter') {
      setModel('anthropic/claude-3.5-haiku')
    } else if (newProvider === 'anthropic') {
      setModel('claude-haiku-4-5-20251001')
    } else if (newProvider === 'openai') {
      setModel('gpt-4o-mini')
    } else if (newProvider === 'google') {
      setModel('gemini-2.0-flash')
    } else if (newProvider === 'ollama') {
      setModel('llama3.2')
    }
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        badge="CONFIG & PROVIDERS"
        title="Settings & AI Providers"
        subtitle="Manage your local ~/.podflow/config.json and AI extraction provider settings."
      />

      <Card className="space-y-6">
        <h3 className="text-base font-bold text-white font-heading flex items-center gap-2 pb-3 border-b border-white/10">
          <Cpu className="w-5 h-5 text-purple-400" />
          AI Extraction Provider
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">AI Provider</label>
            <select
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-sans"
            >
              <option value="openrouter">OpenRouter (Any LLM / OpenRouter Key)</option>
              <option value="anthropic">Anthropic (Claude Direct Key)</option>
              <option value="openai">OpenAI (GPT Direct Key)</option>
              <option value="google">Google Generative AI (Gemini Direct Key)</option>
              <option value="ollama">Ollama (Local / Free)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Model Name</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
          />
          <p className="text-[11px] text-slate-400 mt-1.5 font-mono">
            {provider === 'openrouter'
              ? 'OpenRouter key (sk-or-v1-...) stored in ~/.podflow/config.json (permissions 0600) or via OPENROUTER_API_KEY.'
              : 'Stored locally in ~/.podflow/config.json (permissions 0600)'}
          </p>
        </div>
      </Card>

      <Card className="space-y-6">
        <h3 className="text-base font-bold text-white font-heading flex items-center gap-2 pb-3 border-b border-white/10">
          <Calendar className="w-5 h-5 text-amber-400" />
          macOS launchd Background Schedule
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Weekly Digest Schedule</p>
            <p className="text-xs text-slate-400">Automated macOS launchd weekly digest job with push notification.</p>
          </div>
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
            ACTIVE (MONDAYS 08:00)
          </span>
        </div>
      </Card>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="btn-gradient py-2.5 px-6 rounded-xl font-bold text-xs flex items-center gap-2 text-white shadow-glow"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              Configuration Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Configuration
            </>
          )}
        </button>
      </div>
    </div>
  )
}
