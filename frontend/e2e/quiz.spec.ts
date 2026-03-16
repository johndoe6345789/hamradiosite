import { test, expect } from './fixtures/test-helpers';

test.describe('Quiz flow', () => {
  test('quiz selection page displays mock exam card', async ({ page }) => {
    await page.goto('/quiz');
    await expect(page.getByText(/mock examination/i)).toBeVisible();
    await expect(page.getByText('26 questions', { exact: true })).toBeVisible();
    await expect(page.getByText(/55 minutes/i)).toBeVisible();
    await expect(page.getByText(/pass mark: 73%/i)).toBeVisible();
  });

  test('quiz selection page displays topic quizzes', async ({ page }) => {
    await page.goto('/quiz');
    // Wait for topics to load from API
    await page.waitForSelector('text=/licensing conditions/i', { timeout: 10000 });
    await expect(page.getByText(/licensing conditions/i).first()).toBeVisible();
    await expect(page.getByText(/technical basics/i).first()).toBeVisible();
    await expect(page.getByText(/safety/i).first()).toBeVisible();
  });

  test('clicking start exam navigates to quiz page', async ({ page }) => {
    await page.goto('/quiz');
    await page.getByRole('link', { name: /start mock exam/i }).click();
    await expect(page).toHaveURL(/\/quiz\/mock-exam/);
  });

  test('clicking start quiz navigates to topic quiz', async ({ page }) => {
    await page.goto('/quiz');
    // Wait for topics to load from API
    await page.waitForSelector('text=/licensing conditions/i', { timeout: 10000 });
    const startButtons = page.getByRole('link', { name: /start quiz/i });
    await startButtons.first().click();
    await expect(page).toHaveURL(/\/quiz\//);
  });

  test('active quiz page shows start button', async ({ page }) => {
    await page.goto('/quiz/mock-exam');
    await expect(
      page.getByRole('button', { name: /start mock exam/i })
    ).toBeVisible();
  });

  test('quiz page displays start button before quiz begins', async ({ page }) => {
    await page.goto('/quiz/mock-exam');
    await expect(page.getByRole('button', { name: /start mock exam/i })).toBeVisible();
  });
});
