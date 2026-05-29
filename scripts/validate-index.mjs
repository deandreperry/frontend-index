import { access, readFile } from 'node:fs/promises';

const requiredFiles = [
  'index.html',
  'favicon.svg',
  'site.webmanifest',
  'robots.txt',
  'sitemap.xml',
  'assets/social-preview.svg',
  'README.md',
  'LICENSE'
];

const requiredIndexSnippets = [
  '<link rel="manifest" href="site.webmanifest">',
  '<link rel="canonical" href="https://deandreperry.github.io/frontend-index/">',
  '<meta property="og:image" content="https://deandreperry.github.io/frontend-index/assets/social-preview.svg" />',
  '<meta name="twitter:image" content="https://deandreperry.github.io/frontend-index/assets/social-preview.svg" />',
  'https://github.com/deandreperry/frontend-index'
];

const failures = [];

for (const file of requiredFiles) {
  try {
    await access(file);
  } catch {
    failures.push(`Missing required file: ${file}`);
  }
}

const index = await readFile('index.html', 'utf8');
for (const snippet of requiredIndexSnippets) {
  if (!index.includes(snippet)) {
    failures.push(`index.html is missing: ${snippet}`);
  }
}

const scriptBlocks = [...index.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
for (const [i, match] of scriptBlocks.entries()) {
  try {
    new Function(match[1]);
  } catch (error) {
    failures.push(`Script block ${i + 1} has invalid JavaScript: ${error.message}`);
  }
}

const favicon = await readFile('favicon.svg', 'utf8');
if (favicon.includes('```')) {
  failures.push('favicon.svg contains Markdown code fences.');
}
if (!favicon.trim().endsWith('</svg>')) {
  failures.push('favicon.svg does not end with a closing SVG tag.');
}

JSON.parse(await readFile('site.webmanifest', 'utf8'));

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Frontend Index repo checks passed.');
