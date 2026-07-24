import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyle =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'

  const sizeStyle =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs'
      : size === 'lg'
      ? 'px-6 py-3 text-base'
      : 'px-4 py-2 text-sm'

  const variantStyle =
    variant === 'primary'
      ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-glow'
      : variant === 'secondary'
      ? 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
      : variant === 'outline'
      ? 'bg-transparent border border-purple-500/40 text-purple-300 hover:bg-purple-500/10'
      : 'text-slate-300 hover:text-white hover:bg-white/5'

  return (
    <button className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`} {...props}>
      {children}
    </button>
  )
}
