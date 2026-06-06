#!/usr/bin/env node
// Copy Sigil runtime assets into the npm package for distribution.
// Keep this dependency-free so the publish lifecycle is portable and auditable.

import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, '..');

function copyFile(source, destination, label) {
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(source, destination);
  console.log(`Copied ${label}`);
}

copyFile(
  join(repoRoot, 'tools', 'intent', 'sigil.py'),
  join(scriptDir, 'lib', 'sigil.py'),
  'sigil.py to npm/lib/'
);

copyFile(
  join(repoRoot, 'tools', 'intent_viewer', 'index.html'),
  join(scriptDir, 'lib', 'sigil_viewer.html'),
  'intent_viewer to npm/lib/sigil_viewer.html'
);

const demoIndexDir = join(repoRoot, 'examples', 'demo-app', '.intent', 'index');
if (existsSync(demoIndexDir)) {
  mkdirSync(join(scriptDir, 'lib', 'demo_index'), { recursive: true });
  for (const file of readdirSync(demoIndexDir).filter((name) => name.endsWith('.json'))) {
    copyFile(
      join(demoIndexDir, file),
      join(scriptDir, 'lib', 'demo_index', file),
      `demo index ${file} to npm/lib/demo_index/`
    );
  }
} else {
  console.log('Skipped demo index copy; examples/demo-app/.intent/index is absent');
}
