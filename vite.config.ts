import { defineConfig, type PluginOption } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Keep this in sync with vercel.json and src/admin/lib/config.ts.
const ADMIN_SLUG = '/gea-ops-0499ae'

// Dev-only parity with the Vercel rewrite: serve the staff console at the slug locally
// so `npm run dev` and production behave the same (the router uses the slug as basename).
function adminDevAlias(): PluginOption {
  return {
    name: 'admin-dev-alias',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = req.url ?? ''
        if (url === ADMIN_SLUG || url.startsWith(`${ADMIN_SLUG}/`) || url.startsWith(`${ADMIN_SLUG}?`)) {
          req.url = '/console.html'
        }
        next()
      })
    },
  }
}

// Two build entries in one project:
//   index.html   → public marketing site
//   console.html → staff admin SPA (mounted behind an obscure slug, see vercel.json)
// Separate entries keep the admin's Supabase/router code out of the marketing bundle.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    adminDevAlias(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        console: resolve(__dirname, 'console.html'),
      },
    },
  },
})
