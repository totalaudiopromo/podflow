import React from 'react'

export interface StatCardProps {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  trend = 'neutral',
  subtitle,
  icon,
  className = '',
}: StatCardProps) {
  return (
    <div className={`glass-card p-5 rounded-2xl bg-white/5 border border-white/10 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400 font-sans uppercase tracking-wider">{title}</span>
        {icon && <div className="text-purple-400 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">{icon}</div>}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <div className="font-mono text-2xl font-bold text-white tracking-tight">{value}</div>
        {change && (
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded-full border ${
              trend === 'up'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : trend === 'down'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
    </div>
  )
}
