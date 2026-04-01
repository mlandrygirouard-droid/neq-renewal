import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.join(__dirname, '..', 'static');
const htmlPath = path.join(staticDir, 'og-image.html');
const outPath = path.join(staticDir, 'og-image.png');

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
await page.screenshot({ path: outPath, type: 'png' });
await browser.close();
console.log('OG image generated: static/og-image.png');
