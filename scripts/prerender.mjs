/**
 * Build-time prerender: inject server-rendered HTML into dist/index.html
 * so crawlers (e.g. Google) receive full content for the home page.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { applySsrTemplate } from './applySsrTemplate.mjs';

const distDir = path.join(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'index.html');
const serverPath = path.join(distDir, 'entry-server.js');

try {
  const template = fs.readFileSync(indexPath, 'utf-8');
  const { render } = await import(pathToFileURL(serverPath).href);
  const result = await render('/');
  const html = applySsrTemplate(template, result);
  fs.writeFileSync(indexPath, html);
  console.log('Prerender: injected SSR HTML into dist/index.html');
} catch (err) {
  console.error('Prerender failed (site will still work; crawlers may see less content):', err.message);
  process.exit(1);
}
