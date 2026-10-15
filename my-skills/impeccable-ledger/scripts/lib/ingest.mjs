import fs from 'node:fs';
import path from 'node:path';
import { exists, readJson, writeJson, roundDir, safeName } from './io.mjs';
import { replaceRound } from './state.mjs';

export const DECISIONS_SCHEMA = 'impeccable-ledger/decisions@1';
const DECISIONS = ['approve', 'reject', 'change', 'undecided'];
const SECTION_TO_DECISION = { 'CHANGES REQUESTED': 'change', APPROVED: 'approve', REJECTED: 'reject', UNDECIDED: 'undecided' };
const IMG_EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' };

export function parseDecisionsFile(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) return parseJson(JSON.parse(trimmed), file);
  return parseText(text, file);
}

function parseJson(doc, file) {
  if (doc.schema !== DECISIONS_SCHEMA) throw new Error(`${file}: schema "${doc.schema}" is not ${DECISIONS_SCHEMA}.`);
  if (!Array.isArray(doc.items)) throw new Error(`${file}: items must be an array.`);
  const items = doc.items.map((it, i) => {
    if (typeof it.key !== 'string' || !DECISIONS.includes(it.decision)) throw new Error(`${file}: items[${i}] needs a key and a decision of ${DECISIONS.join('/')}.`);
    return { key: it.key, decision: it.decision, note: String(it.note || '').trim(), images: Array.isArray(it.images) ? it.images : [] };
  });
  return { round: doc.round ?? null, project: doc.project ?? null, items, source: 'json', imagesDropped: false };
}

// The "Copy as text" export: section headers, one "#key=" per row, indented instruction lines.
function parseText(text, file) {
  const lines = text.split(/\r?\n/);
  const head = lines.find((l) => /DESIGN DECISIONS/.test(l)) || '';
  const roundMatch = head.match(/ROUND\s+(\d+)/i);
  const items = [];
  let decision = null;
  let current = null;
  let inNote = false;
  let imagesDropped = false;

  for (const line of lines) {
    const section = line.match(/^(CHANGES REQUESTED|APPROVED|REJECTED|UNDECIDED)\s*\(/);
    if (section) {
      decision = SECTION_TO_DECISION[section[1]];
      current = null;
      continue;
    }
    const keyMatch = line.match(/#key=(\S+)\s*$/);
    if (keyMatch && decision) {
      current = { key: keyMatch[1], decision, note: '', images: [] };
      items.push(current);
      inNote = false;
      continue;
    }
    if (!current) continue;
    const instr = line.match(/^\s{2,}MY INSTRUCTION:\s?(.*)$/);
    if (instr) {
      current.note = instr[1];
      inNote = true;
    } else if (/^\s{2,}IMAGES ATTACHED:/.test(line)) {
      imagesDropped = true;
      inNote = false;
    } else if (inNote && /^\s{4,}\S/.test(line)) {
      current.note += '\n' + line.replace(/^\s{4}/, '');
    } else if (inNote && /^\s*$/.test(line)) {
      // A paragraph break inside the note (chat pastes often trim the indent). Trailing ones are trimmed below.
      current.note += '\n';
    } else {
      inNote = false;
    }
  }
  if (!items.length) throw new Error(`${file}: no "#key=" rows found. Paste the full "Copy as text" export, or pass the decisions.json download.`);
  return {
    round: roundMatch ? Number(roundMatch[1]) : null,
    project: null,
    items: items.map((it) => ({ ...it, note: it.note.trim() })),
    source: 'text',
    imagesDropped,
  };
}

function saveImages(dir, key, images) {
  const saved = [];
  images.forEach((img, i) => {
    const m = String(img.data || '').match(/^data:(image\/[a-z+]+);base64,(.+)$/);
    if (!m || !IMG_EXT[m[1]]) return;
    const file = path.join(dir, 'attachments', `${safeName(key)}-${i + 1}.${IMG_EXT[m[1]]}`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, Buffer.from(m[2], 'base64'));
    saved.push(file);
  });
  return saved;
}

const without = (obj, key) => Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key));

export function applyDecisions(root, state, round, parsed) {
  if (parsed.round != null && parsed.round !== round.n) {
    throw new Error(`These decisions are for round ${parsed.round}, but round ${round.n} was targeted. Pass --round ${parsed.round}.`);
  }
  const dir = roundDir(root, round.n);
  const mergedPath = path.join(dir, 'merged.json');
  if (!exists(mergedPath)) throw new Error(`Missing ${mergedPath}. Build the ledger for round ${round.n} first.`);
  const byKey = new Map(readJson(mergedPath).findings.map((f) => [f.key, f]));

  const warnings = [];
  let { decided, carry, pending } = state;
  const plan = { round: round.n, inputKind: state.input.kind, approved: [], changes: [], rejected: [], undecided: [] };
  const normalized = [];

  for (const item of parsed.items) {
    const finding = byKey.get(item.key);
    if (!finding) {
      warnings.push(`Unknown key ${item.key} (not in round ${round.n}); skipped.`);
      continue;
    }
    // A note or an image without a decision is still a change request, as in the ledger UI.
    const decision = item.decision === 'undecided' && (item.note || item.images.length) ? 'change' : item.decision;
    const images = decision === 'change' ? saveImages(dir, item.key, item.images) : [];
    const summary = { key: item.key, screen: finding.screen, cmd: finding.cmd, what: finding.what };
    normalized.push({ ...summary, decision, note: item.note, images });

    if (decision === 'approve' || decision === 'reject') {
      decided = { ...decided, [item.key]: { decision, round: round.n, screen: finding.screen, cmd: finding.cmd, what: finding.what, note: item.note } };
      carry = without(carry, item.key);
      pending = without(pending, item.key);
      if (decision === 'approve') plan.approved.push({ ...finding, note: item.note });
      else plan.rejected.push(summary);
    } else if (decision === 'change') {
      carry = { ...carry, [item.key]: { round: round.n, note: item.note, images, finding } };
      decided = without(decided, item.key);
      pending = without(pending, item.key);
      plan.changes.push({ ...summary, note: item.note, images });
    } else {
      if (!carry[item.key]) pending = { ...pending, [item.key]: { round: round.n, finding } };
      plan.undecided.push(summary);
    }
  }

  const missing = [...byKey.keys()].filter((k) => !parsed.items.some((it) => it.key === k));
  if (missing.length) warnings.push(`${missing.length} ledger rows were absent from the export and stay undecided.`);
  for (const key of missing) if (!carry[key] && !decided[key]) pending = { ...pending, [key]: { round: round.n, finding: byKey.get(key) } };
  if (parsed.imagesDropped) warnings.push('The text export mentions attached images it cannot carry. Use the decisions.json download to keep them.');

  const buildPlan = {
    ...plan,
    touches: [...new Set(plan.approved.flatMap((f) => f.touches || []))].sort(),
    screens: [...new Set(plan.approved.map((f) => f.screen))],
  };
  writeJson(path.join(dir, 'decisions.json'), { schema: DECISIONS_SCHEMA, project: state.project, round: round.n, source: parsed.source, ingestedAt: new Date().toISOString(), items: normalized });
  writeJson(path.join(dir, 'build-plan.json'), buildPlan);

  const nextRound = { ...round, status: 'decided', decidedAt: new Date().toISOString() };
  const nextState = replaceRound({ ...state, decided, carry, pending }, nextRound);
  return { state: nextState, plan: buildPlan, warnings };
}
