import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Podflow — Podcast Intelligence & Guest Pitching for Music PR',
  description:
    'Monitor podcast episodes, extract guest topics, score host matches, and generate tailored podcast guest pitches for your artist roster with Podflow.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="podflow" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#060709] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
