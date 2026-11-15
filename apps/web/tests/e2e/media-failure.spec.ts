import { test, expect } from '@playwright/test';

test.describe('Cinematic & Media Failure Resiliency', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('video modal displays fallback storyboard when triggered', async ({ page }) => {
    // Dismiss intro if open
    const dialoguePanel = page.locator('#dialogue-panel');
    if (await dialoguePanel.isVisible()) {
      const nextBtn = page.locator('#btn-dialogue-next');
      while (await dialoguePanel.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(150);
      }
    }

    // Open video modal through replay in journal
    const journalBtn = page.locator('#hud-btn-journal');
    await journalBtn.click();

    const replayVideoBtn = page.locator('#btn-journal-replay-video');
    await replayVideoBtn.click();

    const videoModal = page.locator('#video-modal');
    await expect(videoModal).toBeVisible();

    // Toggle fallback storyboard
    const fallbackToggleBtn = page.locator('#btn-video-fallback');
    await fallbackToggleBtn.click();

    const fallbackBox = page.locator('#video-fallback-box');
    await expect(fallbackBox).toBeVisible();
    await expect(fallbackBox).toContainText('Modo Storyboard');
    await expect(fallbackBox).toContainText('Pouso suave do Opportunity');

    // Skip to puzzle
    const skipBtn = page.locator('#btn-video-skip');
    await skipBtn.click();

    // Video modal should close and puzzle should open
    await expect(videoModal).toBeHidden();
    const puzzlePanel = page.locator('#puzzle-panel');
    await expect(puzzlePanel).toBeVisible();
  });
});
