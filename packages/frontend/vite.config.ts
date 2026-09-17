import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';


// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api1': {
                target: 'http://localhost:4000',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api1/, '')
            },
            '/api2': {
                target: 'http://localhost:4001',
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api2/, '')
            }
        },
        port: 3000
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './setup-tests.ts'
    }
});
