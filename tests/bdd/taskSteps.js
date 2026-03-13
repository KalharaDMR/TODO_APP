const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const assert = require('assert');

setDefaultTimeout(30000); // 30 seconds

let browser;
let page;

Given('the user is logged in', async function () {

  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();

  await page.goto('http://localhost:5173');

  await page.getByPlaceholder('Enter your username').fill('ramesh');
  await page.getByPlaceholder('Enter your password').fill('Ramesh123');

  await page.getByRole('button', { name: 'Login to Dashboard' }).click();
});

When('the user creates a new task', async function () {

  await page.getByPlaceholder('Enter task title').fill('BDD Task');

  await page.getByRole('button', { name: 'Create Task' }).click();
});

Then('the task should appear in the dashboard', async function () {

  const task = page.getByText('BDD Task');
  assert(await task.isVisible());

  await browser.close();
});