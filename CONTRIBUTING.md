# Contributing

Frontend Index is currently a proprietary educational project.

Suggestions, corrections, accessibility notes, and issue reports are welcome through GitHub Issues. Code changes, redistribution, or derivative work require explicit written permission from De'Andre Perry before use.

Before proposing a change, please run:

```bash
npm run generate
npm run check
```

Good contributions for this project are specific, verifiable, and focused on improving the reference value of the index.

For crawlable reference entries, update `content/references.json`, use specifications or official documentation where available, include a reviewed date and related entries, then commit the generated route and sitemap changes. Automated accessibility checks cover only static invariants; keyboard, zoom, screen-reader, reduced-motion, and mobile behavior still need human review.
