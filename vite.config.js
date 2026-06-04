import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import os from 'node:os';

// AiSEng lab-VM reverse-proxy convention: public URLs are
// https://<hostname>:<port> on ports 5000-5005 and 8100-8105.
// Default to 5002; override via VITE_PORT and VITE_PUBLIC_HOSTNAME.
const PORT = Number(process.env.VITE_PORT) || 5002;
const HOSTNAME = process.env.VITE_PUBLIC_HOSTNAME || os.hostname();

// Opt-in support for running behind a path-stripping reverse proxy that serves
// the app at https://<host>/proxy/<port>/ (the lab environment). OFF by default
// so local dev, CI and tests use the standard root base — nothing host-specific
// is baked in. Enable at runtime only:  VITE_PROXY_BASE=1 npm run dev
const PROXY = Boolean(process.env.VITE_PROXY_BASE);
const BASE = PROXY ? `/proxy/${PORT}/` : '/';
const BASE_NO_SLASH = BASE.replace(/\/+$/, ''); // '/proxy/5002' or ''


// The proxy STRIPS the `/proxy/<port>` prefix before forwarding, so Vite sees
// bare paths (`/`, `/src/main.jsx`, `/income`) while configured to serve under
// BASE. This middleware re-adds the stripped prefix to each incoming request,
// mirroring the proxy. It is registered at the FRONT of the stack so it runs
// before Vite's own base check (which would otherwise reject the bare paths).
// The guard makes it a no-op if a request already carries the prefix.
function reapplyStrippedProxyBase() {
  return {
    name: 'reapply-stripped-proxy-base',
    configureServer(server) {
      server.middlewares.stack.unshift({
        route: '',
        handle: (req, _res, next) => {
          if (
            req.url &&
            req.url !== BASE_NO_SLASH &&
            !req.url.startsWith(`${BASE_NO_SLASH}/`)
          ) {
            req.url = BASE_NO_SLASH + req.url;
          }
          next();
        },
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), ...(PROXY ? [reapplyStrippedProxyBase()] : [])],
  base: BASE,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    // Playwright owns the e2e/ specs; keep them out of the vitest unit run.
    exclude: ['**/e2e/**', '**/node_modules/**', '**/dist/**'],
  },
  server: {
    host: '0.0.0.0',
    port: PORT,
    strictPort: true,
    // Trust the lab reverse-proxy hostnames (e.g. code-lab13110.labs.decoded.com).
    allowedHosts: [HOSTNAME, '.labs.decoded.com'],
    hmr: PROXY
      ? { protocol: 'wss', host: HOSTNAME, clientPort: 443, path: BASE }
      : undefined,
  },
});
 