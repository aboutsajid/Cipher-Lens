import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const viteScript = join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');
const electronMainScript = join(rootDir, 'electron', 'main.cjs');
const packageJsonPath = join(rootDir, 'package.json');

function formatTitle(rawValue, fallback = 'Generated Desktop App') {
  const normalized = String(rawValue ?? '')
    .trim()
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');
  if (!normalized) return fallback;
  const parts = normalized.split(' ').filter(Boolean);
  if (parts.length === 0) return fallback;
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function resolveAppTitle() {
  try {
    const manifest = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    if (typeof manifest.name === 'string' && manifest.name.trim()) {
      return formatTitle(manifest.name.trim());
    }
  } catch {
    // Fall back to the directory name when package metadata is unavailable.
  }
  return formatTitle(rootDir.split(/[/\\]/).filter(Boolean).pop() ?? 'Generated Desktop App');
}

const appTitle = resolveAppTitle();

function findFreePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        server.close(() => reject(new Error('Unable to resolve a free localhost port.')));
        return;
      }
      const port = address.port;
      server.close((error) => {
        if (error) reject(error);
        else resolve(port);
      });
    });
  });
}

async function waitForUrl(url, timeoutMs = 15000) {
  const startedAt = Date.now();

  while ((Date.now() - startedAt) < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.ok || response.status === 304) {
        return;
      }
    } catch {
      // Keep polling until the local dev server is reachable.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for ${url} to become ready.`);
}

let rendererReady = false;
let shuttingDown = false;
let desktopProcess = null;
let renderer = null;

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  if (desktopProcess && !desktopProcess.killed) {
    desktopProcess.kill();
  }
  if (renderer && !renderer.killed) {
    renderer.kill();
  }
  setTimeout(() => process.exit(exitCode), 50);
}

async function handleRendererOutput(chunk, forward) {
  const text = chunk.toString();
  forward.write(text);
  if (!rendererReady && /(?:local:\s*http:\/\/127\.0\.0\.1:\d+|ready in)/i.test(text)) {
    rendererReady = true;
    await waitForUrl(desktopUrl);
    desktopProcess = await launchDesktopProcess();
    desktopProcess.once('exit', (code) => shutdown(code ?? 0));
    desktopProcess.once('error', (error) => {
      console.error(error);
      shutdown(1);
    });
  }
}

let desktopUrl = '';

async function launchDesktopProcess() {
  const electronBinary = (await import('electron')).default;
  const childEnv = {
    ...process.env,
    CIPHER_LENS_DEV_SERVER_URL: desktopUrl,
  };

  delete childEnv.ELECTRON_RUN_AS_NODE;

  return spawn(String(electronBinary), [electronMainScript], {
    cwd: rootDir,
    stdio: 'inherit',
    env: childEnv,
  });
}

const port = await findFreePort();
desktopUrl = `http://127.0.0.1:${port}`;
renderer = spawn(process.execPath, [viteScript, '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  cwd: rootDir,
  stdio: ['ignore', 'pipe', 'pipe'],
});

renderer.stdout.on('data', (chunk) => {
  void handleRendererOutput(chunk, process.stdout);
});
renderer.stderr.on('data', (chunk) => {
  void handleRendererOutput(chunk, process.stderr);
});
renderer.once('exit', (code) => {
  if (!shuttingDown && !rendererReady) {
    process.exit(code ?? 1);
  }
});
renderer.once('error', (error) => {
  console.error(error);
  shutdown(1);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => shutdown(0));
}
