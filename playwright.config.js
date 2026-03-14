import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// 1. The Translator config stays exactly the same!
const secretBddFolder = defineBddConfig({
  features: './tests/feature/*.feature',
  steps: [
    './tests/feature/steps/*.js',
  ],
});

export default defineConfig({
  workers: 1, 

  use: {
    // 🌟 DOCKER FIX 1: Network bindings.
    // Docker prefers '127.0.0.1' over 'localhost' to prevent IPv6 routing issues.
    baseURL: 'http://127.0.0.1:5173',
    
    // 🌟 DOCKER FIX 2: Dynamic Headless Mode
    // It runs WITHOUT a browser UI in Docker/CI, but WITH a UI on your local machine.
    headless: !!process.env.CI, 
    
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },

  projects: [
    {
      name: 'BDD Tests',
      testDir: secretBddFolder, 
    },
    {
      name: 'Normal Tests',
      testDir: './tests',       
      testMatch: '**/*.spec.js' 
    }
  ],

  webServer: {
    // This command starts your docker containers
    command: 'docker compose up --build',
    
    // 🌟 FIX: Point this to your frontend port (5173) using 127.0.0.1
    // Playwright will wait until your frontend is live before starting tests
    url: 'http://127.0.0.1:5173', 
    
    // Don't restart the server if it's already running locally
    reuseExistingServer: !process.env.CI,
    // Give it enough time to build the docker images (e.g., 2 minutes)
    timeout: 120000, 
  },

  reporter: [['html'], ['list']]
});