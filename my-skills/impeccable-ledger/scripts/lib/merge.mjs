import fs from 'node:fs';
import path from 'node:path';
import { exists, readJson, listJson, roundDir, pad2 } from './io.mjs';
import { validateInventory, validateFindingsFile, SYSTEM_SCREEN } from './validate.mjs';

const SEV_RANK = { P0: 0, P1: 1, P2: 2, P3: 3 };
const REVISED_FILE = '_revised.json';

// One decision, one place: the masthead names the round in a line. Anything longer is a summary of the
// suggestions, and those are read and decided in their own blocks, never above them.
const DEK_MAX_CHARS = 160;

const bySeverity = (a, b) =>
  SEV_RANK[a.sev] - SEV_RANK[b.sev] || (a.size === b.size ? 0 : a.size === 'MAJOR' ? -1 : 1);

export function loadRoundInputs(root, state, round) {
  const dir = roundDir(root, round.n);
  const invPath = path.join(dir, 'inventory.json');
  if (!exists(invPath)) throw new Error(`Missing ${invPath}. Write the screen inventory before building.`);
  const inventory = readJson(invPath);
  const invErrors = validateInventory(inventory);
  if (invErrors.length) throw new Error(`inventory.json is invalid:\n  - ${invErrors.join('\n  - ')}`);

  const screenIds = inventory.screens.map((s) => s.id);
  const docs = listJson(path.join(dir, 'findings')).map((file) => ({ file: path.basename(file), doc: readJson(file) }));
  if (!docs.length) throw new Error(`No findings files in ${path.join(dir, 'findings')}.`);
  const errors = docs.flatMap(({ file, doc }) => validateFindingsFile(doc, { screenIds, inputKind: state.input.kind, file }));

  const roundMetaPath = path.join(dir, 'round.json');
  const roundMeta = exists(roundMetaPath) ? readJson(roundMetaPath) : {};
  const cssPath = path.join(dir, 'product.css');
  const productCss = exists(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
  return { dir, inventory, docs, errors, roundMeta, productCss };
}

// Collapse exact-key duplicates: the worst severity and MAJOR win, every finder is credited.
function collectFindings(docs) {
  const byKey = new Map();
  for (const { file, doc } of docs) {
    const revised = file === REVISED_FILE;
    for (const f of doc.findings || []) {
      const incoming = { ...f, touches: f.touches || [], foundBy: [revised ? 'revise' : doc.command], revised };
      const prev = byKey.get(f.key);
      if (!prev) {
        byKey.set(f.key, incoming);
        continue;
      }
      if (prev.revised !== incoming.revised) {
        // A revision always replaces the reviewer's version of the same key.
        byKey.set(f.key, prev.revised ? prev : incoming);
        continue;
      }
      const lead = bySeverity(incoming, prev) < 0 ? incoming : prev;
      byKey.set(f.key, {
        ...lead,
        size: prev.size === 'MAJOR' || incoming.size === 'MAJOR' ? 'MAJOR' : 'MINOR',
        foundBy: [...new Set([...prev.foundBy, ...incoming.foundBy])],
        touches: [...new Set([...prev.touches, ...incoming.touches])],
      });
    }
  }
  return [...byKey.values()];
}

function attachmentUrls(ledgerDir, absPaths) {
  return (absPaths || []).map((p) => path.relative(ledgerDir, p).split(path.sep).join('/'));
}

export function mergeRound(root, state, round) {
  const inputs = loadRoundInputs(root, state, round);
  if (inputs.errors.length) {
    const err = new Error(`Findings failed validation (${inputs.errors.length}):\n  - ${inputs.errors.join('\n  - ')}`);
    err.validation = inputs.errors;
    throw err;
  }
  const { dir, inventory, docs, roundMeta, productCss } = inputs;
  const warnings = [];
  const dekChars = Array.from(String(roundMeta.dek || '')).length;
  if (dekChars > DEK_MAX_CHARS) {
    warnings.push(`round.json dek is ${dekChars} characters. Keep it to one line (${DEK_MAX_CHARS} at most) that names the scope; nothing above the ledger may restate or summarise the suggestions.`);
  }

  // Only earlier rounds' decisions shape this round, so rebuilding a round after its own ingest keeps every row.
  const earlier = (entry) => entry && entry.round < round.n;
  const priorCarry = Object.fromEntries(Object.entries(state.carry).filter(([, v]) => earlier(v)));
  const priorPending = Object.fromEntries(Object.entries(state.pending).filter(([, v]) => earlier(v)));

  let findings = collectFindings(docs).filter((f) => f.revised || !earlier(state.decided[f.key]));

  findings = findings.map((f) => {
    const carry = priorCarry[f.key];
    if (f.revised && !carry) warnings.push(`${f.key} is in ${REVISED_FILE} but was not a change request; shown as a normal row.`);
    if (!carry) return { ...f, revised: false };
    if (!f.revised) warnings.push(`${f.key} was a change request but only a reviewer re-raised it; revise it in ${REVISED_FILE}.`);
    return { ...f, prevNote: carry.note, prevRound: carry.round, prevImages: attachmentUrls(dir, carry.images) };
  });

  const present = new Set(findings.map((f) => f.key));
  for (const key of Object.keys(priorCarry)) {
    if (!present.has(key)) warnings.push(`Change request ${key} (round ${priorCarry[key].round}) has no revised row yet.`);
  }
  // Undecided rows survive into the next round even when no reviewer re-found them.
  for (const [key, p] of Object.entries(priorPending)) {
    if (!present.has(key) && !state.decided[key]) findings.push({ ...p.finding, fromRound: p.round, revised: false });
    else if (present.has(key)) findings = findings.map((f) => (f.key === key ? { ...f, fromRound: p.round } : f));
  }

  const prevRound = state.rounds.find((r) => r.n === round.n - 1);
  const changed = new Set(prevRound ? prevRound.changedScreens : []);
  const screens = [SYSTEM_SCREEN, ...inventory.screens];
  const screenById = new Map(screens.map((s) => [s.id, s]));

  const mocks = collectMocks(findings, warnings);
  const groups = buildGroups({ findings, screens, changed });
  const clean = collectClean(docs, findings, screenById);
  const dupes = findDupeCandidates(findings);

  const count = (pred) => findings.filter(pred).length;
  const model = {
    meta: {
      project: inventory.project,
      round: round.n,
      roundLabel: pad2(round.n),
      date: new Date().toISOString(),
      inputKind: state.input.kind,
      target: state.input.target,
      commands: round.commands,
      headline: roundMeta.headline || null,
      dek: roundMeta.dek || null,
      detectorCount: roundMeta.detectorCount ?? null,
      scores: roundMeta.scores || [],
      storageKey: `impeccable-ledger:${inventory.project}:r${pad2(round.n)}`,
      screens: inventory.screens.length,
    },
    stats: {
      total: findings.length,
      P0: count((f) => f.sev === 'P0'),
      P1: count((f) => f.sev === 'P1'),
      P2: count((f) => f.sev === 'P2'),
      P3: count((f) => f.sev === 'P3'),
      major: count((f) => f.size === 'MAJOR'),
      revised: count((f) => f.revised),
      changed: count((f) => changed.has(f.screen) && !f.revised),
      carried: count((f) => f.fromRound),
      mocks: mocks.length,
    },
    notes: roundMeta.notes || [],
    assumptions: roundMeta.assumptions || [],
    groups,
    clean,
    mocks,
    commandsSeen: [...new Set(findings.map((f) => f.cmd))].sort(),
    passesSeen: [...new Set(findings.flatMap((f) => f.foundBy))].sort(),
    productCss,
  };
  return { model, findings, warnings, dupes, dir };
}

function collectMocks(findings, warnings) {
  const byId = new Map();
  for (const f of findings) {
    if (!f.mock) continue;
    const prev = byId.get(f.mock.id);
    if (prev && (prev.now !== f.mock.now || prev.after !== f.mock.after)) {
      warnings.push(`mock ${f.mock.id} is defined twice with different markup; the first (${prev.from}) wins.`);
    }
    if (!prev) byId.set(f.mock.id, { ...f.mock, from: f.key });
  }
  return [...byId.values()];
}

function buildGroups({ findings, screens, changed }) {
  const screensWith = (list) =>
    screens
      .map((s) => ({ ...s, changed: changed.has(s.id), findings: list.filter((f) => f.screen === s.id).sort(bySeverity) }))
      .filter((s) => s.findings.length);

  const revised = findings.filter((f) => f.revised);
  const rest = findings.filter((f) => !f.revised);
  const groups = [];
  if (revised.length) groups.push({ title: 'Your change requests, revised', kind: 'revised', screens: screensWith(revised) });

  const changedRows = rest.filter((f) => changed.has(f.screen));
  if (changedRows.length) groups.push({ title: 'Changed in the last build', kind: 'changed', screens: screensWith(changedRows) });

  const areaOrder = [...new Set(screens.map((s) => s.area))];
  for (const area of areaOrder) {
    const rows = rest.filter((f) => !changed.has(f.screen) && screens.find((s) => s.id === f.screen)?.area === area);
    if (rows.length) groups.push({ title: area, kind: 'area', screens: screensWith(rows) });
  }
  return groups;
}

function collectClean(docs, findings, screenById) {
  const withRows = new Set(findings.map((f) => f.screen));
  const byScreen = new Map();
  for (const { doc } of docs) {
    for (const c of doc.clean || []) {
      if (withRows.has(c.screen)) continue;
      const prev = byScreen.get(c.screen);
      byScreen.set(c.screen, prev ? { ...prev, by: [...prev.by, doc.command] } : { screen: c.screen, name: screenById.get(c.screen)?.name || c.screen, why: c.why, by: [doc.command] });
    }
  }
  return [...byScreen.values()];
}

// Different keys, same place: the main session decides whether they are one issue.
function findDupeCandidates(findings) {
  const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const buckets = new Map();
  for (const f of findings) {
    const sigs = [f.evidence ? `${f.screen}|ev|${norm(f.evidence)}` : null, `${f.screen}|what|${norm(f.what)}`].filter(Boolean);
    for (const sig of sigs) buckets.set(sig, [...(buckets.get(sig) || []), f.key]);
  }
  const seen = new Set();
  return [...buckets.values()]
    .map((keys) => [...new Set(keys)])
    .filter((keys) => keys.length > 1)
    .filter((keys) => {
      const id = keys.slice().sort().join(',');
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
}
