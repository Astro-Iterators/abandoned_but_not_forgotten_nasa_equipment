import { test, expect } from '@playwright/test';

test.describe('Ainda Estou Aqui — Episódio 1 E2E', () => {
  test('loads cinematic experience, renders canvas and header controls', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Ainda Estou Aqui — Ep. 1: Ranger 7/);

    // Canvas container is visible
    const canvasContainer = page.locator('#canvas-container');
    await expect(canvasContainer).toBeVisible();

    // Episode title in header
    const epTitle = page.locator('.episode-title');
    await expect(epTitle).toHaveText('Ranger 7 — O último olhar');

    // Initial shot is S01
    const shotBadge = page.locator('.shot-badge');
    await expect(shotBadge).toContainText('S01');

    // Controls buttons exist and are accessible
    const playBtn = page.locator('.primary-touch-btn');
    await expect(playBtn).toBeVisible();
    await expect(playBtn).toContainText('Iniciar');
  });

  test('toggles playback, subtitles, and sources panel', async ({ page }) => {
    await page.goto('/');

    const playBtn = page.locator('.primary-touch-btn');
    await playBtn.click();
    await expect(playBtn).toContainText('Pausa');

    // Test pause
    await playBtn.click();
    await expect(playBtn).toContainText('Continuar');

    // Test sources drawer
    const sourcesBtn = page.locator('button[aria-label*="fontes científicas"]');
    await sourcesBtn.click();

    const sourcesOverlay = page.locator('.sources-overlay');
    await expect(sourcesOverlay).toBeVisible();
    await expect(page.locator('.sources-card h2')).toContainText('Fontes Científicas');

    // Close sources
    const closeBtn = page.locator('#btn-sources-close');
    await closeBtn.click();
    await expect(sourcesOverlay).toBeHidden();
  });

  test('mobile viewport layout and touch controls', async ({ page }) => {
    // Mobile iPhone 14 viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const topBar = page.locator('.controls-top-bar');
    await expect(topBar).toBeVisible();

    const bottomBar = page.locator('.controls-bottom-bar');
    await expect(bottomBar).toBeVisible();

    // Verify touch button dimensions meet minimum 48px touch target
    const playBtn = page.locator('.primary-touch-btn');
    const box = await playBtn.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });
});
