# Security Policy

Frontend Index is a static educational site with no backend, user accounts, or production data store.

If you find a security issue, please report it privately to the repository owner before opening a public issue. Include the affected file, steps to reproduce, and the impact.

For content corrections, broken links, accessibility issues, or browser compatibility problems, open a standard GitHub Issue.

The site renders only repository-controlled HTML strings. Search highlighting escapes query text, hash routes are resolved against known technology identifiers, local storage access has a memory fallback, and external links opened in a new tab use `rel="noopener noreferrer"`. New code should preserve those boundaries and avoid inserting user-controlled strings with `innerHTML`.

A strict Content Security Policy is not shipped from markup because the current single-file application intentionally uses inline styles and scripts. If hosting headers become configurable, introduce CSP in report-only mode first, inventory the Google Fonts dependency, and migrate inline execution deliberately rather than adding a policy that breaks the application.
