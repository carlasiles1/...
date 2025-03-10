import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  server: {
    open: true,  // Abre el navegador automáticamente
  },
  resolve: {
    alias: {
      '@': '/src',  // Asegúrate de que esta línea esté configurada
    },
  },
  plugins: [vue()],
})
