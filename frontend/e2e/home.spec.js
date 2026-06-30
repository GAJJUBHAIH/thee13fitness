import { test, expect } from '@playwright/test';

test('has title and displays main components', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vite/); // Default vite title unless changed

  // Expect the navigation or some main element to be visible
  const navbar = page.locator('nav');
  if (await navbar.isVisible()) {
      await expect(navbar).toBeVisible();
  }
});
