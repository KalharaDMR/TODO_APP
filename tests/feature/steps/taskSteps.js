const {createBdd} = require('playwright-bdd');
const {Given,When,Then} = createBdd()

const {expect} = require('@playwright/test')
let browser;
let page;

Given('the user is logged in', async ({ page }) => {
  // Playwright automatically opens the browser for you!
  await page.goto('http://localhost:5173');
  // navigate to register page
  await page.getByRole('link', { name: 'Create free account' }).click();

  // register user
  await page.getByPlaceholder('Choose a username').fill('Rusira');
  await page.getByPlaceholder('Create a password').fill('20021021@Rusira');
  await page.getByPlaceholder('Confirm your password').fill('20021021@Rusira');

  await page.getByRole('button', { name: 'Create Account' }).click();
  
  await page.getByPlaceholder('Enter your username').fill('Rusira');
  await page.getByPlaceholder('Enter your password').fill('20021021@Rusira');
  await page.getByRole('button', { name: 'Login to Dashboard' }).click();
});

When('the user creates a new task', async ({ page }) => {
  await page.getByRole('button', { name: 'New Task' }).click();
  await page.getByPlaceholder('Enter task title').fill('BCtyuty Task');

  await page.getByRole('button', { name: 'Create Task' }).click();
});

Then('the task should appear in the dashboard', async ({ page }) => {
  const task = page.getByText('BCtyuty Task');
  
  // Use Playwright's Super Judge (Auto-Retrying!)
  await expect(task).toBeVisible();
  
  // Playwright automatically closes the browser for you at the end!
});