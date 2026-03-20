// import { test, expect } from './fixtures.js';

// test('user can create a task', async ({ loggedInPage }) => {

//   const page = loggedInPage;

//   const titleInput = page.getByPlaceholder('Enter task title');
//   await titleInput.waitFor();
//   await titleInput.fill('Playwright Demo Task');

//   const createBtn = page.getByRole('button', { name: 'Create Task' });
//   await expect(createBtn).toBeEnabled();

//   await createBtn.click();

//   await expect(page.getByText('Playwright Demo Task')).toBeVisible();

// });

import { test, expect } from "@playwright/test";

test("user can create a task", async ({ page }) => {
  // mock login token
  await page.addInitScript(() => {
    localStorage.setItem("token", "mock-token");
  });

  // open dashboard
  await page.goto("/dashboard");

  // wait for UI
  const titleInput = page.getByPlaceholder("Enter task title");
  await expect(titleInput).toBeVisible();

  // fill task
  await titleInput.fill("Playwright Demo Task");

  // click create
  const createBtn = page.getByRole("button", { name: "Create Task" });
  await createBtn.click();

  // verify task created
  await expect(page.getByText("Playwright Demo Task")).toBeVisible();
});
