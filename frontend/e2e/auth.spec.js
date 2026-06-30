import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('login page elements render correctly', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });
});
