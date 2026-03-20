import { test, expect } from "@playwright/test";

test("mock tasks API", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("token", "mock-token");
  });

  await page.route("**/api/tasks**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([{ id: 1, title: "Mock Task 1" }]),
    });
  });

  await page.goto("/dashboard");

  await expect(page.getByText("Mock Task 1")).toBeVisible();
});
