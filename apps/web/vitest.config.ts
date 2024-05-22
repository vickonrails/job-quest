/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        watch: false,
        environment: 'jsdom',
        coverage: {
            all: true,
            include: ['src/components/**/*.{ts,tsx}'],
            exclude: ['src/**/*.test.{ts,tsx}', 'src/**/index.{ts,tsx}'],
        },
        globals: true,
        setupFiles: ['./vitest/setup.ts'],
    },
    resolve: {
        alias: {
            '@components/*': resolve(__dirname, './src/components/*')
        }
    },
})
