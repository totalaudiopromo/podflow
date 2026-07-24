/**
 * Total Audio Promo Tailwind preset.
 *
 * Pair with tokens.css (import it once in your global stylesheet). All brand
 * colour, glow and gradient utilities read the CSS variables, so a product
 * switches accent by setting data-theme — no Tailwind config changes.
 *
 * Usage: `presets: [require('@totalaudiopromo/ui/tailwind-preset')]`
 */

const plugin = require('tailwindcss/plugin')

const brandScale = {}
for (const step of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
  brandScale[step] = `rgb(var(--brand-${step}) / <alpha-value>)`
}

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      colors: {
        brand: brandScale,
        'podflow-purple': '#A855F7',
        'tap-accent': '#C084FC',
        obsidian: '#060709',
      },
      boxShadow: {
        glow: '0 0 20px rgb(var(--brand-500) / 0.3)',
        'glow-lg': '0 0 36px rgb(var(--brand-500) / 0.38)',
        'glow-xl': '0 0 52px rgb(var(--brand-500) / 0.28)',
        'glow-white': '0 0 24px rgba(255, 255, 255, 0.08)',
        card: '0 4px 24px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 30px rgb(var(--brand-500) / 0.4)' },
          '50%': { boxShadow: '0 0 60px rgb(var(--brand-500) / 0.6)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        slideInUp: {
          from: { opacity: '0', transform: 'translateY(60px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        blobMorph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 60% 30% 60% / 30% 40% 70% 50%' },
          '75%': { borderRadius: '60% 40% 60% 30% / 70% 50% 40% 60%' },
        },
      },
    },
  },
  plugins: [
    plugin(({ addBase, addComponents, addUtilities }) => {
      const gradient = (light = false) => {
        const suffix = light ? '-light' : ''
        return `linear-gradient(to right, rgb(var(--brand-gradient-from${suffix})), rgb(var(--brand-gradient-via${suffix})), rgb(var(--brand-gradient-to${suffix})))`
      }

      addBase({
        'h1, h2, h3, h4, h5, h6, .font-heading': {
          fontFamily: "var(--font-space-grotesk), 'Space Grotesk', -apple-system, sans-serif",
        },
        'code, pre, .font-mono, .metric': {
          fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
        },
        '@keyframes slideInUp': {
          from: { opacity: '0', transform: 'translateY(60px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        '@keyframes fadeInUp': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        '@keyframes pulseGlow': {
          '0%, 100%': { boxShadow: '0 0 30px rgb(var(--brand-500) / 0.4)' },
          '50%': { boxShadow: '0 0 60px rgb(var(--brand-500) / 0.6)' },
        },
        '@keyframes gradientShift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        '@keyframes blobMorph': {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 60% 30% 60% / 30% 40% 70% 50%' },
          '75%': { borderRadius: '60% 40% 60% 30% / 70% 50% 40% 60%' },
        },
      })

      addComponents({
        '.btn-gradient': {
          position: 'relative',
          padding: '0.75rem 1.5rem',
          fontWeight: '600',
          color: '#ffffff',
          borderRadius: '0.75rem',
          backgroundImage: gradient(),
          boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.4)',
          transitionProperty: 'transform, box-shadow, filter',
          transitionDuration: '200ms',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(168, 85, 247, 0.55)',
            filter: 'brightness(1.08)',
            transform: 'translateY(-2px)',
          },
        },

        '.glass-card': {
          position: 'relative',
          backgroundImage: 'linear-gradient(180deg, rgba(18, 23, 35, 0.8) 0%, rgba(10, 13, 20, 0.9) 100%)',
          backdropFilter: 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1rem',
          transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms ease, box-shadow 220ms ease',
          '&::before': {
            content: "''",
            position: 'absolute',
            inset: '0',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, transparent 55%)',
            opacity: '0',
            transition: 'opacity 220ms ease',
            borderRadius: 'inherit',
            pointerEvents: 'none',
          },
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.16)',
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 28px -12px rgba(0, 0, 0, 0.55)',
          },
          '&:hover::before': { opacity: '1' },
        },

        '.gradient-text': {
          backgroundImage: gradient(true),
          backgroundClip: 'text',
          '-webkit-background-clip': 'text',
          color: 'transparent',
        },

        '.gradient-text-white': {
          backgroundImage: 'linear-gradient(to right, #fff, #e2e8f0, #cbd5e1)',
          backgroundClip: 'text',
          '-webkit-background-clip': 'text',
          color: 'transparent',
        },

        '.nav-link': {
          position: 'relative',
          color: 'rgb(var(--text-secondary))',
          transition: 'color 200ms',
          '&:hover': { color: '#fff' },
          '&::after': {
            content: "''",
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '0',
            height: '0.125rem',
            backgroundImage:
              'linear-gradient(to right, rgb(var(--brand-gradient-from)), rgb(var(--brand-gradient-via)))',
            transition: 'all 300ms',
          },
          '&:hover::after': { width: '100%' },
        },

        '.glow-orb': {
          position: 'absolute',
          borderRadius: '9999px',
          filter: 'blur(72px)',
          opacity: '0.16',
          backgroundImage:
            'linear-gradient(to right, rgb(var(--brand-gradient-from)), rgb(var(--brand-gradient-via)))',
          pointerEvents: 'none',
        },

        '.glow-blob': {
          position: 'absolute',
          filter: 'blur(72px)',
          opacity: '0.12',
          backgroundImage:
            'linear-gradient(to right, rgb(var(--brand-gradient-from)), rgb(var(--brand-gradient-via)))',
          animation: 'blobMorph 22s ease-in-out infinite',
          pointerEvents: 'none',
        },

        '.btn-shimmer': {
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: "''",
            position: 'absolute',
            top: '0',
            left: '-100%',
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            transition: 'left 0.6s ease',
          },
          '&:hover::after': { left: '100%' },
        },
      })

      addUtilities({
        '.bg-grid-pattern': {
          backgroundImage:
            'linear-gradient(to right, rgb(var(--brand-500) / 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--brand-500) / 0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        },
        '.bg-dot-pattern': {
          backgroundImage: 'radial-gradient(rgb(var(--brand-500) / 0.15) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        },
        '.bg-mesh': {
          background:
            'radial-gradient(at 40% 20%, rgb(var(--brand-500) / 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgb(var(--brand-gradient-via) / 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgb(var(--brand-500) / 0.1) 0px, transparent 50%), radial-gradient(at 80% 50%, rgb(var(--brand-gradient-via) / 0.08) 0px, transparent 50%), radial-gradient(at 0% 100%, rgb(var(--brand-500) / 0.1) 0px, transparent 50%)',
        },

        '.animate-slide-in': { opacity: '0' },
        '.animate-slide-in.in-view': {
          animation: 'slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        },
        '.stagger-grid > *': { opacity: '0' },
        '.stagger-grid.in-view > *': {
          animation: 'slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        },
        '.stagger-grid.in-view > *:nth-child(1)': { animationDelay: '0ms' },
        '.stagger-grid.in-view > *:nth-child(2)': { animationDelay: '100ms' },
        '.stagger-grid.in-view > *:nth-child(3)': { animationDelay: '200ms' },
        '.stagger-grid.in-view > *:nth-child(4)': { animationDelay: '300ms' },
        '.stagger-grid.in-view > *:nth-child(5)': { animationDelay: '400ms' },
        '.stagger-grid.in-view > *:nth-child(6)': { animationDelay: '500ms' },
        '.stagger-grid.in-view > *:nth-child(7)': { animationDelay: '600ms' },
        '.stagger-grid.in-view > *:nth-child(8)': { animationDelay: '700ms' },

        '@media (prefers-reduced-motion: reduce)': {
          '.animate-slide-in, .stagger-grid > *, .glow-blob, .glass-card': {
            animation: 'none !important',
            transition: 'none !important',
            opacity: '1 !important',
            transform: 'none !important',
          },
          '.btn-shimmer::after': { display: 'none' },
        },
      })
    }),
  ],
}
