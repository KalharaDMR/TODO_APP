import { test, expect } from './fixtures.js';

test('user can create a task', async ({ loggedInPage }) => {

  const page = loggedInPage;
  await page.getByRole('button', { name: 'New Task' }).click();
  await page.getByPlaceholder('Enter task title').fill('Test Title2347')
  await page.getByPlaceholder('Enter task description').fill('Test Description for the task');
  await page.getByLabel('Due Date').fill('2026-10-31');
  await page.getByLabel('Priority').selectOption({ label: 'Medium' });
  await page.getByLabel('Category').selectOption({ label: 'Work' });
  await page.getByPlaceholder('e.g., urgent, important, home').fill('urgent,important')
  const createBtn = page.getByRole('button', { name: 'Create Task' });
  await expect(createBtn).toBeEnabled();
  await createBtn.click();
  await expect(page.getByText('Test Title2347')).toBeVisible();
});