import { test as base, expect } from '@playwright/test';

export const test = base.extend({

  loggedInPage: async ({ page, request }, use) => {

    // create user directly via API
    await request.post('http://localhost:5000/api/auth/register', {
      data: {
        username: 'Dineth',
        password: '20021021@Rusira'
      }
    });

    await page.goto('/');

    await page.getByPlaceholder('Enter your username').fill('Dineth');
    await page.getByPlaceholder('Enter your password').fill('20021021@Rusira');

    await page.getByRole('button', { name: 'Login to Dashboard' }).click();

    await page.waitForURL('**/dashboard',{ timeout: 120000 });

    await use(page);
  }

});

export { expect };