import os

base = r"C:\Users\shyam\.gemini\antigravity\scratch\n-lams-national-platform\field-app"

# 1. vite.config.js
with open(os.path.join(base, "vite.config.js"), "w", encoding="utf-8") as f:
    f.write("""import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3009,
    host: true
  },
  preview: {
    port: 3009,
    host: true
  }
})
""")

# 2. tailwind.config.js
with open(os.path.join(base, "tailwind.config.js"), "w", encoding="utf-8") as f:
    f.write("""/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          500: '#0284c7',
          600: '#0369a1',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#0f172a'
        }
      }
    },
  },
  plugins: [],
}
""")

# 3. postcss.config.js
with open(os.path.join(base, "postcss.config.js"), "w", encoding="utf-8") as f:
    f.write("""export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
""")

# 4. index.html
with open(os.path.join(base, "index.html"), "w", encoding="utf-8") as f:
    f.write("""<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#1e3a8a" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <title>N-LAMS Field | Ground Verification</title>
    <link rel="manifest" href="/manifest.json" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  </head>
  <body class="bg-slate-100 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW failed:', err));
        });
      }
    </script>
  </body>
</html>
""")

# 5. public/manifest.json
with open(os.path.join(base, "public", "manifest.json"), "w", encoding="utf-8") as f:
    f.write("""{
  "name": "N-LAMS Field: Ground Verification",
  "short_name": "N-LAMS Field",
  "description": "Ground Cadastral Verification & Land Acquisition Inspection for Cadastral Surveyors",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#1e3a8a",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/favicon.svg",
      "sizes": "192x192 512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
""")

# 6. public/sw.js
with open(os.path.join(base, "public", "sw.js"), "w", encoding="utf-8") as f:
    f.write("""const CACHE_NAME = 'nlams-field-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('/api/')) return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).catch(() => cached);
    })
  );
});
""")

# 7. public/favicon.svg
with open(os.path.join(base, "public", "favicon.svg"), "w", encoding="utf-8") as f:
    f.write("""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="24" fill="#1e3a8a"/>
  <path d="M50 20 L80 40 L80 75 L50 85 L20 75 L20 40 Z" fill="none" stroke="#38bdf8" stroke-width="6"/>
  <circle cx="50" cy="50" r="12" fill="#10b981"/>
  <circle cx="50" cy="50" r="22" fill="none" stroke="#10b981" stroke-width="4" stroke-dasharray="4 4"/>
</svg>
""")

# 8. src/index.css
with open(os.path.join(base, "src", "index.css"), "w", encoding="utf-8") as f:
    f.write("""@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  -webkit-tap-highlight-color: transparent;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  touch-action: manipulation;
}

::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.leaflet-container {
  font-family: inherit;
  z-index: 10;
}
""")

print("SUCCESS: Config, HTML, PWA, and CSS files created!")
