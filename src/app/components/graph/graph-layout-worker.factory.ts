/**
 * Kept apart so that tests can replace it: `import.meta` does not exist in the CommonJS modules
 * they are compiled to.
 */
export function createLayoutWorker(): Worker {
  return new Worker(new URL('./graph-layout.worker', import.meta.url), { type: 'module' });
}
