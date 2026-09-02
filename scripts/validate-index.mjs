import { access, readFile } from 'node:fs/promises';
import { dirname, posix } from 'node:path';

const failures = [];
const references = JSON.parse(await readFile('content/references.json', 'utf8'));
const generatedPages = references.map(({ slug }) => `${slug}/index.html`);
const requiredFiles = [
  'index.html', 'favicon.svg', 'site.webmanifest', 'robots.txt', 'sitemap.xml',
  'assets/social-preview.svg', 'assets/social-preview.png', 'styles/reference.css',
  'content/references.json', 'content/reference-schema.json', 'README.md',
  'CONTRIBUTING.md', 'SECURITY.md', 'LICENSE', '.github/workflows/validate.yml',
  ...generatedPages
];

const exists = async file => {
  try { await access(file); return true; } catch { return false; }
};

for (const file of requiredFiles) if (!(await exists(file))) failures.push(`Missing required file: ${file}`);

const index = await readFile('index.html', 'utf8');
const requiredIndexSnippets = [
  '<link rel="manifest" href="/site.webmanifest">',
  '<link rel="canonical" href="https://frontendindex.com/">',
  '<meta property="og:url" content="https://frontendindex.com/" />',
  '<meta property="og:image" content="https://frontendindex.com/assets/social-preview.png" />',
  '<meta name="twitter:image" content="https://frontendindex.com/assets/social-preview.png" />',
  '"@type": "WebSite"',
  "De'Andre Perry",
  'https://github.com/deandreperry/frontend-index'
];
for (const snippet of requiredIndexSnippets) if (!index.includes(snippet)) failures.push(`index.html is missing: ${snippet}`);

const requiredSectionIds = ['security', 'accessibility', 'testing', 'data', 'state', 'design-systems', 'forms', 'seo', 'deployment', 'monitoring', 'i18n'];
for (const id of requiredSectionIds) {
  if (!index.includes(`<section id="${id}"`)) failures.push(`index.html is missing section: ${id}`);
  if (!index.includes(`data-domain="${id}"`)) failures.push(`index.html is missing domain board: ${id}`);
}

const productionFiles = ['index.html', 'package.json', 'README.md', 'robots.txt', 'sitemap.xml', 'site.webmanifest', ...generatedPages];
for (const file of productionFiles) {
  if (!(await exists(file))) continue;
  const source = await readFile(file, 'utf8');
  if (source.includes('https://deandreperry.github.io/frontend-index')) failures.push(`${file} contains the retired GitHub Pages production URL.`);
  const withoutRepositoryLinks = source.replaceAll('https://github.com/deandreperry/frontend-index/', 'https://github.com/repository/');
  if (withoutRepositoryLinks.includes('/frontend-index/')) failures.push(`${file} contains a retired production subdirectory path.`);
}

const manifest = JSON.parse(await readFile('site.webmanifest', 'utf8'));
if (manifest.id !== '/' || manifest.start_url !== '/' || manifest.scope !== '/') failures.push('Manifest id, start_url, and scope must be root-relative /.');
if (!manifest.icons?.some(icon => icon.src === '/favicon.svg' && icon.type === 'image/svg+xml')) failures.push('Manifest must include the root favicon SVG.');

const pkg = JSON.parse(await readFile('package.json', 'utf8'));
if (pkg.homepage !== 'https://frontendindex.com/') failures.push('package.json homepage must use the custom domain.');
if (pkg.version !== '3.0.0') failures.push('package.json version must match Frontend Index v3.0.');
for (const script of ['check', 'generate', 'generate:check']) if (!pkg.scripts?.[script]) failures.push(`package.json is missing the ${script} script.`);

const robots = await readFile('robots.txt', 'utf8');
if (!/^User-agent:\s*\*/m.test(robots) || !/^Allow:\s*\/$/m.test(robots)) failures.push('robots.txt must allow public crawling.');
if (!robots.includes('Sitemap: https://frontendindex.com/sitemap.xml')) failures.push('robots.txt has the wrong sitemap directive.');

const sitemap = await readFile('sitemap.xml', 'utf8');
if (!sitemap.startsWith('<?xml') || !sitemap.includes('<urlset') || !sitemap.trim().endsWith('</urlset>')) failures.push('sitemap.xml is malformed.');
const sitemapLocations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const expectedLocations = ['https://frontendindex.com/', ...references.map(({ slug }) => `https://frontendindex.com/${slug}/`)];
for (const location of expectedLocations) if (!sitemapLocations.includes(location)) failures.push(`sitemap.xml is missing ${location}`);
if (new Set(sitemapLocations).size !== sitemapLocations.length) failures.push('sitemap.xml contains duplicate locations.');

function validateHTML(file, html) {
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1];
  if (!title) failures.push(`${file} is missing a page title.`);
  if (!description) failures.push(`${file} is missing a meta description.`);
  const markup = html.replace(/<script\b[\s\S]*?<\/script>/gi, '').replace(/<style\b[\s\S]*?<\/style>/gi, '');
  const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  for (const id of duplicates) failures.push(`${file} contains duplicate id="${id}".`);
  for (const tag of markup.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
    if (!/\brel="[^"]*noopener[^"]*"/i.test(tag[0])) failures.push(`${file} has target="_blank" without rel="noopener".`);
  }
  const jsonLdBlocks = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [position, match] of jsonLdBlocks.entries()) {
    try { JSON.parse(match[1]); } catch (error) { failures.push(`${file} JSON-LD block ${position + 1} is invalid: ${error.message}`); }
  }
  for (const [position, match] of [...html.matchAll(/<script\b(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)].entries()) {
    try { new Function(match[1]); } catch (error) { failures.push(`${file} script block ${position + 1} has invalid JavaScript: ${error.message}`); }
  }
}

const htmlFiles = ['index.html', ...generatedPages];
for (const file of htmlFiles) if (await exists(file)) validateHTML(file, await readFile(file, 'utf8'));

function resolveLocalReference(fromFile, reference) {
  if (!reference || reference === '#' || reference.startsWith('#') || /^(?:https?:|mailto:|tel:|data:)/i.test(reference)) return null;
  const clean = reference.split('#')[0].split('?')[0]; if (!clean) return null;
  let target = clean.startsWith('/') ? clean.slice(1) : posix.normalize(posix.join(dirname(fromFile), clean));
  if (!target || target === '.') target = 'index.html';
  if (target.endsWith('/')) target += 'index.html';
  return target;
}

for (const file of htmlFiles) {
  if (!(await exists(file))) continue;
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/gi)) {
    const target = resolveLocalReference(file, match[1]);
    if (target && !(await exists(target))) failures.push(`${file} references missing local file: ${match[1]}`);
  }
}

for (const svgFile of ['favicon.svg', 'assets/social-preview.svg']) {
  const svg = await readFile(svgFile, 'utf8');
  if (svg.includes('```')) failures.push(`${svgFile} contains Markdown code fences.`);
  if (!/<svg\b/i.test(svg) || !svg.trim().endsWith('</svg>')) failures.push(`${svgFile} is malformed.`);
}

const png = await readFile('assets/social-preview.png');
if (png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') failures.push('Social preview is not a valid PNG.');
if (png.length >= 24 && (png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630)) failures.push('Social preview must be exactly 1200×630.');

for (const entry of references) {
  if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(entry.slug)) failures.push(`Invalid reference slug: ${entry.slug}`);
  if (!entry.title || !entry.description || !entry.lastReviewed || !entry.whatItIs || !entry.mentalModel) failures.push(`Reference ${entry.slug} is missing required editorial fields.`);
  if (!entry.sources?.length) failures.push(`Reference ${entry.slug} needs at least one source.`);
  for (const source of entry.sources || []) if (!/^https:\/\//.test(source.url)) failures.push(`Reference ${entry.slug} has a non-HTTPS source.`);
}

if (failures.length) {
  console.error(failures.map(failure => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(`Frontend Index repo checks passed (${htmlFiles.length} HTML pages, ${references.length} generated references).`);
