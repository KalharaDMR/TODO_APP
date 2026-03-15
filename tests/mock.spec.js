import { test, expect } from '@playwright/test';

test('mock tasks API', async ({ page }) => {

  await page.addInitScript(() => {
    localStorage.setItem('token', 'mock-token');
  });

  await page.route('**/api/tasks**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, title: 'Mock Task 980' }
      ])
    });
  });

  
  // 1. SET THE TRAP (Notice there is NO "await" here!)
  // We save it to a variable so we can check it later.
  const responsePromise = page.waitForResponse('**/api/tasks**');

  // 2. TRIGGER THE ACTION
  // Now we go to the page. The page loads and fires the network request!
  await page.goto('/dashboard');

  // 3. CHECK THE TRAP
  // Now we wait for the trap we set in step 1 to finish catching the response.
  await responsePromise;

  // 4. THE FINAL TEST
  await expect(page.getByText('Mock Task 980')).toBeVisible();
});