import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const zipPath = path.resolve('allbars.zip');
const outDir = path.resolve('.tmp-allbars');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });
execFileSync('unzip', ['-o', zipPath, '-d', outDir], { stdio: 'inherit' });

const jsonPath = path.join(outDir, 'allbars.json');
const raw = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(raw);

console.log(JSON.stringify({
  rootType: Array.isArray(data) ? 'array' : typeof data,
  rootLength: Array.isArray(data) ? data.length : null,
  firstKeys: Array.isArray(data) && data[0] ? Object.keys(data[0]) : [],
  first: Array.isArray(data) ? data[0] : data,
  second: Array.isArray(data) ? data[1] : null,
  last: Array.isArray(data) ? data.at(-1) : null
}, null, 2));

// trigger PR workflow
