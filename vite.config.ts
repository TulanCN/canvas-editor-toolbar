import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CanvasEditorToolbar',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['vue', '@hufe921/canvas-editor', 'element-plus'],
      output: {
        globals: {
          vue: 'Vue',
          '@hufe921/canvas-editor': 'CanvasEditor',
          'element-plus': 'ElementPlus'
        }
      }
    }
  }
}) 