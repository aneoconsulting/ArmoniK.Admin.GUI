/// <reference lib="webworker" />

import { LayoutInput, LayoutResponse, layOut } from './graph-layout';

/**
 * Lays a session graph out off the main thread: seconds for hundreds of thousands of tasks.
 */
addEventListener('message', ({ data }: MessageEvent<LayoutInput>) => {
  try {
    const positions = layOut(data);
    postMessage({ positions } satisfies LayoutResponse, [positions.buffer]);
  } catch (error) {
    postMessage({ error: String(error) } satisfies LayoutResponse);
  }
});
