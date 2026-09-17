import { test, expect } from '@playwright/test';

test('renders response from api', async ({ page }) => {
  await page.goto('');

  await expect(page.locator('body')).toHaveText(/Response1: Hello world from backend/);
  await expect(page.locator('body')).toHaveText(/Response2: Hello world from backend-sqlite/);
});
