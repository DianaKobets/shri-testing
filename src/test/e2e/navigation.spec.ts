import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/', { waitUntil: 'networkidle' });
    });

    test('navigates to Home page', async ({ page }) => {
        await page.getByRole('link', { name: 'CSV Аналитик' }).click();
        await expect(page).toHaveURL('/');
        await expect(page.getByTestId('home-page')).toBeVisible();
    });

    test('navigates to Generate page', async ({ page }) => {
        await page.getByRole('link', { name: 'CSV Генератор' }).click();
        await expect(page).toHaveURL('/generate');
        await expect(page.getByTestId('generate-page')).toBeVisible();
    });

    test('navigates to History page', async ({ page }) => {
        await expect(page.getByRole('link', { name: 'История' })).toBeVisible({ timeout: 60000 });
        await page.getByRole('link', { name: 'История' }).click();
        await expect(page).toHaveURL('/history');
        await expect(page.getByTestId('history-page')).toBeVisible();
    });
});
