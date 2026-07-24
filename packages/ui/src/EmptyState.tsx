import React from 'react'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`glass-card p-12 text-center rounded-2xl border border-white/10 ${className}`}>
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-white mb-2 font-heading">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">{description}</p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  )
}
