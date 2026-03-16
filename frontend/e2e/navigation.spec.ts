import { test, expect } from './fixtures/test-helpers';

test.describe('Navigation', () => {
  test('home page renders hero section', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /master your foundation ham radio exam/i })
    ).toBeVisible();
    await expect(page.getByText(/get started/i)).toBeVisible();
  });

  test('navigate to learn page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^learn$/i }).first().click();
    await expect(page).toHaveURL(/\/learn/);
    await expect(page.getByText(/study topics/i)).toBeVisible();
  });

  test('navigate to quiz page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^quiz$/i }).first().click();
    await expect(page).toHaveURL(/\/quiz/);
  });

  test('navigate to about page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^about$/i }).first().click();
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByText(/about hamprep/i)).toBeVisible();
  });

  test('navigate to progress page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /^progress$/i }).first().click();
    await expect(page).toHaveURL(/\/progress/);
  });

  test('theme toggle changes mode', async ({ page }) => {
    await page.goto('/');
    const themeButton = page.getByLabelText(/switch to dark mode/i);
    await expect(themeButton).toBeVisible();
    await themeButton.click();
    await expect(page.getByLabelText(/switch to light mode/i)).toBeVisible();
  });

  test('language switcher opens menu', async ({ page }) => {
    await page.goto('/');
    await page.getByLabelText(/switch language/i).click();
    await expect(page.getByText('English')).toBeVisible();
    await expect(page.getByText('Cymraeg')).toBeVisible();
  });

  test('404 page shows for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page');
    await expect(page.getByText(/404|not found/i)).toBeVisible();
  });

  test('learn topic detail page navigable', async ({ page }) => {
    await page.goto('/learn');
    await page.getByText(/licensing conditions/i).click();
    await expect(page).toHaveURL(/\/learn\/licensing-conditions/);
  });

  test('mobile responsive: hamburger menu visible at small viewport', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByLabelText(/open menu/i)).toBeVisible();
    await page.getByLabelText(/open menu/i).click();
    // Check the drawer opened with nav items
    await expect(page.getByRole('presentation').getByText('Learn')).toBeVisible();
  });
});
