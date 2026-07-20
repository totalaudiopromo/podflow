import type { Config } from 'tailwindcss'
import preset from '@totalaudiopromo/ui/tailwind-preset'

const config: Config = {
  presets: [preset as unknown as Config],
  content: [
    './index.html',
    './best-tools.html',
    './how-it-works.html',
    './pricing-compare.html',
    './proof.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../newsjack/packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
