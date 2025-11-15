import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// change target if your backend runs elsewhere
const BACKEND = process.env.VITE_BACKEND || 'http://localhost:3000'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: BACKEND,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
