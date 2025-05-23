import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/students': 'http://localhost:5000', // assuming your backend is on port 5000
    },
  },
})

