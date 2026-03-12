import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  workers: 1, // ✅ run tests sequentially (fixes shared memory issues)

  use: {
    baseURL: 'http://localhost:5173',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  webServer: [
    {
      command: 'node backend/server.js',
      port: 5000,
      reuseExistingServer: true
    },
    {
      command: 'npm run dev --prefix frontend',
      port: 5173,
      reuseExistingServer: true
    }
  ],

  reporter: [
    ['html'],
    ['list']
  ]
});