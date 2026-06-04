import { defineConfig, devices } from '@playwright/test';

// E2E config for the responsive (320px reflow) checks. Reuses the running dev
// server on 5002 if there is one, otherwise starts it.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5002',
    // 320px is the WCAG 1.4.10 Reflow target width.
    viewport: { width: 320, height: 640 },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 640 } } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5002',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
