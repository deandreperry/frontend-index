# Frontend Index

A visual reference system for modern frontend engineering.

Frontend Index v3.0 is an interactive map for understanding how the modern frontend stack fits together: browsers, HTML, CSS, JavaScript, frameworks, build tooling, architecture, performance, Git workflows, AI-assisted development, and production patterns.

[Open Frontend Index](https://frontendindex.com)

The canonical production site is available at the custom domain [frontendindex.com](https://frontendindex.com).

## What is included

- A guided 01–28 roadmap from browser fundamentals through AI-assisted workflows.
- Five secondary domains for topical exploration: Foundations, Application Engineering, Production Engineering, Developer Workflow, and Practice & Growth.
- Interactive labs for Flexbox, CSS Grid, the JavaScript event loop, and CSS specificity.
- A searchable, keyboard-navigable Stack Map with deep-linked technology drawers.
- Dark and light themes with safe local preference storage.
- Crawlable reference pages with unique metadata, official sources, reviewed dates, related entries, and structured data.
- Production metadata for search crawlers, social sharing, and installable web-app behavior.

## Architecture

Frontend Index remains a dependency-light static site. No client framework or server runtime is required.

```text
frontend-index/
├── .github/workflows/validate.yml
├── accessibility/focus-management/index.html
├── assets/
│   ├── social-preview.png
│   └── social-preview.svg
├── browser/rendering-pipeline/index.html
├── content/
│   ├── reference-schema.json
│   └── references.json
├── docs/
│   ├── analytics-strategy.md
│   ├── architecture.md
│   └── labs-strategy.md
├── frameworks/react/index.html
├── javascript/event-loop/index.html
├── performance/core-web-vitals/index.html
├── scripts/
│   ├── a11y-smoke.mjs
│   ├── generate-pages.mjs
│   └── validate-index.mjs
├── security/content-security-policy/index.html
├── styles/reference.css
├── CNAME
├── favicon.svg
├── index.html
├── package.json
├── robots.txt
├── site.webmanifest
└── sitemap.xml
```

The interactive experience remains in `index.html` to preserve its static-site simplicity and established execution order. New standalone reference content is data-driven: `content/references.json` is rendered by `scripts/generate-pages.mjs`. See [docs/architecture.md](docs/architecture.md) for boundaries and future extraction guidance.

## Local development

```bash
git clone https://github.com/deandreperry/frontend-index.git
cd frontend-index
npm install
npm run dev
```

Open `http://localhost:4173`.

When reference content changes, regenerate tracked pages and the sitemap:

```bash
npm run generate
```

Run all repository checks:

```bash
npm run check
```

The check verifies generated output, required files, canonical production URLs, Open Graph and Twitter images, manifest root paths, sitemap entries, robots directives, duplicate IDs, internal file references, JavaScript and JSON-LD syntax, SVG/PNG integrity, reference metadata, form labels, focus behavior hooks, reduced-motion support, and key color-contrast tokens.

Automated checks do not replace manual keyboard, screen-reader, zoom, mobile, and cross-browser review.

## Reference-page and SEO model

Each generated reference page has a unique title, description, canonical URL, Open Graph metadata, reviewed date, primary documentation, related entries, and truthful `TechArticle` / `LearningResource` structured data. The homepage publishes `WebSite` and maintainer metadata.

Existing `#tech/...` links remain supported. Crawlable pages add durable URLs such as:

- `/browser/rendering-pipeline/`
- `/javascript/event-loop/`
- `/frameworks/react/`
- `/accessibility/focus-management/`
- `/performance/core-web-vitals/`
- `/security/content-security-policy/`

Add future substantial entries to `content/references.json`, follow `content/reference-schema.json`, prefer specifications or official documentation, run `npm run generate`, and commit both the source and generated output.

## CI and deployment

GitHub Actions runs `npm install --ignore-scripts` and `npm run check` on every push and pull request. The workflow is intentionally small and uses no third-party runtime dependencies.

Deployment assumes GitHub Pages serves the checked-in files and honors `CNAME`. Root-relative application paths target `https://frontendindex.com/`; the retired GitHub Pages project URL must not be reintroduced as production metadata.

## Contributing

Suggestions, corrections, source updates, accessibility notes, and issue reports are welcome through [GitHub Issues](https://github.com/deandreperry/frontend-index/issues). Entries should stay concise, verifiable, and aligned with the editorial policy shown in the About dialog.

Before proposing a change:

```bash
npm run generate
npm run check
```

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md) for project-specific guidance.

## License

Copyright (c) 2026 De'Andre Perry. All rights reserved.

This project is proprietary software provided for educational and informational purposes only. No permission is granted to copy, modify, distribute, sublicense, sell, or commercially use this software or derivative works without explicit written permission from the author.

---

Built to be read once, referenced forever.
