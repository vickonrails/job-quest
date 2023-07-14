import { defineConfig, transformWithEsbuild } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { viteStaticCopy as copy } from 'vite-plugin-static-copy'

async function transformFunc(content: string, filename = 'content.min.js') {
  return (await transformWithEsbuild(content, filename, { target: 'es6' })).code;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copy({
      targets: [
        { src: resolve(__dirname, './src/manifest.json'), dest: './' },
        { src: resolve(__dirname, './src/content.ts'), dest: './', transform: transformFunc, rename: (filename) => `${filename}.js` },
      ],
    })
  ],
})
