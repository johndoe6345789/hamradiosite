import { test as base, expect, Page } from '@playwright/test';

export const test = base.extend<{
  homePage: Page;
}>({
  homePage: async ({ page }, use) => {
    await page.goto('/');
    await use(page);
  },
});

export { expect };

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /log in/i }).click();
}

export async function register(
  page: Page,
  username: string,
  email: string,
  password: string
) {
  await page.goto('/register');
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/email address/i).fill(email);
  await page.getByLabel(/^password$/i).fill(password);
  await page.getByLabel(/confirm password/i).fill(password);
  await page.getByRole('button', { name: /register/i }).click();
}

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

export async function navigateTo(page: Page, path: string) {
  await page.goto(path);
  await waitForPageLoad(page);
}

export async function toggleTheme(page: Page) {
  await page.getByLabel(/switch to (dark|light) mode/i).click();
}

export async function switchLanguage(page: Page, language: string) {
  await page.getByLabel(/switch language/i).click();
  await page.getByText(language).click();
}
