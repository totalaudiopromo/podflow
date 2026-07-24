'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Mic,
  LayoutDashboard,
  Radio,
  Sparkles,
  Send,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  ExternalLink
} from 'lucide-react'

const primaryNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Podcast Directory', href: '/dashboard/directory', icon: Radio },
  { name: 'Episode Angles', href: '/dashboard/angles', icon: Sparkles },
  { name: 'Pitch Drafter', href: '/dashboard/pitch', icon: Send },
]

const secondaryNavigation = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
]

interface DashboardShellProps {
  userEmail?: string
  userName?: string
  children: React.ReactNode
}

export default function DashboardShell({
  userEmail = 'pr@totalaudiopromo.com',
  userName = 'Total Audio PR',
  children,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const sidebarContent = (
    <>
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/35 flex items-center justify-center">
            <Mic className="w-5 h-5 text-purple-400" />
          </div>
          <span className="font-extrabold text-xl text-white font-heading tracking-tight">
            Podflow
          </span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 p-4 flex flex-col justify-between overflow-y-auto space-y-4 font-sans">
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
            Podcast Pitching
          </div>
          {primaryNavigation.map((item) => {
            const isActive =
              item.href === '/dashboard' ? pathname === item.href : pathname?.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-purple-500/15 border border-purple-500/35 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : ''}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>

        {/* Secondary Nav */}
        <div className="border-t border-white/10 pt-4 space-y-1">
          <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
            Management
          </div>
          {secondaryNavigation.map((item) => {
            const isActive = pathname?.startsWith(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}

          <a
            href="https://totalaudiopromo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Total Audio Promo</span>
          </a>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/10 font-sans">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/35 flex items-center justify-center text-purple-300 font-mono font-bold text-xs">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{userName}</p>
            <p className="text-[11px] text-slate-400 truncate font-mono">{userEmail}</p>
          </div>
        </div>

        <Link
          href="/"
          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Dashboard</span>
        </Link>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#060709] text-slate-100 font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-purple-400" />
          <span className="font-extrabold text-lg text-white font-heading">Podflow</span>
        </Link>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Slide-over backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-white/10 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-slate-950/60 backdrop-blur-xl border-r border-white/10 flex-col">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-64 pt-14 lg:pt-0 p-4 sm:p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
