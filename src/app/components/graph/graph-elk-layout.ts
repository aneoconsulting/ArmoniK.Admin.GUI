/**
 * ELK layered, as the graph was laid out before the layout of our own, kept to compare them: the
 * page offers it in its debug options. The tasks only go through ELK, linked when one feeds the
 * other, and each data then takes its place around the task it belongs to.
 */
import { Coordinates, LayoutInput, LayoutLink, NODE_GAP, NODE_SIZE, push } from './graph-layout';

/** Vertical space left between two layers of tasks and the rows of data around them. */
const LAYER_GAP = 60;
/** Distance from a task to the rows of data drawn above and below it. */
const DATA_ROW_OFFSET = NODE_SIZE + 20;

/** The x and y of each node, interleaved, in the order of the input. */
export async function elkLayOut(input: LayoutInput): Promise<Float64Array> {
  const prepared = prepareLayout(input);
  const coordinates = prepared.placeData(await elkLayout(prepared.graph));
  const positions = new Float64Array(input.nodes.length * 2);
  input.nodes.forEach((id, index) => {
    const [x, y] = coordinates.get(id)!;
    positions[index * 2] = x;
    positions[index * 2 + 1] = y;
  });
  return positions;
}

/**
 * What a layout algorithm places: the tasks, each as a box holding the task and its rows of data,
 * as wide as its widest row. The algorithm must know the whole box: packing only the tasks, it
 * would put a row of data on the tasks of a neighbouring component.
 */
type TaskGraph = {
  ids: string[];
  links: { source: string, target: string }[];
  widths: Map<string, number>;
  /** Height of every box: a task, a row of data above it and one below. */
  height: number;
  /** Space between the boxes of two consecutive layers. */
  layerGap: number;
};

type PreparedLayout = {
  graph: TaskGraph;
  /** Completes the coordinates of the tasks with the ones of the data around them. */
  placeData: (coordinates: Coordinates) => Coordinates;
};

/**
 * Builds the graph of the tasks, two tasks being linked when one produces a data the other
 * consumes (a parent produces the payload of its subtasks). Each data is then attached to a task:
 * - a payload above the task it feeds,
 * - an output below its owner,
 * - a data without owner (a client input) above its consumer, or above the mean of its consumers
 *   when there are several,
 * - a data linked to no task is placed as a node of its own.
 */
function prepareLayout(input: LayoutInput): PreparedLayout {
  const isTask = new Map(input.nodes.map((id, index) => [id, input.types[index] === 'task']));
  const incoming = new Map<string, LayoutLink[]>();
  const outgoing = new Map<string, LayoutLink[]>();
  for (const link of input.links) {
    push(outgoing, link.source, link);
    push(incoming, link.target, link);
  }

  const above = new Map<string, string[]>();
  const below = new Map<string, string[]>();
  const shared = new Map<string, string[]>();
  const alone: string[] = [];
  const taskLinks = new Map<string, { source: string, target: string }>();

  for (const id of input.nodes) {
    if (isTask.get(id)) {
      continue;
    }
    const into = incoming.get(id) ?? [];
    const out = outgoing.get(id) ?? [];
    const producers = into.filter(link => isTask.get(link.source)).map(link => link.source);
    const consumers = out.filter(link => isTask.get(link.target)).map(link => link.target);
    for (const producer of producers) {
      for (const consumer of consumers) {
        if (producer !== consumer) {
          taskLinks.set(`${producer}|${consumer}`, { source: producer, target: consumer });
        }
      }
    }

    const fed = out.find(link => link.type === 'payload')?.target;
    const owner = into.find(link => link.type === 'output')?.source;
    if (fed !== undefined) {
      push(above, fed, id);
    } else if (owner !== undefined) {
      push(below, owner, id);
    } else if (consumers.length === 1) {
      push(above, consumers[0], id);
    } else if (consumers.length > 1) {
      shared.set(id, consumers);
    } else {
      alone.push(id);
    }
  }

  const slot = NODE_SIZE + NODE_GAP;
  const tasks = input.nodes.filter(id => isTask.get(id));
  const widths = new Map(tasks.map(id => [id, Math.max(1, above.get(id)?.length ?? 0, below.get(id)?.length ?? 0) * slot - NODE_GAP]));

  const placeData = (coordinates: Coordinates) => {
    const row = (ids: string[], x: number, y: number) => ids.forEach((id, index) => {
      coordinates.set(id, [x + (index - (ids.length - 1) / 2) * slot, y]);
    });
    for (const task of tasks) {
      const [x, y] = coordinates.get(task)!;
      row(above.get(task) ?? [], x, y - DATA_ROW_OFFSET);
      row(below.get(task) ?? [], x, y + DATA_ROW_OFFSET);
    }
    // Rare, and not given any room: it may overlap the payloads of its consumers.
    for (const [id, consumers] of shared) {
      const points = consumers.map(consumer => coordinates.get(consumer)!);
      coordinates.set(id, [
        points.reduce((sum, [x]) => sum + x, 0) / points.length,
        points.reduce((min, [, y]) => Math.min(min, y), Infinity) - DATA_ROW_OFFSET,
      ]);
    }
    return coordinates;
  };

  return {
    graph: {
      ids: [...tasks, ...alone],
      links: [...taskLinks.values()],
      widths,
      height: NODE_SIZE + 2 * DATA_ROW_OFFSET,
      layerGap: LAYER_GAP,
    },
    placeData,
  };
}

/** Loaded once for the life of the worker, which the page keeps from one layout to the next. */
let elk: ReturnType<typeof createElk> | undefined;

/** ELK layered: layers and crossing minimisation. */
async function elkLayout(graph: TaskGraph): Promise<Coordinates> {
  // Forgotten when it fails to load, or every later layout would fail with it.
  elk ??= createElk().catch(error => {
    elk = undefined;
    throw error;
  });
  const result = await (await elk).layout({
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.spacing.nodeNode': String(NODE_GAP),
      'elk.layered.spacing.nodeNodeBetweenLayers': String(graph.layerGap),
      // Links are drawn as straight lines: routing them any smarter is wasted time.
      'elk.edgeRouting': 'POLYLINE',
      // Chrome gives a worker a small stack, and ELK recurses once per task in the components
      // search and in the default layering (network simplex): a connected graph of a few thousand
      // tasks overflowed it. With neither, chains of several thousand tasks fit. Each task still
      // goes one layer below its deepest predecessor.
      'elk.separateConnectedComponents': 'false',
      'elk.layered.layering.strategy': 'LONGEST_PATH_SOURCE',
    },
    children: graph.ids.map(id => ({ id, width: graph.widths.get(id) ?? NODE_SIZE, height: graph.height })),
    edges: graph.links.map((link, index) => ({ id: `e${index}`, sources: [link.source], targets: [link.target] })),
  });

  // ELK spaces two layers by the slope of the links between them, as routed: a task depending on a
  // whole wide layer ended thousands of pixels below it. The links are drawn straight, so every
  // layer goes a fixed step below the previous one.
  const children = result.children ?? [];
  const layers = [...new Set(children.map(child => Math.round(child.y!)))].sort((a, b) => a - b);
  const layerOf = new Map(layers.map((y, index) => [y, index]));
  const step = graph.height + graph.layerGap;

  // ELK gives the top left corner, the graph expects the centre.
  return new Map(children.map(child => [child.id, [child.x! + child.width! / 2, layerOf.get(Math.round(child.y!))! * step + graph.height / 2]]));
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
