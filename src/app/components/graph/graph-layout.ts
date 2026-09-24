/**
 * Placement of a session graph. The graph alternates data and tasks: only the tasks go through a
 * layout algorithm, and each data then takes its place around the task it belongs to. This file
 * holds what both the worker (ELK) and the page (the provisional placement) need.
 */

export const NODE_SIZE = 50;
/** Horizontal space left between two nodes. */
export const NODE_GAP = 30;
/** Vertical space left between two layers of tasks, on top of the rows of data around them. */
const LAYER_GAP = 60;
/** Distance from a task to the rows of data drawn above and below it. */
const DATA_ROW_OFFSET = NODE_SIZE + 20;
/** The provisional placement wraps a layer wider than this, so that it stays on screen. */
const PROVISIONAL_ROW_SIZE = 100;

export type LayoutLink = {
  source: string;
  target: string;
  type: string;
};

export type LayoutInput = {
  /** Node ids, in arrival order. */
  nodes: string[];
  /** Type of each node, in the same order. */
  types: string[];
  links: LayoutLink[];
};

export type LayoutResponse =
  | {
    /** x and y of each node, interleaved, in the order of the request. */
    positions: Float64Array;
  }
  | { error: string };

/** What a layout algorithm places: the tasks, each as wide as its widest row of data. */
export type TaskGraph = {
  ids: string[];
  links: { source: string, target: string }[];
  widths: Map<string, number>;
  layerGap: number;
};

/** Centre of each node. */
export type Coordinates = Map<string, [number, number]>;

export type PreparedLayout = {
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
export function prepareLayout(input: LayoutInput): PreparedLayout {
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
        Math.min(...points.map(([, y]) => y)) - DATA_ROW_OFFSET,
      ]);
    }
    return coordinates;
  };

  return {
    graph: {
      ids: [...tasks, ...alone],
      links: [...taskLinks.values()],
      widths,
      layerGap: LAYER_GAP + 2 * DATA_ROW_OFFSET,
    },
    placeData,
  };
}

/**
 * A placement computed in a few milliseconds, shown while the real one is computed: each task on
 * the layer of its longest chain of dependencies, in arrival order, wide layers wrapped. It takes
 * no care of crossings.
 */
export function provisionalLayout(graph: TaskGraph): Coordinates {
  const successors = new Map<string, string[]>();
  const remaining = new Map<string, number>(graph.ids.map(id => [id, 0]));
  for (const { source, target } of graph.links) {
    push(successors, source, target);
    remaining.set(target, (remaining.get(target) ?? 0) + 1);
  }
  const depths = new Map<string, number>(graph.ids.map(id => [id, 0]));
  const queue = graph.ids.filter(id => remaining.get(id) === 0);
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    for (const next of successors.get(node) ?? []) {
      depths.set(next, Math.max(depths.get(next)!, depths.get(node)! + 1));
      const left = remaining.get(next)! - 1;
      remaining.set(next, left);
      if (left === 0) {
        queue.push(next);
      }
    }
  }

  const layers: string[][] = [];
  for (const id of graph.ids) {
    (layers[depths.get(id)!] ??= []).push(id);
  }

  const coordinates: Coordinates = new Map();
  const rowHeight = NODE_SIZE + graph.layerGap;
  let y = 0;
  for (const layer of layers) {
    if (!layer) {
      continue;
    }
    for (let start = 0; start < layer.length; start += PROVISIONAL_ROW_SIZE) {
      let x = 0;
      for (const id of layer.slice(start, start + PROVISIONAL_ROW_SIZE)) {
        const width = graph.widths.get(id) ?? NODE_SIZE;
        coordinates.set(id, [x + width / 2, y]);
        x += width + NODE_GAP;
      }
      y += rowHeight;
    }
  }
  return coordinates;
}

function push<T>(map: Map<string, T[]>, key: string, value: T) {
  const list = map.get(key);
  if (list) {
    list.push(value);
  } else {
    map.set(key, [value]);
  }
}
