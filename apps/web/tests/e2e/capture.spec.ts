import { test } from '@playwright/test';
import path from 'path';

test('capture updated cinematic visual evidence for pilot report', async ({ page }) => {
  const evidenceDir = path.resolve(process.cwd(), '../../docs/evidencias');

  await page.goto('/');
  await page.waitForTimeout(800);

  // 1. Screenshot of Prologue Cinema Scene (Bedroom & Stars)
  await page.screenshot({ path: path.join(evidenceDir, '01_prologue_cinema.png') });

  // Dismiss intro dialogue if present
  const dialoguePanel = page.locator('#dialogue-panel');
  if (await dialoguePanel.isVisible()) {
    const nextBtn = page.locator('#btn-dialogue-next');
    while (await dialoguePanel.isVisible()) {
      await nextBtn.click();
      await page.waitForTimeout(100);
    }
  }

  // 2. Screenshot of Act 1: Exploration
  const act1Btn = page.locator('.step-btn[data-act-idx="1"]');
  await act1Btn.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(evidenceDir, '02_exploration_act1.png') });

  // 3. Screenshot of Act 2: Macro Scanner
  const act2Btn = page.locator('.step-btn[data-act-idx="2"]');
  await act2Btn.click();
  await page.waitForTimeout(400);

  // Trigger scan
  const triggerScanBtn = page.locator('#btn-trigger-scan');
  await triggerScanBtn.click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(evidenceDir, '03_macro_scanner_act2.png') });

  // 4. Screenshot of Act 3: Golden Memory / Video Presentation
  const act3Btn = page.locator('.step-btn[data-act-idx="3"]');
  await act3Btn.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(evidenceDir, '04_golden_memory_act3.png') });

  // 5. Screenshot of Act 4: Dust Storm
  const act4Btn = page.locator('.step-btn[data-act-idx="4"]');
  await act4Btn.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(evidenceDir, '05_dust_storm_act4.png') });

  // 6. Screenshot of Puzzle Screen
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent('test-open-puzzle'));
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(evidenceDir, '06_puzzle_screen.png') });

  // 7. Screenshot of Journal & Official NASA Sources
  const correctOpt = page.locator('[data-option-id="opt_evidence"]');
  await correctOpt.click();
  await page.waitForTimeout(300);
  const continueBtn = page.locator('#btn-puzzle-continue');
  await continueBtn.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(evidenceDir, '07_epilogue_sources.png') });
});
