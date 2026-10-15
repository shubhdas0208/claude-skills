// The 17 Impeccable commands the ledger can run, in the fixed order the picker prints.
// Numbers are part of the user-facing contract: never reorder, only append.

export const COMMANDS = Object.freeze([
  { n: 1, name: 'audit', does: 'Technical quality checks (a11y, performance, responsive)', ref: 'audit.md', nativeRef: 'audit.native.md', previews: ['metric', 'code', 'html'] },
  { n: 2, name: 'critique', does: 'UX design review: hierarchy, clarity, emotional resonance', ref: 'critique.md', previews: ['html', 'copy', 'type'] },
  { n: 3, name: 'polish', does: 'Final visual pass for shipping readiness', ref: 'polish.md', previews: ['html', 'type'] },
  { n: 4, name: 'distill', does: 'Ruthless subtraction to the essence', ref: 'distill.md', previews: ['html', 'copy'] },
  { n: 5, name: 'typeset', does: 'Fix typography', ref: 'typeset.md', previews: ['type', 'html'] },
  { n: 6, name: 'colorize', does: 'Add strategic color', ref: 'colorize.md', previews: ['html'] },
  { n: 7, name: 'layout', does: 'Fix spacing, composition, visual rhythm', ref: 'layout.md', previews: ['html'] },
  { n: 8, name: 'bolder', does: 'Push safe designs toward impact', ref: 'bolder.md', previews: ['html'] },
  { n: 9, name: 'quieter', does: 'Tone down designs that are shouting', ref: 'quieter.md', previews: ['html'] },
  { n: 10, name: 'animate', does: 'Purposeful motion', ref: 'animate.md', previews: ['html'] },
  { n: 11, name: 'delight', does: 'Small moments of personality', ref: 'delight.md', previews: ['html', 'copy'] },
  { n: 12, name: 'overdrive', does: 'Shaders, physics, cinematic transitions', ref: 'overdrive.md', previews: ['html'] },
  { n: 13, name: 'clarify', does: 'Rewrite confusing UX copy', ref: 'clarify.md', previews: ['copy'] },
  { n: 14, name: 'adapt', does: 'Responsive layouts', ref: 'adapt.md', nativeRef: 'adapt.native.md', previews: ['html'] },
  { n: 15, name: 'harden', does: 'Edge cases, i18n, error states, overflow', ref: 'harden.md', previews: ['html', 'copy', 'code'] },
  { n: 16, name: 'onboard', does: 'First-run experiences and empty states', ref: 'onboard.md', previews: ['html', 'copy'] },
  { n: 17, name: 'optimize', does: 'UI performance (LCP, bundle size)', ref: 'optimize.md', previews: ['metric', 'code'] },
]);

export const COMMAND_NAMES = Object.freeze(COMMANDS.map((c) => c.name));

export function commandByName(name) {
  return COMMANDS.find((c) => c.name === name) || null;
}

// Accepts "all", "1,4,9", "2-5", "typeset clarify", or any mix ("1-3, clarify").
// Returns command names in picker order, de-duplicated. Throws on anything unknown.
export function parseSelection(input) {
  const raw = String(input || '').trim().toLowerCase();
  if (!raw) throw new Error('Empty command selection. Reply with numbers like "2,5,13" or "all".');
  if (raw === 'all') return [...COMMAND_NAMES];

  const picked = new Set();
  for (const token of raw.split(/[\s,]+/).filter(Boolean)) {
    const range = token.match(/^(\d+)-(\d+)$/);
    if (range) {
      const [lo, hi] = [Number(range[1]), Number(range[2])].sort((a, b) => a - b);
      for (let i = lo; i <= hi; i++) picked.add(nameForNumber(i, token));
      continue;
    }
    if (/^\d+$/.test(token)) {
      picked.add(nameForNumber(Number(token), token));
      continue;
    }
    const name = token.replace(/^\/?impeccable\s*/, '');
    if (!COMMAND_NAMES.includes(name)) throw new Error(`Unknown command "${token}". Valid: 1-17, "all", or a command name.`);
    picked.add(name);
  }
  return COMMAND_NAMES.filter((n) => picked.has(n));
}

function nameForNumber(n, token) {
  const cmd = COMMANDS.find((c) => c.n === n);
  if (!cmd) throw new Error(`"${token}" is out of range. Commands are numbered 1-17.`);
  return cmd.name;
}

export function pickerText() {
  const width = Math.max(...COMMANDS.map((c) => c.name.length));
  return COMMANDS.map((c) => `${String(c.n).padStart(2)}. ${c.name.padEnd(width)}  ${c.does}`).join('\n');
}
