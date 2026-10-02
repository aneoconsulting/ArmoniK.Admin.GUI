/// <reference lib="webworker" />

import { elkLayOut } from './graph-elk-layout';
import { LayoutInput, LayoutResponse, layOut } from './graph-layout';

/**
 * Lays a session graph out off the main thread: seconds for hundreds of thousands of tasks with
 * the layout of our own, much longer with ELK.
 */
addEventListener('message', async ({ data }: MessageEvent<LayoutInput>) => {
  try {
    const positions = data.algorithm === 'elk' ? await elkLayOut(data) : layOut(data);
    postMessage({ positions } satisfies LayoutResponse, [positions.buffer]);
  } catch (error) {
    postMessage({ error: String(error) } satisfies LayoutResponse);
  }
});
