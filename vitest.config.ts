/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        environment: 'jsdom',
        coverage: {
            all: true,
            include: ["src/**/*.{ts,tsx}"],
        }
    },
    resolve: {
        alias: {
            '@components/*': resolve(__dirname, "./src/components/*")
        }
    }
})
