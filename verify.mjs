import { chromium } from 'playwright-core';
import os from 'node:os';
import path from 'node:path';

const exec = path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell');
const browser = await chromium.launch({ executablePath: exec, headless: true });
const routes = ['/', '/orders', '/customers', '/quotations', '/invoices', '/inventory', '/financials', '/reports', '/support', '/settings', '/login'];
const errors = [];

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));

for (const r of routes) {
  await page.goto('http://localhost:3000' + r, { waitUntil: 'networkidle' });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(r, 'overflow', overflow);
}

// Command palette
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.keyboard.press('Meta+k');
await page.waitForTimeout(300);
const paletteOpen = await page.locator('[cmdk-root]').count();
console.log('palette open', paletteOpen);
await page.keyboard.type('financial');
await page.waitForTimeout(200);
const paletteResults = await page.locator('[cmdk-item]').count();
console.log('palette results', paletteResults);
await page.keyboard.press('Enter');
await page.waitForTimeout(400);
console.log('palette navigated to', new URL(page.url()).pathname);

// Invoice preview
await page.goto('http://localhost:3000/invoices', { waitUntil: 'networkidle' });
await page.locator('tbody tr').first().click();
await page.waitForTimeout(300);
const dialogVisible = await page.locator('[role=dialog]').count();
const invoiceNumber = await page.locator('[role=dialog]').innerText().catch(() => '');
console.log('invoice dialog', dialogVisible, invoiceNumber.slice(0, 40).replace(/\n/g, ' | '));
await page.keyboard.press('Escape');
await page.waitForTimeout(200);

// Orders segmented filter
await page.goto('http://localhost:3000/orders', { waitUntil: 'networkidle' });
const before = await page.locator('tbody tr').count();
await page.getByRole('radio', { name: 'Delivered' }).click().catch(async () => {
  await page.locator('button', { hasText: 'Delivered' }).first().click();
});
await page.waitForTimeout(400);
const after = await page.locator('tbody tr').count();
console.log('orders rows before/after filter', before, after);

// Customers segmented filter
await page.goto('http://localhost:3000/customers', { waitUntil: 'networkidle' });
const cBefore = await page.locator('main h3').count();
await page.getByRole('radio', { name: 'Inactive' }).click().catch(async () => {
  await page.locator('button', { hasText: 'Inactive' }).first().click();
});
await page.waitForTimeout(400);
const cAfter = await page.locator('main h3').count();
console.log('customers cards before/after filter', cBefore, cAfter);

// Settings switches
await page.goto('http://localhost:3000/settings', { waitUntil: 'networkidle' });
const switches = await page.locator('button[role=switch]').count();
console.log('settings switches', switches);
if (switches) {
  const first = page.locator('button[role=switch]').first();
  const state1 = await first.getAttribute('aria-checked');
  await first.click();
  await page.waitForTimeout(200);
  const state2 = await first.getAttribute('aria-checked');
  console.log('switch toggled', state1, '->', state2);
}

// Dark mode
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
const themeBtn = page.locator('button[aria-label*="theme" i], button[aria-label*="dark" i], button[aria-label*="light" i]').first();
if (await themeBtn.count()) {
  await themeBtn.click();
  await page.waitForTimeout(400);
}
const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark') || document.documentElement.dataset.theme === 'dark');
console.log('dark mode active', isDark);

// Mobile overflow
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
for (const r of ['/', '/orders', '/customers', '/invoices', '/financials', '/settings']) {
  await mobile.goto('http://localhost:3000' + r, { waitUntil: 'networkidle' });
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('mobile', r, 'overflow', overflow);
}

console.log('CONSOLE ERRORS:', errors.length);
for (const e of errors.slice(0, 20)) console.log(' -', e);

await browser.close();
