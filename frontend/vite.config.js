import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: parseInt(env.VITE_API_URL || '5000'),
          changeOrigin: true,
        },
      },
      port: parseInt(env.VITE_FRONTEND_PORT || '3000'),
      host: '0.0.0.0'
    }
  }
});
