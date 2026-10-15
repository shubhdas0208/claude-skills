import fs from 'node:fs';
import path from 'node:path';

export const REVIEW_DIR = 'design-review';
export const STATE_FILE = 'state.json';

export function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

export function readJson(p) {
  let text;
  try {
    text = fs.readFileSync(p, 'utf8');
  } catch (err) {
    throw new Error(`Cannot read ${p}: ${err.message}`);
  }
  try {
    return JSON.parse(text.replace(/^﻿/, ''));
  } catch (err) {
    throw new Error(`${p} is not valid JSON: ${err.message}`);
  }
}

// Write to a sibling temp file, then rename, so a crash never leaves half a state file.
export function writeJson(p, value) {
  writeText(p, JSON.stringify(value, null, 2) + '\n');
}

export function writeText(p, text) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const tmp = `${p}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, text);
  fs.renameSync(tmp, p);
}

export const pad2 = (n) => String(n).padStart(2, '0');

export function reviewDir(root) {
  return path.join(root, REVIEW_DIR);
}

export function roundDir(root, n) {
  return path.join(reviewDir(root), `round-${pad2(n)}`);
}

// Filesystem-safe form of a finding key, for attachment and backup names.
export const safeName = (s) => String(s).replace(/[^A-Za-z0-9._-]+/g, '_').slice(0, 120);

export function listJson(dir) {
  if (!exists(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => path.join(dir, f));
}
