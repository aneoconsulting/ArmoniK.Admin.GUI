/// <reference lib="webworker" />

import { Coordinates, LayoutInput, LayoutResponse, NODE_GAP, NODE_SIZE, TaskGraph, prepareLayout } from './graph-layout';

/**
 * Lays a session graph out with ELK, off the main thread: several seconds for thousands of tasks.
 */
addEventListener('message', async ({ data }: MessageEvent<LayoutInput>) => {
  try {
    const prepared = prepareLayout(data);
    const coordinates = prepared.placeData(await elkLayout(prepared.graph));
    const positions = new Float64Array(data.nodes.length * 2);
    data.nodes.forEach((id, index) => {
      const [x, y] = coordinates.get(id)!;
      positions[index * 2] = x;
      positions[index * 2 + 1] = y;
    });
    postMessage({ positions } satisfies LayoutResponse, [positions.buffer]);
  } catch (error) {
    postMessage({ error: String(error) } satisfies LayoutResponse);
  }
});

/** ELK layered: layers, crossing minimisation, and the connected components packed. */
async function elkLayout(graph: TaskGraph): Promise<Coordinates> {
  const elk = await createElk();
  const result = await elk.layout({
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.spacing.nodeNode': String(NODE_GAP),
      'elk.layered.spacing.nodeNodeBetweenLayers': String(graph.layerGap),
      // Links are drawn as straight lines: routing them any smarter is wasted time.
      'elk.edgeRouting': 'POLYLINE',
    },
    children: graph.ids.map(id => ({ id, width: graph.widths.get(id) ?? NODE_SIZE, height: graph.height })),
    edges: graph.links.map((link, index) => ({ id: `e${index}`, sources: [link.source], targets: [link.target] })),
  });

  // ELK gives the top left corner, the graph expects the centre.
  return new Map((result.children ?? []).map(child => [child.id, [child.x! + child.width! / 2, child.y! + graph.height / 2]]));
}

/**
 * ELK's engine checks `typeof document` when it loads, which happens in the ELK constructor:
 * without one, it believes it is ELK's own worker, takes over `self.onmessage` and exports
 * nothing. A stub document for the time of the construction makes it export its in-thread worker
 * instead, which is what running here needs.
 */
async function createElk() {
  const { default: ELK } = await import('elkjs/lib/elk.bundled.js');
  const scope = globalThis as { document?: unknown };
  scope.document = {};
  try {
    return new ELK();
  } finally {
    delete scope.document;
  }
}
