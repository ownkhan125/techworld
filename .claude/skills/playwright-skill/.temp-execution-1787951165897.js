const { chromium } = require('playwright');
const fs = require('fs');

const TARGET_URL = 'http://localhost:3001/';
const OUT_DIR = 'C:/Users/General/Documents/GitHub/techworld/.tmp-verify';
const VIEWPORTS = [
  { name: 'm320', width: 320, height: 640 },
  { name: 'm375', width: 375, height: 720 },
  { name: 't768', width: 768, height: 1024 },
  { name: 'd1440', width: 1440, height: 900 },
];

// section id → also fall back to text query
const NAMED = [
  { id: '#features', label: 'features' },
  { id: '#customers', label: 'customers' },
];

(async () => {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const errors = [];

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`[${vp.name}] ${e.message}`));

    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const total = await page.evaluate(() => document.body.scrollHeight);
    const step = Math.floor(vp.height * 0.6);
    for (let y = 0; y < total; y += step) {
      await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
      await page.waitForTimeout(140);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(500);

    const overflow = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    console.log(`[${vp.name}] overflow=${overflow.sw > overflow.cw} (${overflow.sw}/${overflow.cw})`);

    for (const n of NAMED) {
      const el = await page.$(n.id);
      if (!el) { console.log(`  ${n.id} — not found`); continue; }
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1400);
      await page.screenshot({ path: `${OUT_DIR}/${vp.name}-${n.label}.png`, fullPage: false });
    }

    // measure whether the feature tab pill container needs scrolling
    const pillOverflow = await page.evaluate(() => {
      const featEl = document.querySelector('#features');
      if (!featEl) return null;
      const pill = featEl.querySelector('[data-stage="frame"] > div');
      if (!pill) return null;
      return { scrollWidth: pill.scrollWidth, clientWidth: pill.clientWidth };
    });
    if (pillOverflow) {
      console.log(`   FeaturesTabs pill scroll: ${pillOverflow.scrollWidth}/${pillOverflow.clientWidth} — scrollable=${pillOverflow.scrollWidth > pillOverflow.clientWidth}`);
    }

    await ctx.close();
  }
  await browser.close();

  console.log('\n=== ERRORS ===');
  if (errors.length === 0) console.log('None');
  else errors.forEach((e) => console.log(e));
  console.log('Done.');
})();
