// @ts-check
import { defineConfig } from 'astro/config';

// Load environment variables (Astro already supports this automatically)
export default defineConfig({
    site: process.env.SITE_URL || 'http://localhost:4321',
    base: process.env.BASE_PATH || '/',
});