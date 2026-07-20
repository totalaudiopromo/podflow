import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // @totalaudiopromo/ui is symlinked from ../newsjack/packages/ui, which carries its
  // own node_modules/react. Without deduping, the shared components load a second React
  // instance → "Cannot read properties of null (reading 'useState')" → blank page.
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        bestTools: resolve(__dirname, 'best-tools.html'),
        howItWorks: resolve(__dirname, 'how-it-works.html'),
        pricingCompare: resolve(__dirname, 'pricing-compare.html'),
        proof: resolve(__dirname, 'proof.html'),
      },
    },
  },
})
