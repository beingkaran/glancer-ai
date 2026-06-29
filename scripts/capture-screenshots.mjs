/**
 * Capture page screenshots for the maintenance guide.
 * Run: node scripts/capture-screenshots.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '../docs/guide-assets/screenshots');
const BASE = process.argv[2] || 'http://localhost:5184';

const PAGES = [
  { name: '01-home', path: '/', wait: 2500 },
  { name: '02-home-blogs-tab', path: '/#blogs', wait: 1500 },
  { name: '03-blogs', path: '/blogs', wait: 2000 },
  { name: '04-ai-tools', path: '/ai-tools', wait: 2000 },
  { name: '05-metrics', path: '/metrics', wait: 2000 },
  { name: '06-glossary', path: '/glossary', wait: 2000 },
  { name: '07-about', path: '/about', wait: 1500 },
  { name: '08-faq', path: '/faq', wait: 1500 },
  { name: '09-profile-signin', path: '/profile', wait: 1500 },
  { name: '10-blog-write', path: '/blog/write', wait: 1500 },
  { name: '11-admin', path: '/_glancer/admin', wait: 1500 },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: 'dark',
  });
  const page = await ctx.newPage();

  for (const { name, path: p, wait } of PAGES) {
    const url = `${BASE}${p}`;
    console.log(`Capturing ${name} → ${url}`);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(wait);
      await page.screenshot({
        path: path.join(OUT, `${name}.png`),
        fullPage: false,
      });
    } catch (e) {
      console.warn(`  ⚠ Failed ${name}: ${e.message}`);
    }
  }

  // Full-page home screenshot
  try {
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(OUT, '00-home-full.png'),
      fullPage: true,
    });
  } catch (e) {
    console.warn(`  ⚠ Failed full home: ${e.message}`);
  }

  await browser.close();
  console.log(`Done — screenshots saved to ${OUT}`);
}

main().catch((e) => { console.error(e); process.exit(1); });