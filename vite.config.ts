import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
import { federation } from '@module-federation/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        federation({
            name: 'index_common',
            remotes: {
                index_common: {
                    type: "module",
                    name: "index_common",
                    entry: "/common/index_common.js",
                },
            },
            filename: 'index_common.js',
            shared: ['react', 'react-dom', '@douyinfe/semi-ui'],
        })
    ],
    build: {
        rollupOptions: {
            input: {
                index: path.resolve(__dirname, 'index.html'),
            }
        },
        minify: 'esbuild', // or true
        modulePreload: false,
        target: 'esnext',
        cssCodeSplit: false,
    },
    server: {
        proxy: {
            '/common': 'http://127.0.0.1:8000',
            '^/api|/file': 'http://127.0.0.1:9000',
        }
    }
})
