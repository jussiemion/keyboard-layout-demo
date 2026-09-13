import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

const prefix = '/keyboard-layout-demo';
execFileSync(
  process.platform === 'win32' ? 'bun.exe' : 'bun',
  ['run', 'build'],
  {
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_BASE_PATH: prefix },
  },
);
const output = 'dist/client';
// Pages already mounts this directory under the repository name.
renameSync(join(output, prefix.slice(1), '_next'), join(output, '_next'));
// Vinext rewrites CSS public-font URLs relative to its static asset prefix.
if (existsSync(join(output, 'fonts'))) {
  cpSync(join(output, 'fonts'), join(output, '_next/static/fonts'), {
    recursive: true,
  });
}
writeFileSync(join(output, '.nojekyll'), '');
// Ship authorship and license notices alongside the distributed application.
for (const notice of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
  cpSync(notice, join(output, notice));
}

function checkFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) checkFiles(file);
    else if (/\.(html|css)$/.test(file)) {
      const text = readFileSync(file, 'utf8');
      for (const match of text.matchAll(
        /(?:src="|href="|url\(["']?)(\/keyboard-layout-demo\/[^"'<>\s)]+)/g,
      )) {
        const relative = match[1].slice(prefix.length + 1).split(/[?#]/)[0];
        if (!existsSync(join(output, relative)))
          throw new Error(`Missing Pages asset: ${relative}`);
      }
    }
  }
}
checkFiles(output);
console.log(
  'GitHub Pages export ready; HTML and CSS asset references verified.',
);
