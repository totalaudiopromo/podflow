import React from 'react'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  badge?: string
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  action,
  badge,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 ${className}`}>
      <div>
        {badge && (
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2.5 py-0.5 rounded-full mb-2 uppercase font-semibold">
            {badge}
          </div>
        )}
        <h1 className="text-3xl font-extrabold text-white tracking-tight font-heading">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
