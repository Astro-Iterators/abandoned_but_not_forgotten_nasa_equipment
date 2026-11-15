import { test, expect } from '@playwright/test';

test.describe('Cinematic Storytelling & Acts Navigation (Inspired by A Solar Tale & Henrys Farm)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('displays timeline stepper and allows chapter jumping', async ({ page }) => {
    // Dismiss intro dialogue if open
    const dialoguePanel = page.locator('#dialogue-panel');
    if (await dialoguePanel.isVisible()) {
      const nextBtn = page.locator('#btn-dialogue-next');
      while (await dialoguePanel.isVisible()) {
        await nextBtn.click();
        await page.waitForTimeout(100);
      }
    }

    const timeline = page.locator('.cinema-timeline');
    await expect(timeline).toBeVisible();
    await expect(timeline).toContainText('Capítulo 1 de 6');

    // Click on step 2 (Ato II: A Rocha)
    const act2Btn = page.locator('.step-btn[data-act-idx="2"]');
    await act2Btn.click();

    // Verify Macro Scanner is visible
    const scannerCard = page.locator('.macro-scanner-card');
    await expect(scannerCard).toBeVisible();
    await expect(scannerCard).toContainText('Leitura Espectroscópica da Rocha');

    // Click on Trigger Scan button
    const triggerScanBtn = page.locator('#btn-trigger-scan');
    await triggerScanBtn.click();

    // Verify mineral readout is displayed
    const readout = page.locator('#scanner-readout');
    await expect(readout).toBeVisible();
    await expect(readout).toContainText('Hematite');
    await expect(readout).toContainText('água líquida');

    // Continue to next chapter
    const scanContinueBtn = page.locator('#btn-scan-continue');
    await scanContinueBtn.click();

    // Verify Chapter 4 (Ato IV: A Tempestade)
    const act4Btn = page.locator('.step-btn[data-act-idx="4"]');
    await act4Btn.click();

    const stormStage = page.locator('.cinema-stage');
    await expect(stormStage).toContainText('tempestade');
  });
});
