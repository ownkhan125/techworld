const { chromium } = require('playwright');
const BASE = 'http://localhost:3003';

const AWAY_PAGES = ['Platform', 'Projects', 'Customers', 'Developers', 'Contact'];

async function slowScroll(page, step = 220, waitPer = 70) {
  const h = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(waitPer);
  }
  await page.waitForTimeout(400);
}

async function auditHome(page) {
  return page.evaluate(() => {
    const inViewport = (r) => r.bottom > 0 && r.top < window.innerHeight;
    const out = {
      headings: [],
      strReveal: [],
      devFig: [],
      extCard: [],
      liveCard: [],
    };
    document.querySelectorAll('h1, h2').forEach((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const inners = el.querySelectorAll('.split-inner');
      let maskedInners = 0;
      inners.forEach((inner) => {
        const ics = getComputedStyle(inner);
        const tf = ics.transform;
        let ty = 0;
        if (tf && tf.startsWith('matrix(')) {
          const parts = tf.slice(7, -1).split(',').map(parseFloat);
          ty = parts[5] || 0;
        }
        const parentRect = inner.parentElement.getBoundingClientRect();
        if (ty > parentRect.height * 0.6) maskedInners++;
      });
      out.headings.push({
        text: (el.textContent || '').trim().slice(0, 40),
        opacity: parseFloat(cs.opacity),
        inners: inners.length,
        maskedInners,
        top: Math.round(r.top),
        inViewport: inViewport(r),
      });
    });
    document.querySelectorAll('.dev-fig').forEach((el) => {
      const cs = getComputedStyle(el);
      out.devFig.push({ opacity: parseFloat(cs.opacity), built: el.classList.contains('card-built') });
    });
    document.querySelectorAll('.ext-card').forEach((el) => {
      const cs = getComputedStyle(el);
      out.extCard.push({ opacity: parseFloat(cs.opacity), built: el.classList.contains('card-built') });
    });
    document.querySelectorAll('.live-card').forEach((el) => {
      const cs = getComputedStyle(el);
      out.liveCard.push({ opacity: parseFloat(cs.opacity) });
    });
    return out;
  });
}

async function reportHome(page, label) {
  const a = await auditHome(page);
  // Only flag broken if the element is CURRENTLY in the viewport and
  // visibly wrong. Below-fold headings sitting at fromVars (hidden) is
  // the intended state — they'll play in when the user scrolls to them.
  const brokenHeadings = a.headings.filter(
    (h) => h.inViewport && (h.maskedInners > 0 || h.opacity < 0.5)
  );
  // Same filter for dev-fig — off-screen cards may be intentionally hidden.
  // But since the test scrolls past every card at some point, we do want
  // to know if any dev-fig is left permanently hidden. We use `built` as
  // the final marker (revealRow sets .card-built on completion). A dev-fig
  // that was ever in viewport should be .card-built by the end of the run.
  const stuckDev = a.devFig.filter((c) => c.opacity < 0.5 && !c.built).length;
  const ok = brokenHeadings.length === 0 && stuckDev === 0;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${label}: heads(inView=${a.headings.filter(h => h.inViewport).length}/broken=${brokenHeadings.length}) devFig(${a.devFig.length}/stuck=${stuckDev}/built=${a.devFig.filter(c => c.built).length})`);
  if (brokenHeadings.length) {
    brokenHeadings.forEach((h) => console.log(`    ! heading in view "${h.text}" op=${h.opacity} masked=${h.maskedInners}/${h.inners}`));
  }
  return ok;
}

async function checkHeroTop(page, label) {
  // At scrollY=0 the only requirement is: the Hero heading is fully
  // readable, no words masked. Below-fold sections are supposed to be
  // hidden — that's how they animate in when the user scrolls.
  const state = await page.evaluate(() => {
    const hero = document.querySelector('h1, header h2');
    if (!hero) return { present: false };
    const cs = getComputedStyle(hero);
    const inners = hero.querySelectorAll('.split-inner');
    let masked = 0;
    inners.forEach((i) => {
      const ics = getComputedStyle(i);
      const tf = ics.transform;
      let ty = 0;
      if (tf && tf.startsWith('matrix(')) {
        const parts = tf.slice(7, -1).split(',').map(parseFloat);
        ty = parts[5] || 0;
      }
      const pr = i.parentElement.getBoundingClientRect();
      if (ty > pr.height * 0.6) masked++;
    });
    return {
      present: true,
      text: (hero.textContent || '').slice(0, 40),
      opacity: parseFloat(cs.opacity),
      inners: inners.length,
      masked,
    };
  });
  const ok = state.present && state.opacity >= 0.9 && state.masked === 0;
  console.log(`  ${ok ? 'OK  ' : 'FAIL'} ${label}: hero="${state.text}" op=${state.opacity} masked=${state.masked}/${state.inners}`);
  return ok;
}

async function cycle(page, cycleN) {
  console.log(`\n─── Cycle ${cycleN}: Home → away → return → walk Home ───`);
  if (cycleN === 1) {
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
  }

  for (const dest of AWAY_PAGES) {
    await page.locator(`nav a:has-text("${dest}")`).first().click();
    await page.waitForURL(`**/${dest.toLowerCase()}`);
    await page.waitForTimeout(600);
  }

  await page.locator('a[aria-label="Techworld home"]').first().click({ force: true });
  await page.waitForURL(`${BASE}/`);
  await page.waitForTimeout(900);

  await page.screenshot({ path: `C:/Users/General/AppData/Local/Temp/homecycle-${cycleN}-top.png` });
  const okHero = await checkHeroTop(page, `Home hero @ top (cycle ${cycleN})`);

  await slowScroll(page);
  await page.screenshot({ path: `C:/Users/General/AppData/Local/Temp/homecycle-${cycleN}-bottom.png` });

  await page.evaluate(() => {
    const el = document.querySelector('.dev-grid');
    if (el) el.scrollIntoView({ behavior: 'auto', block: 'center' });
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `C:/Users/General/AppData/Local/Temp/homecycle-${cycleN}-dev.png` });
  const okDev = await reportHome(page, `Home dev-section after scroll (cycle ${cycleN})`);

  return okHero && okDev;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const pageErrs = [];
  page.on('pageerror', (e) => pageErrs.push(e.message));

  const results = [];
  for (let i = 1; i <= 3; i++) {
    const ok = await cycle(page, i);
    results.push({ cycle: i, ok });
  }

  console.log('\n=== 3-CYCLE SUMMARY ===');
  results.forEach((r) => console.log(`  Cycle ${r.cycle}: ${r.ok ? 'OK' : 'FAIL'}`));
  console.log(`\nTotal pageerrors: ${pageErrs.length}`);
  pageErrs.slice(0, 5).forEach((e) => console.log('    !', e));

  // Responsive check — quick nav+return per viewport
  console.log('\n=== RESPONSIVE ===');
  for (const vp of [
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    const ctx2 = await browser.newContext({ viewport: vp });
    const p2 = await ctx2.newPage();
    await p2.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await p2.waitForTimeout(800);
    await p2.goto(`${BASE}/platform`, { waitUntil: 'networkidle' });
    await p2.waitForTimeout(600);
    await p2.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await p2.waitForTimeout(900);
    await slowScroll(p2, 200, 60);
    const a = await p2.evaluate(() => {
      const dev = [...document.querySelectorAll('.dev-fig')];
      const hidden = dev.filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.5).length;
      return { devTotal: dev.length, devHidden: hidden };
    });
    console.log(`  ${vp.name} ${vp.width}x${vp.height}: dev-figs ${a.devTotal - a.devHidden}/${a.devTotal} visible`);
    await p2.screenshot({ path: `C:/Users/General/AppData/Local/Temp/homecycle-${vp.name}.png` });
    await ctx2.close();
  }

  await browser.close();
})();
