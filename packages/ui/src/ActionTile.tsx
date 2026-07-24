import React from 'react'

export interface ActionTileProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick?: () => void
  href?: string
  badge?: string
  className?: string
}

export function ActionTile({
  title,
  description,
  icon,
  onClick,
  href,
  badge,
  className = '',
}: ActionTileProps) {
  const content = (
    <div className={`glass-card p-5 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-200 group text-left ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
          {icon}
        </div>
        {badge && (
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold">
            {badge}
          </span>
        )}
      </div>
      <h4 className="text-base font-bold text-white mb-1 font-heading group-hover:text-purple-300 transition-colors">
        {title}
      </h4>
      <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    )
  }

  return (
    <button type="button" onClick={onClick} className="w-full text-left">
      {content}
    </button>
  )
}
