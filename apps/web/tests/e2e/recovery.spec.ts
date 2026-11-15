import { test, expect } from '@playwright/test';

test.describe('Recovery and Edge Cases', () => {
  test('gracefully recovers when localStorage has corrupted JSON or wrong schema', async ({
    page,
  }) => {
    // Inject corrupted save before loading
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'ainda-estou-aqui:ep01:progress',
        '{"corrupt": true, "schemaVersion": 9999}'
      );
    });

    await page.goto('/');

    // App still boots normally and defaults to S01
    const shotBadge = page.locator('.shot-badge');
    await expect(shotBadge).toContainText('S01');

    const playBtn = page.locator('.primary-touch-btn');
    await expect(playBtn).toBeVisible();
  });

  test('replay button safely resets shot to beginning without error', async ({ page }) => {
    await page.goto('/');

    const playBtn = page.locator('.primary-touch-btn');
    await playBtn.click();

    const replayBtn = page.locator('button[aria-label*="Rever cena actual"]');
    await replayBtn.click();

    // Still running without crash
    await expect(page.locator('.shot-badge')).toContainText('S01');
  });
});
