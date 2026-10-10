import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Multi-page app. Main site at "/", secondary experiments isolated under /labs/*.
// Static media lives in /public/assets (served unhashed at /assets/*; see docs/ASSETS.md).
const r = (p) => resolve(import.meta.dirname, p);

export default defineConfig({
  server: { host: true, port: 5173 },
  build: {
    target: 'esnext',            // three/webgpu + TSL need modern syntax
    chunkSizeWarningLimit: 1400, // the lazy three chunk is large by nature
    rollupOptions: {
      input: {
        main: r('index.html'),
        droneFlight: r('labs/drone-flight/index.html'),
        salesCockpit: r('labs/sales-cockpit/index.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
        }
      }
    }
  }
});
