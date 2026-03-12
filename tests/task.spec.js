import { test, expect } from './fixtures.js';

test('user can create a task', async ({ loggedInPage }) => {

  const page = loggedInPage;

  const titleInput = page.getByPlaceholder('Enter task title');
  await titleInput.waitFor();
  await titleInput.fill('Playwright Demo Task');

  const createBtn = page.getByRole('button', { name: 'Create Task' });
  await expect(createBtn).toBeEnabled();

  await createBtn.click();

  await expect(page.getByText('Playwright Demo Task')).toBeVisible();

});