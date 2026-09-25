/**
 * Placement of a session graph. The graph alternates data and tasks: only the tasks go through a
 * layout algorithm, and each data then takes its place around the task it belongs to. This file
 * holds what both the worker (ELK) and the page (the nodes added between two layouts) need.
 */

export const NODE_SIZE = 50;
/** Horizontal space left between two nodes. */
export const NODE_GAP = 30;
/** Vertical space left between two layers of tasks and the rows of data around them. */
const LAYER_GAP = 60;
/** Distance from a task to the rows of data drawn above and below it. */
const DATA_ROW_OFFSET = NODE_SIZE + 20;

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

/**
 * What a layout algorithm places: the tasks, each as a box holding the task and its rows of data,
 * as wide as its widest row. The algorithm must know the whole box: packing only the tasks, it
 * would put a row of data on the tasks of a neighbouring component.
 */
export type TaskGraph = {
  ids: string[];
  links: { source: string, target: string }[];
  widths: Map<string, number>;
  /** Height of every box: a task, a row of data above it and one below. */
  height: number;
  /** Space between the boxes of two consecutive layers. */
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
      height: NODE_SIZE + 2 * DATA_ROW_OFFSET,
      layerGap: LAYER_GAP,
    },
    placeData,
  };
}

function push<T>(map: Map<string, T[]>, key: string, value: T) {
  const list = map.get(key);
  if (list) {
    list.push(value);
  } else {
    map.set(key, [value]);
  }
}
