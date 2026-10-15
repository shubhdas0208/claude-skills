import { COMMAND_NAMES } from './commands.mjs';

export const SYSTEM_SCREEN = Object.freeze({
  id: 'SYSTEM',
  name: 'System layer',
  purpose: 'Tokens and patterns every screen inherits.',
  area: 'System',
});

const SEVERITIES = ['P0', 'P1', 'P2', 'P3'];
const SIZES = ['MAJOR', 'MINOR'];
const FRAMES = ['phone', 'desktop', 'none'];
const KEY_RE = /^[A-Za-z0-9._-]+::[a-z]+::[a-z0-9-]+$/;
const MOCK_ID_RE = /^m-[a-z0-9-]+$/;

const isStr = (v) => typeof v === 'string';
const nonEmpty = (v) => isStr(v) && v.trim().length > 0;

export function validateInventory(inv) {
  const errors = [];
  if (!inv || typeof inv !== 'object') return ['inventory.json must be an object.'];
  if (!nonEmpty(inv.project)) errors.push('inventory.project is required.');
  if (!Array.isArray(inv.screens) || inv.screens.length === 0) {
    errors.push('inventory.screens must be a non-empty array.');
    return errors;
  }
  const seen = new Set();
  inv.screens.forEach((s, i) => {
    const at = `inventory.screens[${i}]`;
    if (!nonEmpty(s.id) || !/^[A-Za-z0-9._-]+$/.test(s.id)) errors.push(`${at}.id must be letters, digits, . _ - only (got "${s.id}").`);
    if (s.id === SYSTEM_SCREEN.id) errors.push(`${at}.id "SYSTEM" is reserved.`);
    if (seen.has(s.id)) errors.push(`${at}.id "${s.id}" is duplicated.`);
    seen.add(s.id);
    if (!nonEmpty(s.name)) errors.push(`${at}.name is required.`);
    if (!nonEmpty(s.area)) errors.push(`${at}.area is required.`);
  });
  return errors;
}

export function validateFindingsFile(doc, { screenIds, inputKind, file }) {
  const errors = [];
  const at = (s) => `${file}: ${s}`;
  if (!doc || typeof doc !== 'object') return [at('must be a JSON object.')];
  if (!COMMAND_NAMES.includes(doc.command) && doc.command !== 'revise') errors.push(at(`command "${doc.command}" is not a known command.`));
  if (!Array.isArray(doc.findings)) errors.push(at('findings must be an array (use [] when the command found nothing).'));
  if (doc.clean != null && !Array.isArray(doc.clean)) errors.push(at('clean must be an array.'));

  const ids = new Set([...screenIds, SYSTEM_SCREEN.id]);
  (doc.findings || []).forEach((f, i) => {
    errors.push(...validateFinding(f, { ids, inputKind }).map((e) => at(`findings[${i}] ${e}`)));
  });
  (doc.clean || []).forEach((c, i) => {
    if (!ids.has(c.screen)) errors.push(at(`clean[${i}].screen "${c.screen}" is not in the inventory.`));
    if (!nonEmpty(c.why)) errors.push(at(`clean[${i}].why is required.`));
  });
  return errors;
}

function validateFinding(f, { ids, inputKind }) {
  const e = [];
  if (!f || typeof f !== 'object') return ['must be an object.'];
  if (!ids.has(f.screen)) e.push(`screen "${f.screen}" is not in the inventory (or SYSTEM).`);
  if (!isStr(f.key) || !KEY_RE.test(f.key)) e.push(`key "${f.key}" must look like "<screen>::<cmd>::<kebab-slug>".`);
  else if (!f.key.startsWith(`${f.screen}::`)) e.push(`key "${f.key}" must start with its screen "${f.screen}::".`);
  if (!SEVERITIES.includes(f.sev)) e.push(`sev must be one of ${SEVERITIES.join('/')}.`);
  if (!SIZES.includes(f.size)) e.push('size must be MAJOR or MINOR.');
  if (!COMMAND_NAMES.includes(f.cmd)) e.push(`cmd "${f.cmd}" is not a known command.`);
  for (const field of ['what', 'why', 'fix']) if (!nonEmpty(f[field])) e.push(`${field} is required.`);
  if (f.touches != null && (!Array.isArray(f.touches) || !f.touches.every(nonEmpty))) e.push('touches must be an array of file paths.');
  if (inputKind === 'images' && Array.isArray(f.touches) && f.touches.length) e.push('touches must be empty for a screenshot-only input.');
  e.push(...validatePreview(f.preview));
  if (f.mock != null) e.push(...validateMock(f.mock));
  return e;
}

function validatePreview(p) {
  if (!p || typeof p !== 'object') return ['preview is required; every row carries a before/after.'];
  switch (p.type) {
    case 'copy':
      if (!isStr(p.now) || !isStr(p.after)) return ['copy preview needs now and after strings (after may be "" with deleted:true).'];
      if (p.after === '' && !p.deleted) return ['copy preview with empty after must set deleted:true.'];
      return p.cap != null && !(Number.isInteger(p.cap) && p.cap > 0) ? ['copy preview cap must be a positive integer.'] : [];
    case 'type':
      return nonEmpty(p.sample) && isStr(p.nowStyle) && isStr(p.afterStyle) ? [] : ['type preview needs sample, nowStyle, afterStyle.'];
    case 'html':
      return isStr(p.now) && nonEmpty(p.after) ? [] : ['html preview needs now and after markup.'];
    case 'metric':
      if (!nonEmpty(p.label) || !nonEmpty(p.now) || !nonEmpty(p.after)) return ['metric preview needs label, now, after.'];
      return ['measured', 'estimated'].includes(p.basis) ? [] : ['metric preview basis must be "measured" or "estimated".'];
    case 'code':
      return isStr(p.now) && isStr(p.after) ? [] : ['code preview needs now and after strings.'];
    default:
      return [`preview.type "${p.type}" must be copy, type, html, metric, or code.`];
  }
}

function validateMock(m) {
  const e = [];
  if (!isStr(m.id) || !MOCK_ID_RE.test(m.id)) e.push(`mock.id "${m.id}" must look like "m-kebab-name".`);
  if (!nonEmpty(m.title)) e.push('mock.title is required.');
  if (!FRAMES.includes(m.frame)) e.push(`mock.frame must be ${FRAMES.join('/')}.`);
  if (!isStr(m.now) || !nonEmpty(m.after)) e.push('mock needs now and after markup.');
  return e;
}
