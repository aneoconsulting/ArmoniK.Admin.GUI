/**
 * Placement of a session graph, knowing what a session graph is: tasks fed by data, and mostly a
 * tree of subtasks, where a task submits subtasks and the one that gathers their results. The
 * worker runs it, and the page shares its types.
 *
 * 1. Boxes: each task is a box holding its rows of data, a payload above it and its outputs below.
 *    A data shared by several tasks the client uploaded gets a box of its own.
 * 2. Families: each task goes with its parent task, a shared data with the closest family holding
 *    all its consumers, the rest with the session.
 * 3. Layers among siblings: a task goes below the siblings whose subtrees produce what it reads.
 *    An aggregation lands under the subtasks it gathers, a consumer under the data it reads.
 * 4. Blocks: each task on top of its subtree, the layers of its children below it, a wide layer
 *    wrapped to about the proportions of a screen. The first layer is centred under the task, each
 *    next one under what it reads, in the order of what it reads: an aggregation centred under what
 *    it gathers, the consumers of a data together under it.
 *
 * Unlike a layout by global layers, as ELK's, a subtree stays under its parent: an aggregation
 * deep in a family does not go to the bottom of the whole graph, among unrelated ones. A link
 * between families, rarer, may cross others. Every step is linear in the size of the graph, or
 * nearly, and nothing recurses: a graph of hundreds of thousands of tasks must fit. Lists live in
 * flat typed arrays, as offsets into one array of values: an array per node is what made the
 * garbage collector the slowest step.
 */

export const NODE_SIZE = 50;
/** Horizontal space left between two nodes. */
export const NODE_GAP = 30;
/** Vertical space left between two layers of tasks and the rows of data around them. */
const LAYER_GAP = 60;
/** Distance from a task to the rows of data drawn above and below it. */
const DATA_ROW_OFFSET = NODE_SIZE + 20;
const SLOT = NODE_SIZE + NODE_GAP;
/** A task, a row of data above it and one below. */
const BOX_HEIGHT = NODE_SIZE + 2 * DATA_ROW_OFFSET;
const LAYER_STEP = BOX_HEIGHT + LAYER_GAP;
/** A layer of more children than this is wrapped on several rows, when wide… */
const WRAP_FROM = 20;
/** …to about the proportions of a screen. */
const ASPECT = 16 / 9;

export type LayoutLink = {
  source: string;
  target: string;
  type: string;
};

/** ELK is kept to compare it with the layout of our own, the default. */
export type LayoutAlgorithm = 'layered' | 'elk';

export type LayoutInput = {
  /** The layered layout of this file when left out. */
  algorithm?: LayoutAlgorithm;
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

/** Centre of each node. */
export type Coordinates = Map<string, [number, number]>;

const TASK_BOX = 0;
/** A data the client uploaded, shared by several tasks. */
const SHARED_BOX = 1;
/** A data linked to no task. */
const ALONE_BOX = 2;

/** Lists of numbers: those of `i` are `values[start[i]]` to `values[start[i + 1]]` excluded. */
type Lists = { start: Int32Array, values: Int32Array };

/** Lists from pairs (`owners[k]` holds `values[k]`), in the order of the pairs. */
function lists(count: number, owners: ArrayLike<number>, values: ArrayLike<number>, length = owners.length): Lists {
  const start = new Int32Array(count + 1);
  for (let k = 0; k < length; k++) {
    start[owners[k] + 1]++;
  }
  for (let i = 0; i < count; i++) {
    start[i + 1] += start[i];
  }
  const next = start.slice(0, count);
  const result = new Int32Array(length);
  for (let k = 0; k < length; k++) {
    result[next[owners[k]]++] = values[k];
  }
  return { start, values: result };
}

/** A growable list of numbers. */
class Numbers {
  values = new Int32Array(1024);
  length = 0;

  push(value: number) {
    if (this.length === this.values.length) {
      const grown = new Int32Array(this.values.length * 2);
      grown.set(this.values);
      this.values = grown;
    }
    this.values[this.length++] = value;
  }
}

/** What is laid out: the boxes, and the links between them, each once. */
type Boxes = {
  count: number;
  kind: Uint8Array;
  /** The node a box is: its task, or its data. */
  node: Int32Array;
  width: Float64Array;
  /** The box of the parent task, -1 for a root. */
  parent: Int32Array;
  predecessors: Lists;
  successors: Lists;
  /** For each node in a row of data: its box (-1 for none), its side (-1 above, 1 below) and its rank in the row. */
  rowBox: Int32Array;
  rowSide: Int8Array;
  rowRank: Int32Array;
  aboveCount: Int32Array;
  belowCount: Int32Array;
};

/** The x and y of each node, interleaved, in the order of the input. */
export function layOut(input: LayoutInput): Float64Array {
  const boxes = buildBoxes(input);
  const families = familiesOf(boxes);
  const { layer, before } = localLayers(boxes, families);
  const { x, row } = placeBlocks(boxes, families, layer, before);
  return positionsOf(input, boxes, row, x);
}

function buildBoxes(input: LayoutInput): Boxes {
  const nodeCount = input.nodes.length;
  const index = new Map<string, number>();
  input.nodes.forEach((id, position) => index.set(id, position));
  const isTask = new Uint8Array(nodeCount);
  input.types.forEach((type, position) => (isTask[position] = type === 'task' ? 1 : 0));

  // Per data: the task its payload feeds, its owner, the parent task of the subtask it feeds, and
  // the tasks it is an input of.
  const fed = new Int32Array(nodeCount).fill(-1);
  const owner = new Int32Array(nodeCount).fill(-1);
  const parentOf = new Int32Array(nodeCount).fill(-1);
  const consumed = new Numbers();
  const consumer = new Numbers();
  for (const link of input.links) {
    const source = index.get(link.source);
    const target = index.get(link.target);
    if (source === undefined || target === undefined) {
      continue;
    }
    if ((link.type === 'payload' || link.type === 'dependency') && isTask[target]) {
      if (link.type === 'payload') {
        fed[source] = target;
      }
      consumed.push(source);
      consumer.push(target);
    } else if (link.type === 'output' && isTask[source]) {
      owner[target] = source;
    } else if (link.type === 'parent' && isTask[source]) {
      parentOf[target] = source;
    }
  }
  const consumers = lists(nodeCount, consumed.values, consumer.values, consumed.length);
  // Counts the distinct consumers of a data: a task may name an input twice. Each pass over the
  // data marks the tasks it saw with a stamp of its own.
  const seenBy = new Float64Array(nodeCount).fill(-1);
  const distinctConsumers = (data: number, pass: number, each?: (task: number) => void) => {
    const stamp = pass * nodeCount + data;
    let distinct = 0;
    for (let k = consumers.start[data]; k < consumers.start[data + 1]; k++) {
      const task = consumers.values[k];
      if (seenBy[task] !== stamp) {
        seenBy[task] = stamp;
        distinct++;
        each?.(task);
      }
    }
    return distinct;
  };

  // A box per task, then a box per data that goes with no task.
  const boxOf = new Int32Array(nodeCount).fill(-1);
  const node = new Numbers();
  const kind = new Numbers();
  for (let i = 0; i < nodeCount; i++) {
    if (isTask[i]) {
      boxOf[i] = node.length;
      node.push(i);
      kind.push(TASK_BOX);
    }
  }
  const taskCount = node.length;
  const aboveCount = new Int32Array(nodeCount);
  const belowCount = new Int32Array(nodeCount);
  const rowBox = new Int32Array(nodeCount).fill(-1);
  const rowSide = new Int8Array(nodeCount);
  const rowRank = new Int32Array(nodeCount);
  const intoRow = (data: number, box: number, side: -1 | 1) => {
    rowBox[data] = box;
    rowSide[data] = side;
    rowRank[data] = side < 0 ? aboveCount[box]++ : belowCount[box]++;
  };
  let firstConsumer = -1;
  for (let i = 0; i < nodeCount; i++) {
    if (isTask[i]) {
      continue;
    }
    const distinct = distinctConsumers(i, 0, task => (firstConsumer = task));
    if (fed[i] !== -1) {
      intoRow(i, boxOf[fed[i]], -1);
    } else if (owner[i] !== -1) {
      intoRow(i, boxOf[owner[i]], 1);
    } else if (distinct === 1) {
      intoRow(i, boxOf[firstConsumer], -1);
    } else {
      boxOf[i] = node.length;
      node.push(i);
      kind.push(distinct === 0 ? ALONE_BOX : SHARED_BOX);
    }
  }

  const count = node.length;
  const width = new Float64Array(count);
  for (let box = 0; box < count; box++) {
    width[box] = box < taskCount ? Math.max(1, aboveCount[box], belowCount[box]) * SLOT - NODE_GAP : NODE_SIZE;
  }

  // The links between boxes, each once, and the subtasks tree.
  const from = new Numbers();
  const to = new Numbers();
  const linked = new Set<number>();
  const link = (source: number, target: number) => {
    const key = source * count + target;
    if (source !== target && !linked.has(key)) {
      linked.add(key);
      from.push(source);
      to.push(target);
    }
  };
  const parent = new Int32Array(count).fill(-1);
  for (let i = 0; i < nodeCount; i++) {
    if (isTask[i]) {
      continue;
    }
    // A data links what produces it, or its own box, to what consumes it.
    const source = owner[i] !== -1 ? boxOf[owner[i]] : boxOf[i];
    if (source !== -1) {
      distinctConsumers(i, 1, task => link(source, boxOf[task]));
    }
    // The subtask goes below its parent, in the subtasks tree.
    if (fed[i] !== -1 && parentOf[i] !== -1) {
      const subtask = boxOf[fed[i]];
      const parentBox = boxOf[parentOf[i]];
      link(parentBox, subtask);
      if (parent[subtask] === -1 && parentBox !== subtask) {
        parent[subtask] = parentBox;
      }
    }
  }

  return {
    count,
    kind: Uint8Array.from(kind.values.subarray(0, count)),
    node: node.values.slice(0, count),
    width,
    parent,
    predecessors: lists(count, to.values, from.values, to.length),
    successors: lists(count, from.values, to.values, from.length),
    rowBox, rowSide, rowRank, aboveCount, belowCount,
  };
}

/**
 * The families the blocks follow: each task under its parent task; a shared data under the closest
 * family holding all its consumers, above them; the rest under the session, a virtual root whose
 * index is the number of boxes. Walked depth first from the root, in arrival order: a family's
 * children have consecutive `pre` indices, and a box's subtree spans `pre` to `post`.
 */
type Families = {
  root: number;
  parent: Int32Array;
  depth: Int32Array;
  children: Lists;
  pre: Int32Array;
  post: Int32Array;
  /** The boxes by `pre` index. */
  order: Int32Array;
};

function familiesOf(boxes: Boxes): Families {
  const { count, kind, successors } = boxes;
  const root = count;
  const parent = new Int32Array(count + 1).fill(-1);
  for (let box = 0; box < count; box++) {
    parent[box] = kind[box] === TASK_BOX && boxes.parent[box] !== -1 ? boxes.parent[box] : root;
  }
  // The depths of the tasks, for the closest common family of the consumers of a shared data.
  const depth = new Int32Array(count + 1).fill(-1);
  depth[root] = 0;
  // A cycle of parents, which a session cannot have, is cut: its first box goes under the root.
  const inChain = new Int32Array(count + 1).fill(-1);
  const depthOf = (box: number): number => {
    const chain = new Numbers();
    let current = box;
    while (depth[current] === -1) {
      if (inChain[current] === box) {
        parent[chain.values[chain.length - 1]] = root;
        break;
      }
      inChain[current] = box;
      chain.push(current);
      current = parent[current];
    }
    for (let k = chain.length - 1; k >= 0; k--) {
      depth[chain.values[k]] = depth[parent[chain.values[k]]] + 1;
    }
    return depth[box];
  };
  for (let box = 0; box < count; box++) {
    if (kind[box] === TASK_BOX) {
      depthOf(box);
    }
  }
  const common = (a: number, b: number): number => {
    while (depth[a] > depth[b]) {
      a = parent[a];
    }
    while (depth[b] > depth[a]) {
      b = parent[b];
    }
    while (a !== b) {
      a = parent[a];
      b = parent[b];
    }
    return a;
  };
  for (let box = 0; box < count; box++) {
    if (kind[box] !== SHARED_BOX) {
      continue;
    }
    let family = -1;
    let consumer = false;
    for (let k = successors.start[box]; k < successors.start[box + 1]; k++) {
      family = family === -1 ? successors.values[k] : common(family, successors.values[k]);
    }
    for (let k = successors.start[box]; k < successors.start[box + 1]; k++) {
      consumer ||= successors.values[k] === family;
    }
    // Above all its consumers: in the family of the one that holds the others.
    parent[box] = consumer ? parent[family] : family;
    depth[box] = depth[parent[box]] + 1;
  }

  const owners = new Int32Array(count);
  const members = new Int32Array(count);
  for (let box = 0; box < count; box++) {
    owners[box] = parent[box];
    members[box] = box;
  }
  const children = lists(count + 1, owners, members);
  const pre = new Int32Array(count + 1);
  const post = new Int32Array(count + 1);
  const order = new Int32Array(count + 1);
  const stack = new Numbers();
  const next = new Int32Array(count + 1);
  let visited = 0;
  stack.push(root);
  pre[root] = visited;
  order[visited++] = root;
  next[root] = children.start[root];
  while (stack.length !== 0) {
    const box = stack.values[stack.length - 1];
    if (next[box] < children.start[box + 1]) {
      const child = children.values[next[box]++];
      pre[child] = visited;
      order[visited++] = child;
      next[child] = children.start[child];
      stack.push(child);
    } else {
      post[box] = visited;
      stack.length--;
    }
  }
  return { root, parent, depth, children, pre, post, order };
}

/**
 * The layer of each box among its siblings: below the siblings whose subtrees produce what it
 * reads. An aggregation goes below the subtasks it gathers, wherever in their subtrees the data
 * was produced. A link within a subtree, or from a box to its own subtree, orders nothing here.
 */
function localLayers(boxes: Boxes, families: Families): { layer: Int32Array, before: Lists } {
  const { count, predecessors } = boxes;
  const { parent, depth } = families;
  const from = new Numbers();
  const to = new Numbers();
  for (let box = 0; box < count; box++) {
    for (let k = predecessors.start[box]; k < predecessors.start[box + 1]; k++) {
      // The siblings under which the two ends diverge, none when one holds the other.
      let a = predecessors.values[k];
      let b = box;
      while (depth[a] > depth[b]) {
        a = parent[a];
      }
      while (depth[b] > depth[a]) {
        b = parent[b];
      }
      if (a === b) {
        continue;
      }
      while (parent[a] !== parent[b]) {
        a = parent[a];
        b = parent[b];
      }
      from.push(a);
      to.push(b);
    }
  }
  const before = lists(count, to.values, from.values, to.length);
  const after = lists(count, from.values, to.values, from.length);
  // Longest path among siblings, in topological order. A cycle, which a session cannot have,
  // leaves boxes out: they go below what is placed of their siblings.
  const layer = new Int32Array(count);
  const pending = new Int32Array(count);
  const queue = new Int32Array(count);
  let queued = 0;
  const done = new Uint8Array(count);
  for (let box = 0; box < count; box++) {
    pending[box] = before.start[box + 1] - before.start[box];
    if (pending[box] === 0) {
      queue[queued++] = box;
    }
  }
  const settle = (box: number) => {
    done[box] = 1;
    for (let k = after.start[box]; k < after.start[box + 1]; k++) {
      const next = after.values[k];
      if (!done[next]) {
        layer[next] = Math.max(layer[next], layer[box] + 1);
        if (--pending[next] === 0) {
          queue[queued++] = next;
        }
      }
    }
  };
  for (let head = 0; head < queued; head++) {
    settle(queue[head]);
  }
  for (let box = 0; box < count; box++) {
    if (!done[box]) {
      settle(box);
    }
  }
  return { layer, before };
}

/**
 * Each box and its subtree as a block: the box on top, then the layers of its children, each a row
 * of their blocks, a wide row wrapped on several. The first layer is centred in the block, each
 * next one under what it reads; its children go in the order of what they read, or of their
 * arrival: an aggregation under the subtasks it gathers, the consumers of a data together under
 * it. Returns the centre and the row of each box.
 */
function placeBlocks(boxes: Boxes, families: Families, layer: Int32Array, before: Lists): { x: Float64Array, row: Int32Array } {
  const { count, width } = boxes;
  const { root, children, pre, order } = families;
  const blockWidth = new Float64Array(count + 1);
  const blockRows = new Int32Array(count + 1);
  // Where each block goes in its parent's, from its left and its top.
  const left = new Float64Array(count + 1);
  const top = new Int32Array(count + 1);
  const place = new Float64Array(count);
  const shelfOf = new Int32Array(count);

  // Children before their parents: the blocks of a family are sized before it is.
  for (let visit = count; visit >= 0; visit--) {
    const box = order[visit];
    const start = children.start[box];
    const end = children.start[box + 1];
    const own = box === root ? 0 : 1;
    if (start === end) {
      blockWidth[box] = width[box];
      blockRows[box] = own;
      continue;
    }
    // The children by layer, each layer in the order of what it reads.
    const family = Array.from(children.values.subarray(start, end));
    family.sort((a, b) => layer[a] - layer[b] || pre[a] - pre[b]);
    let rows = own;
    const shelves: { start: number, end: number, width: number, first: boolean }[] = [];
    let blockW = box === root ? 0 : width[box];
    for (let first = 0; first < family.length;) {
      let last = first;
      while (last < family.length && layer[family[last]] === layer[family[first]]) {
        last++;
      }
      const row = family.slice(first, last);
      if (first !== 0) {
        for (const child of row) {
          let sum = 0;
          let reads = 0;
          for (let k = before.start[child]; k < before.start[child + 1]; k++) {
            sum += place[before.values[k]];
            reads++;
          }
          place[child] = reads === 0 ? Infinity : sum / reads;
        }
        row.sort((a, b) => place[a] - place[b] || pre[a] - pre[b]);
      }
      // Wrapped when wide: about as wide as the screen is to its height.
      let area = 0;
      let widest = 0;
      for (const child of row) {
        area += (blockWidth[child] + NODE_GAP) * blockRows[child] * LAYER_STEP;
        widest = Math.max(widest, blockWidth[child]);
      }
      const target = row.length > WRAP_FROM ? Math.max(widest, Math.sqrt(ASPECT * area)) : Infinity;
      let cursor = 0;
      let shelfRows = 0;
      let shelfStart = 0;
      const closeShelf = (endIndex: number) => {
        shelves.push({ start: first + shelfStart, end: first + endIndex, width: cursor - NODE_GAP, first: first === 0 });
        blockW = Math.max(blockW, cursor - NODE_GAP);
        rows += shelfRows;
      };
      row.forEach((child, index) => {
        if (cursor !== 0 && cursor + blockWidth[child] > target) {
          closeShelf(index);
          cursor = 0;
          shelfRows = 0;
          shelfStart = index;
        }
        left[child] = cursor;
        top[child] = rows;
        shelfOf[child] = shelves.length;
        cursor += blockWidth[child] + NODE_GAP;
        shelfRows = Math.max(shelfRows, blockRows[child]);
      });
      closeShelf(row.length);
      // Where the next layer reads them from: their centres in the block, before the shelves are
      // centred, which does not change their order.
      for (let k = 0; k < row.length; k++) {
        family[first + k] = row[k];
        place[row[k]] = left[row[k]] + blockWidth[row[k]] / 2;
      }
      first = last;
    }
    // The first layer centred in the block, each next one under what it reads, within the block.
    for (const shelf of shelves) {
      let shift = (blockW - shelf.width) / 2;
      if (!shelf.first) {
        let sum = 0;
        let reads = 0;
        for (let k = shelf.start; k < shelf.end; k++) {
          const child = family[k];
          for (let read = before.start[child]; read < before.start[child + 1]; read++) {
            sum += left[before.values[read]] + blockWidth[before.values[read]] / 2;
            reads++;
          }
        }
        if (reads !== 0) {
          shift = Math.min(blockW - shelf.width, Math.max(0, sum / reads - shelf.width / 2));
        }
      }
      for (let k = shelf.start; k < shelf.end; k++) {
        left[family[k]] += shift;
      }
    }
    blockWidth[box] = blockW;
    blockRows[box] = rows;
  }

  // Parents before their children: from the root down, block offsets become positions.
  const x = new Float64Array(count);
  const row = new Int32Array(count);
  const blockLeft = new Float64Array(count + 1);
  const blockTop = new Int32Array(count + 1);
  for (let visit = 1; visit <= count; visit++) {
    const box = order[visit];
    const parentBox = families.parent[box];
    blockLeft[box] = blockLeft[parentBox] + left[box];
    blockTop[box] = blockTop[parentBox] + top[box];
    x[box] = blockLeft[box] + blockWidth[box] / 2;
    row[box] = blockTop[box];
  }
  return { x, row };
}

function positionsOf(input: LayoutInput, boxes: Boxes, row: Int32Array, x: Float64Array): Float64Array {
  const { kind, node, rowBox, rowSide, rowRank, aboveCount, belowCount } = boxes;
  const positions = new Float64Array(input.nodes.length * 2);
  for (let box = 0; box < boxes.count; box++) {
    // A shared data on the row of outputs, the closest to its consumers below.
    const y = row[box] * LAYER_STEP + (kind[box] === SHARED_BOX ? DATA_ROW_OFFSET : 0);
    positions[node[box] * 2] = x[box];
    positions[node[box] * 2 + 1] = y;
  }
  for (let data = 0; data < input.nodes.length; data++) {
    const box = rowBox[data];
    if (box === -1) {
      continue;
    }
    const inRow = rowSide[data] < 0 ? aboveCount[box] : belowCount[box];
    positions[data * 2] = x[box] + (rowRank[data] - (inRow - 1) / 2) * SLOT;
    positions[data * 2 + 1] = row[box] * LAYER_STEP + rowSide[data] * DATA_ROW_OFFSET;
  }
  return positions;
}

/** Appends `value` to the list of `key`, creating it on first use. */
export function push<T>(map: Map<string, T[]>, key: string, value: T) {
  const list = map.get(key);
  if (list) {
    list.push(value);
  } else {
    map.set(key, [value]);
  }
}
