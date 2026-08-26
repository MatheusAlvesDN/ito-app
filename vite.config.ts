import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CORREÇÃO: Usar string vazia '' é a forma mais segura para caminhos relativos no Android
  base: '', 
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Garante que a pasta antiga seja apagada antes de criar a nova
    // IMPORTANTE: Garante compatibilidade com WebViews de Androids um pouco mais antigos
    target: 'es2015',
    chunkSizeWarningLimit: 1000,
  },
})