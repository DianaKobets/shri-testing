import { test, expect } from '@playwright/test';

test('Генерация файла', async ({ page }) => {
    await page.goto('/generate');

    await page.getByText('Начать генерацию').click();
    await expect(page.getByText(/успешно/i)).toBeVisible({ timeout: 10000 });
});

test('Ошибка при генерации файла', async ({ page }) => {
    await page.goto('/generate');

    await page.route('**/report?size=*', (route) =>
        route.fulfill({ status: 500, body: JSON.stringify({ error: '' }) })
    );

    await page.getByText('Начать генерацию').click();
    await expect(page.getByText(/ошибка/i)).toBeVisible();
});
