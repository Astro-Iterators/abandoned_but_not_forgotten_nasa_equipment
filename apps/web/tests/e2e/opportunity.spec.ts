import { test, expect } from '@playwright/test';

test.describe('Opportunity Pilot Episode Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure fresh session
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('loads game, renders canvas and displays HUD', async ({ page }) => {
    await expect(page).toHaveTitle(/Ainda Estou Aqui/);
    const canvas = page.locator('#game-container canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    const hudTitle = page.locator('.hud-title');
    await expect(hudTitle).toContainText('Opportunity');

    const soundBtn = page.locator('#hud-btn-sound');
    await expect(soundBtn).toBeVisible();
  });

  test('intro dialogue welcomes the player and explains the memory archive', async ({ page }) => {
    // Jump to Act 1 to trigger exploration intro dialogue
    const act1Btn = page.locator('.step-btn[data-act-idx="1"]');
    await act1Btn.click();

    const dialoguePanel = page.locator('#dialogue-panel');
    await expect(dialoguePanel).toBeVisible({ timeout: 8000 });

    const dialogueText = page.locator('#dialogue-text');
    await expect(dialogueText).toContainText('arquivo');

    // Advance dialogue
    const nextBtn = page.locator('#btn-dialogue-next');
    while (await dialoguePanel.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(200);
    }

    await expect(dialoguePanel).toBeHidden();
  });

  test('toggles audio mute safely', async ({ page }) => {
    const soundBtn = page.locator('#hud-btn-sound');
    await expect(soundBtn).toContainText('Som');

    await soundBtn.click();
    await expect(soundBtn).toContainText('Mudo');

    await soundBtn.click();
    await expect(soundBtn).toContainText('Som');
  });

  test('journal displays verified facts and official NASA sources', async ({ page }) => {
    // Dismiss intro if open
    const dialoguePanel = page.locator('#dialogue-panel');
    if (await dialoguePanel.isVisible()) {
      const nextBtn = page.locator('#btn-dialogue-next');
      while (await dialoguePanel.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(150);
      }
    }

    const journalBtn = page.locator('#hud-btn-journal');
    await journalBtn.click();

    const journalPanel = page.locator('#journal-panel');
    await expect(journalPanel).toBeVisible();

    // Check stats and facts
    await expect(journalPanel).toContainText('45,16 km');
    await expect(journalPanel).toContainText('5.111 Sóis');
    await expect(journalPanel).toContainText('Esférulas de hematite');
    await expect(journalPanel).toContainText('Perseverance Valley');

    // Check NASA sources links
    const sourceLinks = journalPanel.locator('.source-link');
    expect(await sourceLinks.count()).toBeGreaterThanOrEqual(3);

    // Close journal
    const closeBtn = page.locator('#btn-journal-close');
    await closeBtn.click();
    await expect(journalPanel).toBeHidden();
  });

  test('puzzle provides constructive feedback on error and completes on scientific evidence', async ({ page }) => {
    // Dismiss intro if open
    const dialoguePanel = page.locator('#dialogue-panel');
    if (await dialoguePanel.isVisible()) {
      const nextBtn = page.locator('#btn-dialogue-next');
      while (await dialoguePanel.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(150);
      }
    }

    // Trigger puzzle
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('test-open-puzzle'));
    });

    const puzzlePanel = page.locator('#puzzle-panel');
    await expect(puzzlePanel).toBeVisible();

    // 1. Choose wrong option (fish/plants claim)
    const wrongOptBtn = puzzlePanel.locator('[data-option-id="opt_life_fish"]');
    await wrongOptBtn.click();

    // Assert constructive error feedback and hint appear
    const feedbackError = puzzlePanel.locator('.feedback-error');
    await expect(feedbackError).toBeVisible();
    await expect(feedbackError).toContainText('Análise Incompleta');
    await expect(feedbackError).toContainText('Pista de Bip');

    // 2. Choose correct scientific evidence option (hematite blueberries)
    const correctOptBtn = puzzlePanel.locator('[data-option-id="opt_evidence"]');
    await correctOptBtn.click();

    // Assert success feedback appear
    const feedbackSuccess = puzzlePanel.locator('.feedback-success');
    await expect(feedbackSuccess).toBeVisible();
    await expect(feedbackSuccess).toContainText('Evidência Científica Confirmada');

    // 3. Continue to Journal
    const continueBtn = puzzlePanel.locator('#btn-puzzle-continue');
    await continueBtn.click();

    const journalPanel = page.locator('#journal-panel');
    await expect(journalPanel).toBeVisible();
    await expect(journalPanel).toContainText('Ficha Científica Oficial');
  });
});
