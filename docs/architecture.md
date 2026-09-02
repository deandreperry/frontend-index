# Architecture

Frontend Index remains a dependency-light static site that can be served directly by GitHub Pages at `frontendindex.com`.

## Current boundaries

- `index.html` owns the interactive index, existing component styles, technology registry, labs, and client-side state.
- `content/references.json` is the editorial source for crawlable long-form entries.
- `content/reference-schema.json` documents the reusable entry model.
- `scripts/generate-pages.mjs` generates standalone route HTML and the sitemap without a framework or runtime dependency.
- `styles/reference.css` gives generated pages the established Frontend Index visual language without duplicating the full interactive stylesheet.
- `scripts/validate-index.mjs` and `scripts/a11y-smoke.mjs` enforce production metadata and static accessibility invariants.

The large interactive file has not been mechanically split in this hardening branch. Its CSS, registry, and application code have execution-order coupling, and moving all of them at once would create a broad regression surface unrelated to the domain migration. New crawlable content is separated now; future extraction should move one stable boundary at a time, starting with design tokens and immutable technology data.

## Reference-page workflow

1. Add an entry to `content/references.json` using the documented schema.
2. Prefer specifications and official documentation for `sources`.
3. Run `npm run generate`.
4. Run `npm run check`.
5. Review the generated page in both narrow and wide viewports.

Generated route files and `sitemap.xml` are committed so GitHub Pages can serve them without a build step.

## Deployment assumptions

- The repository is published from its checked-in static files.
- `CNAME` maps the site to `frontendindex.com`.
- Root-relative asset paths assume the custom domain is the canonical deployment.
- Existing `#tech/...` drawer links remain supported by the main index.
