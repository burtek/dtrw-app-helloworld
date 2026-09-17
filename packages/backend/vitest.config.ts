import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';


config({ path: '.env.test' });

// https://vite.dev/config/
export default defineConfig({
    resolve: { tsconfigPaths: true },
    test: {
        globals: true,
        environment: 'node'
    }
});
