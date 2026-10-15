import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { exists, readJson, writeJson, roundDir } from './io.mjs';

const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

// Resolve a touched path against the project root and refuse anything that escapes it.
function inside(root, rel) {
  const abs = path.resolve(root, rel);
  const relBack = path.relative(root, abs);
  if (relBack.startsWith('..') || path.isAbsolute(relBack)) throw new Error(`Refusing to back up "${rel}": it is outside the project root.`);
  return { abs, rel: relBack.split(path.sep).join('/') };
}

export function backupRound(root, roundN, extraFiles = []) {
  const dir = roundDir(root, roundN);
  const planPath = path.join(dir, 'build-plan.json');
  if (!exists(planPath)) throw new Error(`Missing ${planPath}. Ingest decisions first.`);
  const plan = readJson(planPath);
  const wanted = [...new Set([...(plan.touches || []), ...extraFiles])];
  const backupDir = path.join(dir, 'backup');
  const manifestPath = path.join(backupDir, 'manifest.json');
  const prior = exists(manifestPath) ? readJson(manifestPath).files : [];
  const already = new Set(prior.map((f) => f.path));

  const added = [];
  const missing = [];
  for (const file of wanted) {
    const { abs, rel } = inside(root, file);
    if (already.has(rel)) continue; // the first copy is the pre-build original; never overwrite it
    if (!exists(abs)) {
      missing.push(rel);
      added.push({ path: rel, existed: false });
      continue;
    }
    const dest = path.join(backupDir, 'files', rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(abs, dest);
    added.push({ path: rel, existed: true, sha256: sha(abs) });
  }
  const files = [...prior, ...added];
  writeJson(manifestPath, { round: roundN, createdAt: new Date().toISOString(), files });
  return { backupDir, added, missing, total: files.length };
}

export function restoreRound(root, roundN) {
  const backupDir = path.join(roundDir(root, roundN), 'backup');
  const manifestPath = path.join(backupDir, 'manifest.json');
  if (!exists(manifestPath)) throw new Error(`No backup for round ${roundN}.`);
  const { files } = readJson(manifestPath);
  const restored = [];
  const removed = [];
  for (const f of files) {
    const { abs } = inside(root, f.path);
    if (f.existed) {
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.copyFileSync(path.join(backupDir, 'files', f.path), abs);
      restored.push(f.path);
    } else if (exists(abs)) {
      fs.rmSync(abs); // created by the build; restoring means it did not exist
      removed.push(f.path);
    }
  }
  return { restored, removed };
}
