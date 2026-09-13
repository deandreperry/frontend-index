import { readFile } from 'node:fs/promises';

const html = await readFile('index.html', 'utf8');
const failures = [];
const requireSnippet = (snippet, message) => { if (!html.includes(snippet)) failures.push(message); };

requireSnippet('<html lang="en"', 'Document language is missing.');
requireSnippet('<a href="#main" class="skip-link">', 'Skip link is missing.');
requireSnippet('<main class="main" id="main" tabindex="-1">', 'Skip-link target must be programmatically focusable.');
requireSnippet(':focus-visible { outline: 3px solid var(--accent)', 'Visible focus indicator is missing or too subtle.');
requireSnippet('@media (prefers-reduced-motion: reduce)', 'Reduced-motion behavior is missing.');
requireSnippet('role="dialog" aria-modal="true"', 'Modal semantics are missing.');
requireSnippet('role="combobox" aria-autocomplete="list"', 'Search combobox semantics are missing.');
requireSnippet('role="listbox" aria-label="Search results"', 'Search results listbox semantics are missing.');
requireSnippet('aria-controls="sidebar"', 'Mobile menu does not expose its controlled region.');
requireSnippet('trapFocus', 'Overlay focus containment is missing.');
requireSnippet('setPageInert(true)', 'Modal background is not made inert.');
requireSnippet('--type-body-sm: 15px;', 'Readable body-copy type scale is missing.');
requireSnippet('--type-body-sm: 15.5px;', 'Mobile body-copy type scale is missing.');

const inputIds = [...html.matchAll(/<(?:input|select|textarea)\b[^>]*\bid="([^"]+)"[^>]*>/gi)].map(match => match[1]);
for (const id of inputIds) {
  const tag = html.match(new RegExp(`<(?:input|select|textarea)\\b[^>]*\\bid="${id}"[^>]*>`, 'i'))?.[0] || '';
  if (!new RegExp(`<label\\b[^>]*for="${id}"`, 'i').test(html) && !/\baria-label(?:ledby)?="[^"]+"/i.test(tag)) failures.push(`Form control #${id} does not have an associated label.`);
}

const hexToRgb = hex => hex.match(/[a-f\d]{2}/gi).map(value => Number.parseInt(value, 16) / 255);
const luminance = hex => hexToRgb(hex).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
const contrast = (a, b) => { const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (light + 0.05) / (dark + 0.05); };
const pairs = [
  ['dark tertiary text', '#92929d', '#08080a'],
  ['light tertiary text', '#66666e', '#fafafa'],
  ['dark secondary text', '#b2b2bc', '#08080a'],
  ['light secondary text', '#515158', '#fafafa']
];
for (const [label, foreground, background] of pairs) {
  const ratio = contrast(foreground, background);
  if (ratio < 4.5) failures.push(`${label} contrast is ${ratio.toFixed(2)}:1; expected at least 4.5:1.`);
}

if (failures.length) {
  console.error(failures.map(failure => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Static accessibility smoke checks passed. Manual keyboard, screen-reader, zoom, and browser testing are still required.');
