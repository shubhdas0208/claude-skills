import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TEMPLATE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'templates', 'ledger.html');

const escHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// JSON inside <script type="application/json">: neutralise every "<" so no string can close the tag,
// and escape the two line separators older parsers choke on.
const scriptSafeJson = (value) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(new RegExp('\\u2028', 'g'), '\\u2028')
    .replace(new RegExp('\\u2029', 'g'), '\\u2029');

export function renderLedger(model) {
  const template = fs.readFileSync(TEMPLATE, 'utf8');
  const title = `${model.meta.project} · Design Ledger · Round ${model.meta.roundLabel}`;
  const out = template.replace('<!--LEDGER_TITLE-->', escHtml(title)).replace('/*__LEDGER_DATA__*/', () => scriptSafeJson(model));
  if (out.includes('/*__LEDGER_DATA__*/')) throw new Error('Template data slot was not replaced.');
  return out;
}
