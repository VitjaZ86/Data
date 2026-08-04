import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const zipPath = path.resolve('allbars.zip');
const outDir = path.resolve('.tmp-allbars');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
execFileSync('unzip', ['-o', zipPath, '-d', outDir], { stdio: 'inherit' });

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(outDir);
console.log('FILES', files.map(f => path.relative(outDir, f)));
for (const file of files) {
  const stat = fs.statSync(file);
  const buf = fs.readFileSync(file);
  const text = buf.toString('utf8');
  const lines = text.split(/\r?\n/).filter(Boolean);
  console.log(JSON.stringify({
    file: path.relative(outDir, file),
    bytes: stat.size,
    lineCount: lines.length,
    firstLine: lines[0] ?? null,
    secondLine: lines[1] ?? null,
    lastLine: lines.at(-1) ?? null
  }, null, 2));
}
