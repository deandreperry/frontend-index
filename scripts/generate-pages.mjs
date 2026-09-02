import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const entries = JSON.parse(await readFile(join(ROOT, 'content/references.json'), 'utf8'));
const checkOnly = process.argv.includes('--check');
const changed = [];

const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

const renderList = (title, items) => items?.length ? `
      <section class="panel">
        <h2>${escapeHTML(title)}</h2>
        <ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
      </section>` : '';

function renderPage(entry) {
  const canonical = `https://frontendindex.com/${entry.slug}/`;
  const indexSection = entry.indexSection || entry.slug.split('/')[0];
  const article = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['TechArticle', 'LearningResource'],
        '@id': `${canonical}#article`,
        headline: entry.title,
        description: entry.description,
        dateModified: entry.lastReviewed,
        mainEntityOfPage: canonical,
        author: { '@type': 'Person', name: "De'Andre Perry", url: 'https://github.com/deandreperry' },
        isPartOf: { '@type': 'WebSite', '@id': 'https://frontendindex.com/#website', name: 'Frontend Index' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Frontend Index', item: 'https://frontendindex.com/' },
          { '@type': 'ListItem', position: 2, name: entry.domain, item: `https://frontendindex.com/#${indexSection}` },
          { '@type': 'ListItem', position: 3, name: entry.title, item: canonical }
        ]
      }
    ]
  };

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHTML(entry.title)} — Frontend Index</title>
  <meta name="description" content="${escapeHTML(entry.description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <meta name="theme-color" content="#08080a">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Frontend Index">
  <meta property="og:title" content="${escapeHTML(entry.title)} — Frontend Index">
  <meta property="og:description" content="${escapeHTML(entry.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://frontendindex.com/assets/social-preview.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Frontend Index — a visual reference system for modern frontend engineering">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHTML(entry.title)} — Frontend Index">
  <meta name="twitter:description" content="${escapeHTML(entry.description)}">
  <meta name="twitter:image" content="https://frontendindex.com/assets/social-preview.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles/reference.css">
  <script type="application/ld+json">${JSON.stringify(article).replace(/</g, '\\u003c')}</script>
</head>
<body>
  <a class="skip-link" href="#content">Skip to content</a>
  <header class="site-head">
    <div class="site-head-inner">
      <a class="brand" href="/"><span class="mark" aria-hidden="true">⌁</span>Frontend Index</a>
      <a class="back" href="/#${indexSection}">Return to the interactive index →</a>
    </div>
  </header>
  <main id="content" tabindex="-1">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Frontend Index</a><span aria-hidden="true">/</span><span>${escapeHTML(entry.domain)}</span><span aria-hidden="true">/</span><span aria-current="page">${escapeHTML(entry.title)}</span></nav>
    <div class="eyebrow">${escapeHTML(entry.domain)}</div>
    <h1>${escapeHTML(entry.title)}</h1>
    <p class="lede">${escapeHTML(entry.description)}</p>
    <div class="reviewed">Last reviewed: ${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${entry.lastReviewed}T00:00:00Z`))}</div>
    <article class="entry">
      <section class="panel"><h2>What it is</h2><p>${escapeHTML(entry.whatItIs)}</p></section>
      <section class="panel"><h2>Mental model</h2><p>${escapeHTML(entry.mentalModel)}</p></section>
      ${entry.whyItExists ? `<section class="panel"><h2>Why it exists</h2><p>${escapeHTML(entry.whyItExists)}</p></section>` : ''}
      ${renderList('When to use it', entry.whenToUse)}
      ${renderList('When not to use it', entry.whenNotToUse)}
      ${renderList('Alternatives', entry.alternatives)}
      ${renderList('Production considerations', entry.productionConsiderations)}
      ${entry.accessibilityImplications ? `<section class="panel"><h2>Accessibility implications</h2><p>${escapeHTML(entry.accessibilityImplications)}</p></section>` : ''}
      ${entry.performanceImplications ? `<section class="panel"><h2>Performance implications</h2><p>${escapeHTML(entry.performanceImplications)}</p></section>` : ''}
      ${entry.example ? `<section class="panel"><h2>Example · ${escapeHTML(entry.example.language)}</h2><pre><code>${escapeHTML(entry.example.code)}</code></pre></section>` : ''}
      <section class="panel"><h2>Primary documentation</h2><ul class="source-list">${entry.sources.map((source) => `<li><a href="${escapeHTML(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(source.label)}</a></li>`).join('')}</ul></section>
      <section class="panel"><h2>Related Frontend Index entries</h2><div class="related">${entry.related.map((item) => `<a href="${escapeHTML(item.href)}">${escapeHTML(item.label)}</a>`).join('')}</div></section>
    </article>
  </main>
  <footer>Maintained by De'Andre Perry · Frontend Index is an independent visual reference for modern frontend engineering.</footer>
</body>
</html>
`;
}

async function emit(relativePath, contents) {
  const outputPath = join(ROOT, relativePath);
  let current = null;
  try { current = await readFile(outputPath, 'utf8'); } catch {}
  if (current === contents) return;
  changed.push(relativePath);
  if (!checkOnly) {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, contents);
  }
}

for (const entry of entries) await emit(join(entry.slug, 'index.html'), renderPage(entry));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://frontendindex.com/</loc>
    <lastmod>2026-09-02</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
${entries.map((entry) => `  <url>\n    <loc>https://frontendindex.com/${entry.slug}/</loc>\n    <lastmod>${entry.lastReviewed}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n')}
</urlset>
`;
await emit('sitemap.xml', sitemap);

if (checkOnly && changed.length) {
  console.error(`Generated reference output is stale:\n${changed.map((file) => `- ${file}`).join('\n')}\nRun npm run generate.`);
  process.exit(1);
}

console.log(checkOnly ? `Generated reference output is current (${entries.length} pages).` : `Generated ${entries.length} reference pages.`);
