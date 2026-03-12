import { test as base, expect } from '@playwright/test';

export const test = base.extend({

  loggedInPage: async ({ page, request }, use) => {

    // create user directly via API
    await request.post('http://localhost:5000/api/auth/register', {
      data: {
        username: 'testuser',
        password: '123456'
      }
    });

    await page.goto('/');

    await page.getByPlaceholder('Enter your username').fill('testuser');
    await page.getByPlaceholder('Enter your password').fill('123456');

    await page.getByRole('button', { name: 'Login to Dashboard' }).click();

    await page.waitForURL('**/dashboard');

    await use(page);
  }

});

export { expect };