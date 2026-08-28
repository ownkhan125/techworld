const { chromium } = require('playwright');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3001';

const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1024',  width: 1024, height: 720 },
  { name: 'tablet-820',   width: 820,  height: 1180 },
  { name: 'mobile-390',   width: 390,  height: 844 },
];

(async () => {
  const browser = await chromium.launch({ headless: false });

  for (const vp of VIEWPORTS) {
    console.log('\n=== ' + vp.name + ' ===');
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto(TARGET_URL, { waitUntil: 'load' });
    await page.waitForTimeout(1400);

    // Measure heights of sections + gaps
    const measurements = await page.evaluate(() => {
      const list = Array.from(document.querySelectorAll('[data-cinematic], section, footer'));
      return list.map((el) => ({
        tag: el.tagName,
        id: el.id || null,
        cls: el.className.slice(0, 60),
        top: el.offsetTop,
        h: el.offsetHeight,
        padTop: parseFloat(getComputedStyle(el).paddingTop),
        padBot: parseFloat(getComputedStyle(el).paddingBottom),
      }));
    });
    console.log(JSON.stringify(measurements, null, 2));

    // Look for overflow issues
    const overflow = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;
      const overflowing = [];
      document.querySelectorAll('*').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > docW + 1 && r.width > 0 && r.width < docW * 3) {
          overflowing.push({
            tag: el.tagName,
            cls: (el.className || '').toString().slice(0, 80),
            right: Math.round(r.right),
            width: Math.round(r.width),
          });
        }
      });
      return overflowing.slice(0, 15);
    });
    console.log('  overflow:', overflow.length ? overflow : 'none');

    // Screenshot full page
    await page.screenshot({ path: `C:/tmp/audit-${vp.name}.png`, fullPage: true });
    await context.close();
  }

  await browser.close();
  console.log('\n✅ Audit complete.');
})().catch((e) => { console.error(e); process.exit(1); });
