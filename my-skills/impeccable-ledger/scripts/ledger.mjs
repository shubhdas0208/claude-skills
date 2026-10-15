#!/usr/bin/env node
// impeccable-ledger CLI: the deterministic half of the review loop.
// The model writes inventory + findings JSON; this script validates, merges, renders, and tracks rounds.

import path from 'node:path';
import { pickerText, parseSelection } from './lib/commands.mjs';
import { writeJson, writeText, roundDir } from './lib/io.mjs';
import { openRound, requireState, saveState, resolveRound, replaceRound, INPUT_KINDS, loadState } from './lib/state.mjs';
import { loadRoundInputs, mergeRound } from './lib/merge.mjs';
import { renderLedger } from './lib/render.mjs';
import { parseDecisionsFile, applyDecisions } from './lib/ingest.mjs';
import { backupRound, restoreRound } from './lib/backup.mjs';

const USAGE = `Usage: node ledger.mjs <command> [options]   (all commands accept --root <projectDir>, default cwd)

  picker                                  Print the numbered command list
  init --kind <html|code|url|images> --target <path-or-url> --commands "2,5,13"
       [--project <name>] [--platform web|ios|android] [--force]
                                          Open the next round folder
  validate [--round N]                    Check inventory + findings JSON
  build [--round N]                       Merge findings, write merged.json + ledger.html
  ingest <decisions.json|decisions.txt> [--round N]
                                          Apply exported decisions, write build-plan.json
  backup [--round N] [--files a,b]        Copy files the build will touch into round-NN/backup/
  built --screens S01,S07 [--files a,b] [--round N]
                                          Record what the build changed; closes the round
  restore --round N --yes                 Put the round's backed-up files back
  status                                  Summarise rounds and open items`;

function parseArgs(argv) {
  const [cmd, ...rest] = argv;
  const opts = { _: [] };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (!a.startsWith('--')) {
      opts._.push(a);
      continue;
    }
    const name = a.slice(2);
    const next = rest[i + 1];
    if (next === undefined || next.startsWith('--')) opts[name] = true;
    else {
      opts[name] = next;
      i++;
    }
  }
  return { cmd, opts };
}

const list = (v) => (typeof v === 'string' ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);

function requireOpt(opts, name) {
  if (typeof opts[name] !== 'string' || !opts[name].trim()) throw new Error(`--${name} is required.\n\n${USAGE}`);
  return opts[name].trim();
}

const handlers = {
  picker() {
    console.log(pickerText());
    console.log('\nReply with numbers ("2,5,13"), a range ("1-4"), or "all".');
  },

  init(root, opts) {
    const prior = loadState(root);
    const kind = prior ? prior.input.kind : requireOpt(opts, 'kind');
    if (!INPUT_KINDS.includes(kind)) throw new Error(`--kind must be one of ${INPUT_KINDS.join(', ')}.`);
    const target = typeof opts.target === 'string' ? opts.target : prior ? null : requireOpt(opts, 'target');
    const commands = opts.commands ? parseSelection(opts.commands) : prior?.commands;
    if (!commands || !commands.length) throw new Error('--commands is required for the first round.');
    const project = typeof opts.project === 'string' ? opts.project : prior?.project || path.basename(root);
    const { round, dir } = openRound(root, { project, kind, target, platform: opts.platform, commands, force: Boolean(opts.force) });
    console.log(`Opened round ${round.n} at ${dir}`);
    console.log(`Commands: ${commands.join(', ')}`);
    console.log(`Next: write ${path.join(dir, 'inventory.json')}${round.n > 1 ? ' (copied from last round; refresh it if screens changed)' : ''}, product.css, context.md, then brief one agent per command.`);
  },

  validate(root, opts) {
    const state = requireState(root);
    const round = resolveRound(state, opts.round);
    const { errors, docs } = loadRoundInputs(root, state, round);
    if (errors.length) {
      console.error(`${errors.length} problem(s):\n  - ${errors.join('\n  - ')}`);
      process.exitCode = 1;
      return;
    }
    const count = docs.reduce((n, d) => n + (d.doc.findings || []).length, 0);
    console.log(`Round ${round.n}: ${docs.length} findings files, ${count} findings, all valid.`);
  },

  build(root, opts) {
    const state = requireState(root);
    const round = resolveRound(state, opts.round);
    const { model, findings, warnings, dupes, dir } = mergeRound(root, state, round);
    writeJson(path.join(dir, 'merged.json'), { round: round.n, builtAt: new Date().toISOString(), findings });
    const ledgerPath = path.join(dir, 'ledger.html');
    writeText(ledgerPath, renderLedger(model));
    saveState(root, replaceRound(state, { ...round, findings: findings.length }));

    const s = model.stats;
    console.log(`Ledger: ${ledgerPath}`);
    console.log(`${s.total} rows · P0 ${s.P0} · P1 ${s.P1} · P2 ${s.P2} · P3 ${s.P3} · ${s.major} major · ${s.revised} revised · ${s.changed} on changed screens · ${s.carried} carried undecided · ${s.mocks} full mocks`);
    if (warnings.length) console.log(`\nWarnings:\n  - ${warnings.join('\n  - ')}`);
    if (dupes.length) console.log(`\nPossible duplicates (same screen, same evidence or wording). Merge or keep, then rebuild:\n  - ${dupes.map((d) => d.join('  <>  ')).join('\n  - ')}`);
  },

  ingest(root, opts) {
    const file = opts._[0];
    if (!file) throw new Error(`ingest needs a decisions file.\n\n${USAGE}`);
    const state = requireState(root);
    const parsed = parseDecisionsFile(path.resolve(file));
    const round = resolveRound(state, opts.round ?? parsed.round ?? undefined);
    const { state: next, plan, warnings } = applyDecisions(root, state, round, parsed);
    saveState(root, next);
    console.log(`Round ${round.n} decisions ingested from ${parsed.source}: ${plan.approved.length} approved · ${plan.changes.length} changes requested · ${plan.rejected.length} rejected · ${plan.undecided.length} undecided`);
    console.log(`Build plan: ${path.join(roundDir(root, round.n), 'build-plan.json')}`);
    if (plan.touches.length) console.log(`Files the approved rows touch (${plan.touches.length}):\n  ${plan.touches.join('\n  ')}`);
    if (warnings.length) console.log(`\nWarnings:\n  - ${warnings.join('\n  - ')}`);
  },

  backup(root, opts) {
    const state = requireState(root);
    const round = resolveRound(state, opts.round);
    const { backupDir, added, missing, total } = backupRound(root, round.n, list(opts.files));
    console.log(`Backed up ${added.filter((f) => f.existed).length} new file(s) to ${backupDir} (${total} tracked).`);
    if (missing.length) console.log(`Not on disk yet, will be deleted on restore if the build creates them:\n  ${missing.join('\n  ')}`);
  },

  built(root, opts) {
    const state = requireState(root);
    const round = resolveRound(state, opts.round);
    const screens = list(opts.screens);
    if (!screens.length && state.input.kind !== 'images') throw new Error('--screens is required: the screens this build changed.');
    const next = { ...round, status: 'built', builtAt: new Date().toISOString(), changedScreens: screens, changedFiles: list(opts.files) };
    saveState(root, replaceRound(state, next));
    console.log(`Round ${round.n} marked built. Changed screens: ${screens.join(', ') || 'none'}. The next round lists them first.`);
  },

  restore(root, opts) {
    if (!opts.round || opts.yes !== true) throw new Error('restore overwrites project files. Pass --round N --yes after the user confirms.');
    const { restored, removed } = restoreRound(root, Number(opts.round));
    console.log(`Restored ${restored.length} file(s)${removed.length ? `, removed ${removed.length} the build created` : ''}.`);
  },

  status(root) {
    const state = loadState(root);
    if (!state) {
      console.log('No design review in this folder yet.');
      return;
    }
    console.log(`${state.project} · ${state.input.kind} · ${state.input.target}`);
    for (const r of state.rounds) {
      console.log(`  round ${r.n}: ${r.status}${r.findings != null ? ` · ${r.findings} rows` : ''} · ${r.commands.join(', ')}${r.changedScreens?.length ? ` · changed ${r.changedScreens.join(', ')}` : ''}`);
    }
    const decided = Object.values(state.decided);
    console.log(`Decided: ${decided.filter((d) => d.decision === 'approve').length} approved, ${decided.filter((d) => d.decision === 'reject').length} rejected · open change requests: ${Object.keys(state.carry).length} · undecided: ${Object.keys(state.pending).length}`);
  },
};

function main() {
  const { cmd, opts } = parseArgs(process.argv.slice(2));
  const handler = handlers[cmd];
  if (!handler) {
    console.log(USAGE);
    process.exitCode = cmd ? 1 : 0;
    return;
  }
  const root = path.resolve(typeof opts.root === 'string' ? opts.root : process.cwd());
  try {
    handler(root, opts);
  } catch (err) {
    console.error(`ledger ${cmd}: ${err.message}`);
    process.exitCode = 1;
  }
}

main();
