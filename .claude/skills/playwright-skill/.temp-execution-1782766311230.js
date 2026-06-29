const { chromium } = require('playwright');
const fs = require('fs');
const OUT = process.env.TEMP.replace(/\\/g, '/');
const URL = 'http://localhost:3001';
const viewports = [
  { name: 'desk-1440', w: 1440, h: 900 },
  { name: 'tab-1024', w: 1024, h: 768 },
  { name: 'mob-390', w: 390, h: 844 },
];

(async () => {
  const browser = await chromium.launch({ headless: false });
  const results = {};
  for (const vp of viewports) {
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
    page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message.slice(0, 200)));

    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2200);

    // Discover section anchors
    const sectionInfo = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('[data-cinematic], footer'));
      return els.map((el) => ({
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        top: el.offsetTop,
        h: el.offsetHeight,
      }));
    });

    // Fire 4 sequential wheel-down events from top — each should advance one section
    await page.evaluate(() => window.scrollTo({ top: 0 }));
    await page.waitForTimeout(500);
    const trail = [];
    for (let i = 0; i < 4; i++) {
      const before = await page.evaluate(() => window.scrollY);
      // simulate single sharp wheel gesture
      await page.mouse.move(vp.w / 2, vp.h / 2).catch(() => {});
      await page.mouse.wheel(0, 200);
      // wait for smooth scroll to settle + lockout
      await page.waitForTimeout(900);
      const after = await page.evaluate(() => window.scrollY);
      trail.push({ step: i, before, after, delta: after - before });
    }

    // wheel up — back through sections
    const upTrail = [];
    for (let i = 0; i < 3; i++) {
      const before = await page.evaluate(() => window.scrollY);
      await page.mouse.wheel(0, -200);
      await page.waitForTimeout(900);
      const after = await page.evaluate(() => window.scrollY);
      upTrail.push({ step: i, before, after, delta: after - before });
    }

    // Verify a tall section allows internal scroll — scroll to Developer section first
    await page.evaluate(() => {
      const dev = document.querySelector('.dev-grid');
      if (dev) {
        const sec = dev.closest('[data-cinematic]');
        if (sec) window.scrollTo({ top: sec.offsetTop - 80, behavior: 'auto' });
      }
    });
    await page.waitForTimeout(500);
    const insideTallBefore = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(300);
    const insideTallAfter = await page.evaluate(() => window.scrollY);

    const overflow = await page.evaluate(() => {
      const docw = document.documentElement.scrollWidth;
      const winw = window.innerWidth;
      return { docw, winw, overflow: docw > winw + 1 };
    });

    results[vp.name] = {
      vp,
      sectionCount: sectionInfo.length,
      sectionInfo: sectionInfo.map((s) => ({ id: s.id, top: s.top, h: s.h })),
      downTrail: trail,
      upTrail,
      tallSectionInternalScroll: {
        before: insideTallBefore,
        after: insideTallAfter,
        delta: insideTallAfter - insideTallBefore,
        // delta should be ~300 (native scroll inside tall section) not snapped
      },
      overflow,
      errors,
    };
    await ctx.close();
  }
  fs.writeFileSync(OUT + '/snap-qa-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
