import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Varias páginas HTML, sin React Router.
      input: {
        main: 'index.html',
        dashboard: 'dashboard.html',
        gracias: 'gracias.html',
      },
    },
  },
})
