import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Split vendors into separate chunks so app-code updates don't bust
        // React or Framer Motion caches for returning visitors.
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom'))
            return 'vendor-react'
          if (id.includes('node_modules/framer-motion'))
            return 'vendor-motion'
        },
      },
    },
  },
})
