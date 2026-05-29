# Frontend Index

A visual reference system for modern frontend engineering.

Frontend Index is an interactive map for understanding how the modern frontend stack fits together: browsers, HTML, CSS, JavaScript, frameworks, build tooling, architecture, performance, Git workflows, AI-assisted development, and production patterns.

[Open the live site](https://deandreperry.github.io/frontend-index/)

---

## What Is Included

- A guided frontend roadmap from browser fundamentals through AI-assisted workflows.
- Interactive labs for Flexbox, CSS Grid, the JavaScript event loop, and CSS specificity.
- A technology stack map with searchable, clickable entries.
- Visual explainers for browser rendering, Git flow, VS Code workflows, terminal commands, performance, and production UI patterns.
- Dark and light themes with local preference storage.
- Static-site metadata for GitHub Pages, social previews, search crawlers, and installable web app metadata.

---

## Repository Structure

```text
frontend-index/
├── assets/
│   └── social-preview.svg
├── scripts/
│   └── validate-index.mjs
├── .editorconfig
├── .gitignore
├── .nojekyll
├── CONTRIBUTING.md
├── favicon.svg
├── index.html
├── LICENSE
├── package.json
├── README.md
├── robots.txt
├── SECURITY.md
├── sitemap.xml
└── site.webmanifest
```

---

## Local Development

Clone the repository:

```bash
git clone https://github.com/deandreperry/frontend-index.git
cd frontend-index
```

Run the static site locally:

```bash
npm run dev
```

Then open:

```text
http://localhost:4173
```

Run the repo checks:

```bash
npm run check
```

The check verifies required static files, key SEO/social metadata, valid inline JavaScript syntax, the manifest JSON, and the favicon SVG.

---

## Built With

- HTML5
- CSS3
- Vanilla JavaScript
- SVG
- GitHub Pages

The app is intentionally dependency-light. The core experience lives in `index.html` so it can be hosted as a plain static site.

---

## Roadmap

Planned expansion areas:

- Accessibility engineering
- Frontend testing
- API integration patterns
- Frontend security
- Advanced performance diagnostics
- React and Next.js architecture
- State management tradeoffs
- Design system governance

---

## License

Copyright (c) 2026 De'Andre Perry. All rights reserved.

This project is proprietary software provided for educational and informational purposes only. No permission is granted to copy, modify, distribute, sublicense, sell, or commercially use this software or derivative works without explicit written permission from the author.

---

Built to be read once, referenced forever.
