import fs from 'node:fs';
import path from 'node:path';
import { exists, readJson, writeJson, reviewDir, roundDir, STATE_FILE } from './io.mjs';

export const STATE_SCHEMA = 'impeccable-ledger/state@1';
export const INPUT_KINDS = Object.freeze(['html', 'code', 'url', 'images']);

// Round lifecycle: reviewing -> decided -> built. Screenshot-only projects stop at decided.
export const ROUND_STATUS = Object.freeze(['reviewing', 'decided', 'built']);

export const statePath = (root) => path.join(reviewDir(root), STATE_FILE);

export function loadState(root) {
  const p = statePath(root);
  if (!exists(p)) return null;
  const state = readJson(p);
  if (state.schema !== STATE_SCHEMA) throw new Error(`${p} has schema "${state.schema}", expected "${STATE_SCHEMA}".`);
  return state;
}

export function requireState(root) {
  const state = loadState(root);
  if (!state) throw new Error(`No ${statePath(root)}. Run "ledger.mjs init" first.`);
  return state;
}

export function saveState(root, state) {
  writeJson(statePath(root), state);
}

export function currentRound(state) {
  return state.rounds[state.rounds.length - 1] || null;
}

export function resolveRound(state, requested) {
  if (requested == null) {
    const cur = currentRound(state);
    if (!cur) throw new Error('No rounds exist yet.');
    return cur;
  }
  const n = Number(requested);
  const found = state.rounds.find((r) => r.n === n);
  if (!found) throw new Error(`Round ${requested} does not exist. Rounds: ${state.rounds.map((r) => r.n).join(', ') || 'none'}.`);
  return found;
}

export function replaceRound(state, round) {
  return { ...state, rounds: state.rounds.map((r) => (r.n === round.n ? round : r)) };
}

function freshState({ project, kind, target, platform }) {
  return {
    schema: STATE_SCHEMA,
    project,
    input: { kind, target },
    platform: platform || 'web',
    commands: [],
    rounds: [],
    decided: {},
    carry: {},
    pending: {},
  };
}

// Opens the next round folder and seeds it with what the reviewers must know from earlier rounds.
export function openRound(root, { project, kind, target, platform, commands, force }) {
  const prior = loadState(root);
  if (prior && kind && prior.input.kind !== kind) {
    throw new Error(`This design-review folder tracks a "${prior.input.kind}" input; got "${kind}". Use a different --root.`);
  }
  let state = prior || freshState({ project, kind, target, platform });
  const last = currentRound(state);
  if (last && last.status === 'reviewing' && !force) {
    throw new Error(`Round ${last.n} is still awaiting decisions. Ingest them first, or pass --force to open a new round anyway.`);
  }
  // Without a recorded build the next round cannot put changed screens first.
  if (last && last.status === 'decided' && state.input.kind !== 'images' && !force) {
    throw new Error(`Round ${last.n} has decisions but no recorded build. Run "built --screens ..." after building, or pass --force.`);
  }

  const n = last ? last.n + 1 : 1;
  const dir = roundDir(root, n);
  fs.mkdirSync(path.join(dir, 'findings'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'brief'), { recursive: true });

  const lastDir = last ? roundDir(root, last.n) : null;
  for (const carried of ['inventory.json', 'product.css', 'context.md']) {
    if (lastDir && exists(path.join(lastDir, carried)) && !exists(path.join(dir, carried))) {
      fs.copyFileSync(path.join(lastDir, carried), path.join(dir, carried));
    }
  }

  const round = {
    n,
    createdAt: new Date().toISOString(),
    commands,
    status: 'reviewing',
    changedScreens: [],
    changedFiles: [],
  };
  state = {
    ...state,
    project: project || state.project,
    input: target ? { ...state.input, target } : state.input,
    commands,
    rounds: [...state.rounds, round],
  };

  writeJson(path.join(dir, 'round.json'), {
    n,
    project: state.project,
    input: state.input,
    platform: state.platform,
    commands,
    headline: null,
    dek: null,
    notes: [],
    assumptions: [],
    detectorCount: null,
    scores: [],
  });
  writeJson(path.join(dir, 'brief', 'prior.json'), priorBrief(state, last));
  saveState(root, state);
  return { state, round, dir };
}

// Everything a reviewer agent must not re-raise, plus what changed in the last build.
export function priorBrief(state, lastRound) {
  const toList = (obj, pick) => Object.entries(obj).map(([key, v]) => ({ key, ...pick(v) }));
  return {
    decided: toList(state.decided, (v) => ({ decision: v.decision, round: v.round, screen: v.screen, what: v.what })),
    changeRequests: toList(state.carry, (v) => ({ round: v.round, screen: v.finding.screen, what: v.finding.what, note: v.note })),
    undecided: toList(state.pending, (v) => ({ round: v.round, screen: v.finding.screen, what: v.finding.what })),
    changedScreens: lastRound ? lastRound.changedScreens : [],
    changedFiles: lastRound ? lastRound.changedFiles : [],
  };
}
