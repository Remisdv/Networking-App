/* eslint-disable no-console */
import * as fs from 'fs';
import * as path from 'path';

declare global {
  // Avoid truncating multiple times when multiple test files load this setup
  // eslint-disable-next-line no-var
  var __E2E_LOG_INIT: boolean | undefined;
}

function resolveOutPath(): string {
  if (process.env.E2E_LOG_FILE) {
    return path.resolve(process.cwd(), process.env.E2E_LOG_FILE);
  }
  const state = (global as any)?.expect?.getState?.();
  const testPath: string | undefined = state?.testPath;
  if (testPath) {
    // Place logs under test/log/<feature>/<file>.log
    const rel = path.relative(__dirname, testPath); // e.g., e2e/auth/auth.login.e2e-spec.ts
    const dir = path.dirname(rel).replace(/^e2e[\\/]/i, ''); // auth
    // Ensure .log extension regardless of naming pattern (e.g., *.e2e-spec.ts)
    const base = path.basename(rel).replace(/\.[jt]s$/i, '.log');
    return path.resolve(__dirname, 'log', dir, base);
  }
  // Fallback
  return path.resolve(__dirname, 'e2e.log');
}

const outPath = resolveOutPath();

// Ensure directory and truncate this test-file log at start
try {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
} catch {}
fs.writeFileSync(outPath, '');

const stream = fs.createWriteStream(outPath, { flags: 'a' });

console.log = (...args: any[]) => {
  try {
    const raw = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
    // strip ANSI color codes
    const stripped = raw.replace(/\u001b\[[0-9;]*m/g, '');
    stream.write(stripped + '\n');
  } catch {}
  // Do not print to console; file only
};

afterAll(async () => {
  await new Promise((resolve) => stream.end(resolve));
});
