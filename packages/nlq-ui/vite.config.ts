import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/nlq/",
  optimizeDeps: {
    include: ['nlq'],
  },
  build: {
    commonjsOptions: {
      include: [/nlq/, /node_modules/],
    },
  },
})
