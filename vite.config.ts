import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        background: resolve(__dirname, "background.html"),
        newbridge: resolve(__dirname, "newbridge.html"),
        deletebridge: resolve(__dirname, "deletebridge.html")
      }
    }
  }
})
