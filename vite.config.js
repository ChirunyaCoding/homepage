import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
                games: path.resolve(__dirname, 'games/index.html'),
                tools: path.resolve(__dirname, 'tools/index.html'),
                youtube: path.resolve(__dirname, 'youtube/index.html'),
                about: path.resolve(__dirname, 'about/index.html'),
            },
        },
    },
});
