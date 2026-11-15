import { chromium } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  const outputDir = path.resolve(process.cwd(), 'prototipo/docs/screenshots');
  const artifactDir = '/Users/gerzymanuel/.gemini/antigravity/brain/ef0babde-497f-43fb-9011-459b7b47479c/screenshots';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  // 1. Desktop Screenshot (Earth Base S01)
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://127.0.0.1:4173/');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outputDir, '01_desktop_earth_base.png') });
  console.log('Captured 01_desktop_earth_base.png');

  // Start playback
  const playBtn = page.locator('.primary-touch-btn');
  await playBtn.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(outputDir, '02_desktop_playing.png') });
  console.log('Captured 02_desktop_playing.png');

  // 2. Mobile Viewport (iPhone 14: 390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://127.0.0.1:4173/');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: path.join(outputDir, '03_mobile_home.png') });
  console.log('Captured 03_mobile_home.png');

  // Start on mobile and skip to S05 (Vestígio A)
  const mobilePlayBtn = mobilePage.locator('.primary-touch-btn');
  await mobilePlayBtn.click();
  const skipBtn = mobilePage.locator('button[aria-label*="Saltar"]');
  // S01 -> S02 -> S03 -> S04 -> S05
  await skipBtn.click(); // S02
  await mobilePage.waitForTimeout(300);
  await skipBtn.click(); // S03
  await mobilePage.waitForTimeout(300);
  await skipBtn.click(); // S04
  await mobilePage.waitForTimeout(300);
  await skipBtn.click(); // S05
  await mobilePage.waitForTimeout(800);

  // Trigger S05 interaction by advancing time to S05 end
  await mobilePage.evaluate(() => {
    const playBtn = document.querySelector('.primary-touch-btn');
    if (playBtn) playBtn.click();
  });
  await mobilePage.waitForTimeout(1200);

  // Take screenshot of Mobile Clue Analysis Card
  await mobilePage.screenshot({ path: path.join(outputDir, '04_mobile_clue_analysis.png') });
  console.log('Captured 04_mobile_clue_analysis.png');

  // Test Sources Drawer on mobile
  const sourcesBtn = mobilePage.locator('button[aria-label*="fontes"]');
  await sourcesBtn.click();
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: path.join(outputDir, '05_mobile_sources.png') });
  console.log('Captured 05_mobile_sources.png');

  await browser.close();

  // Copy all files to artifact dir
  const files = fs.readdirSync(outputDir);
  for (const f of files) {
    fs.copyFileSync(path.join(outputDir, f), path.join(artifactDir, f));
  }

  console.log('Console errors encountered:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Errors:', consoleErrors);
  }
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});
