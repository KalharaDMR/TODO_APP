import { test, expect } from "@playwright/test";

test("user can register and login", async ({ page }) => {
  // open login page
  await page.goto("/");

  // navigate to register page
  await page.getByRole("link", { name: "Create free account" }).click();

  // register user
  await page.getByPlaceholder("Choose a username").fill("testuser");
  await page.getByPlaceholder("Create a password").fill("123456");
  await page.getByPlaceholder("Confirm your password").fill("123456");

  await page.getByRole("button", { name: "Create Account" }).click();

  // wait until redirected to login
  await page.waitForURL("**/");

  // login
  await page.getByPlaceholder("Enter your username").fill("testuser");
  await page.getByPlaceholder("Enter your password").fill("123456");

  await page.getByRole("button", { name: "Login to Dashboard" }).click();

  // assertion
  await expect(page).toHaveURL(/dashboard/);
});
