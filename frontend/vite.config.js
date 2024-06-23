import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the backend server
      '/': {
        target: 'http://localhost:3001',  // Adjust the target to your backend server's URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\//, ''),  // Remove /api prefix when forwarding
      },
    },
  },
});