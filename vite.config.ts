import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve, dirname } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8')) as {
  version: string
  peerDependencies?: Record<string, string>
}
const peerDeps = Object.keys(pkg.peerDependencies || {})

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.*', 'src/**/*.stories.*', 'src/test/**'],
      insertTypesEntry: true,
    }),
  ],
  define: {
    __ADMIN_KIT_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    lib: {
      entry: {
        'admin-kit': resolve(__dirname, 'src/index.ts'),
        'auth/index': resolve(__dirname, 'src/auth/index.ts'),
        'shell/index': resolve(__dirname, 'src/shell/index.ts'),
        'ui/index': resolve(__dirname, 'src/ui/index.ts'),
        'locale/index': resolve(__dirname, 'src/locale/public.ts'),
        'hooks/index': resolve(__dirname, 'src/hooks/index.ts'),
        'utils/index': resolve(__dirname, 'src/utils/index.ts'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
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
        'react/jsx-dev-runtime',
      ],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
})
