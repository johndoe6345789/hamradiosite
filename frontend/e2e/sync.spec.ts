import { test, expect, register } from './fixtures/test-helpers';

const uniqueUser = () => {
  const id = Date.now().toString(36);
  return { username: `testuser${id}`, email: `test${id}@example.com`, password: 'TestPass123!' };
};

test.describe('Frontend-Backend sync', () => {
  test('register creates account and redirects', async ({ page }) => {
    const u = uniqueUser();
    await register(page, u.username, u.email, u.password);
    await expect(page).toHaveURL(/\/(en)?$/, { timeout: 10000 });
  });

  test('learn page loads topics from backend API', async ({ page }) => {
    await page.goto('/learn');
    await page.waitForSelector('text=/licensing conditions/i', { timeout: 10000 });
    await expect(page.getByText(/licensing conditions/i).first()).toBeVisible();
    await expect(page.getByText(/technical basics/i).first()).toBeVisible();
    await expect(page.getByText(/propagation/i).first()).toBeVisible();
    await expect(page.getByText(/safety/i).first()).toBeVisible();
  });

  test('learn topic detail loads content from backend', async ({ page }) => {
    await page.goto('/learn');
    await page.waitForSelector('text=/licensing conditions/i', { timeout: 10000 });
    await page.getByText(/licensing conditions/i).first().click();
    await expect(page).toHaveURL(/\/learn\/licensing-conditions/, { timeout: 10000 });
    await expect(page.getByText(/amateur radio/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('quiz page loads topics from backend for topic quizzes', async ({ page }) => {
    await page.goto('/quiz');
    await page.waitForSelector('text=/licensing conditions/i', { timeout: 10000 });
    const topicCards = page.getByRole('link', { name: /start quiz/i });
    const count = await topicCards.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  test('progress page requires authentication', async ({ page }) => {
    await page.goto('/progress');
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('full quiz flow: register, take quiz, view results', async ({ page }) => {
    const u = uniqueUser();
    await register(page, u.username, u.email, u.password);
    await expect(page).toHaveURL(/\/(en)?$/, { timeout: 10000 });

    // Go to quiz and start a topic quiz
    await page.goto('/quiz', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=/licensing conditions/i', { timeout: 15000 });
    await page.getByRole('link', { name: /start quiz/i }).first().click();
    await expect(page).toHaveURL(/\/quiz\/topic-/, { timeout: 10000 });

    // Start the quiz
    await page.getByRole('button', { name: /start quiz/i }).click();

    // Wait for question to load from backend
    await expect(page.getByText('Q1')).toBeVisible({ timeout: 15000 });

    // Answer all questions and submit
    for (let i = 0; i < 10; i++) {
      // Click the first answer option (Paper wrapper)
      const answerOptions = page.locator('.MuiPaper-outlined');
      await answerOptions.first().click();
      await page.waitForTimeout(200);

      // Check if this is the last question (submit button visible)
      const submitBtn = page.getByRole('button', { name: /submit answers/i });
      if (await submitBtn.isVisible().catch(() => false)) {
        await submitBtn.click();
        break;
      }

      // Go to next question
      const nextBtn = page.getByRole('button', { name: /next question/i });
      await nextBtn.click();
      await page.waitForTimeout(300);
    }

    // Should navigate to results page
    await expect(page).toHaveURL(/\/quiz\/results\//, { timeout: 15000 });
    // Results should show score
    await expect(page.getByText(/\d+\s*\/\s*\d+/)).toBeVisible({ timeout: 10000 });
  });

  test('progress page shows data after completing a quiz', async ({ page }) => {
    const u = uniqueUser();
    await register(page, u.username, u.email, u.password);
    await expect(page).toHaveURL(/\/(en)?$/, { timeout: 10000 });

    // Start and complete a topic quiz
    await page.goto('/quiz', { waitUntil: 'networkidle' });
    await page.waitForSelector('text=/licensing conditions/i', { timeout: 15000 });
    await page.getByRole('link', { name: /start quiz/i }).first().click();
    await page.getByRole('button', { name: /start quiz/i }).click();
    await expect(page.getByText('Q1')).toBeVisible({ timeout: 15000 });

    // Answer all questions
    for (let i = 0; i < 10; i++) {
      const answerOptions = page.locator('.MuiPaper-outlined');
      await answerOptions.first().click();
      await page.waitForTimeout(200);

      const submitBtn = page.getByRole('button', { name: /submit answers/i });
      if (await submitBtn.isVisible().catch(() => false)) {
        await submitBtn.click();
        break;
      }
      const nextBtn = page.getByRole('button', { name: /next question/i });
      await nextBtn.click();
      await page.waitForTimeout(300);
    }

    await expect(page).toHaveURL(/\/quiz\/results\//, { timeout: 15000 });

    // Now check progress page
    await page.goto('/progress');
    await expect(page).toHaveURL(/\/progress/, { timeout: 10000 });
    await expect(page.getByText(/progress dashboard/i)).toBeVisible({ timeout: 10000 });
  });
});
