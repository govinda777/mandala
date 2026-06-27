import { test, expect } from '@playwright/test';

test.describe('Mandala Generator E2E', () => {

  test('should render basic application correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Mandala Generator/);

    // Wait for canvas
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Ensure no runtime errors
    expect(errors.length).toBe(0);
  });

  test('should verify different petal styles visually', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000); // Wait for initial render/animations

    // Set a fixed number of petals to make the screenshots comparable
    await page.evaluate(() => {
      const petalsInput = document.getElementById('petals-input') as HTMLInputElement;
      if (petalsInput) {
        petalsInput.value = '8';
        petalsInput.dispatchEvent(new Event('input', { bubbles: true }));
        petalsInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    await page.waitForTimeout(500);

    // Open "Estrutura Geral" accordion if not open
    const estruturaBtn = page.locator('button:has-text("Estrutura Geral")');
    if (await estruturaBtn.getAttribute('aria-expanded') === 'false') {
      await estruturaBtn.click();
      await page.waitForTimeout(500);
    }

    const styles = [
      { value: 'generative', name: 'Generativo', filename: 'ui-verification-generative.png' },
      { value: 'smooth', name: 'Suave', filename: 'ui-verification-smooth.png' },
      { value: 'sharp', name: 'Afiado', filename: 'ui-verification-sharp.png' }
    ];

    for (const style of styles) {
      const selectElement = page.locator('select').filter({ hasText: 'Generativo (Cartesiano)' });
      await selectElement.selectOption(style.value);

      // Wait for rendering to complete
      await page.waitForTimeout(1000);

      // Verify visual output using Playwright's built-in visual comparison
      await expect(page).toHaveScreenshot(style.filename, { maxDiffPixelRatio: 0.1 });
    }
  });

});
