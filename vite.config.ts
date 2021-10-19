import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path  = require('path')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve:{
    alias: {
      kaboom: path.resolve('node_modules/kaboom/dist/kaboom.mjs'),
      "@": `${path.resolve(__dirname, 'src/')}/`
    }
  }
})
