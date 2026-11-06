import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'))
const peerDeps = Object.keys(pkg.peerDependencies || {})

export default defineConfig({
  plugins: [react()],
  define: {
    __ADMIN_KIT_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'AdminKit',
      formats: ['es'],
      fileName: () => 'admin-kit.js',
    },
    rollupOptions: {
      external: [
        ...peerDeps,
        'async-mutex',
        /^@mui\//,
        /^@emotion\//,
        /^react-icons\//,
        /^lodash-es/,
        /^@reduxjs\/toolkit/,
        /^@rpldy\//,
        /^react-image-crop/,
        'react/jsx-runtime',
      ],
      output: {
        preserveModules: false,
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
