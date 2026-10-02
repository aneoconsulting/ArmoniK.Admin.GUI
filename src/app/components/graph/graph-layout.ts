/**
 * Placement of a session graph, by layers as ELK's layered algorithm does it, but knowing what a
 * session graph is: tasks fed by data, mostly a tree of subtasks, close to planar. The worker runs
 * it, and the page shares its types.
 *
 * 1. Boxes: each task is a box holding its rows of data, a payload above it and its outputs below.
 *    A data shared by several tasks the client uploaded gets a box of its own.
 * 2. Layers: each task goes one layer below its deepest predecessor, each shared data one layer
 *    above its shallowest consumer.
 * 3. Order in the layers: the subtasks tree walked depth first gives an order without crossing for
 *    the tree, then barycenter sweeps move each box towards its neighbours, the consumers of a same
 *    data kept side by side, or not. The order with the fewest crossings is kept.
 * 4. Coordinates: each box as close as can be to its neighbours without overlapping the others,
 *    each parent centred over its children.
 *
 * Every step is linear in the size of the graph, or nearly, and nothing recurses: a graph of
 * hundreds of thousands of tasks must fit. Lists live in flat typed arrays, as offsets into one
 * array of values: an array per node is what made the garbage collector the slowest step.
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
/** Down and up sweeps of the crossing reduction: the first ones do most of the work. */
const ORDERING_SWEEPS = 4;
/** Down and up sweeps of the coordinates. */
const PLACEMENT_SWEEPS = 8;

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
  children: Lists;
  predecessors: Lists;
  successors: Lists;
  /** The tasks consuming a same data, as many lists: kept side by side. */
  groups: Lists;
  groupCount: number;
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
  const layer = assignLayers(boxes);
  const layers = orderLayers(boxes, layer);
  const x = placeBoxes(boxes, layers);
  return positionsOf(input, boxes, layer, x);
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
  const childOf = new Numbers();
  const child = new Numbers();
  const grouped = new Numbers();
  const member = new Numbers();
  let groupCount = 0;
  for (let i = 0; i < nodeCount; i++) {
    if (isTask[i]) {
      continue;
    }
    // A data links what produces it, or its own box, to what consumes it.
    const source = owner[i] !== -1 ? boxOf[owner[i]] : boxOf[i];
    const group = groupCount;
    const distinct = distinctConsumers(i, 1, task => {
      if (source !== -1) {
        link(source, boxOf[task]);
      }
      grouped.push(group);
      member.push(boxOf[task]);
    });
    if (distinct > 1) {
      groupCount++;
    } else {
      // Not a group: the member just pushed is taken back.
      grouped.length -= distinct;
      member.length -= distinct;
    }
    // The subtask goes below its parent, in the subtasks tree.
    if (fed[i] !== -1 && parentOf[i] !== -1) {
      const subtask = boxOf[fed[i]];
      const parentBox = boxOf[parentOf[i]];
      link(parentBox, subtask);
      if (parent[subtask] === -1 && parentBox !== subtask) {
        parent[subtask] = parentBox;
        childOf.push(parentBox);
        child.push(subtask);
      }
    }
  }

  return {
    count,
    kind: Uint8Array.from(kind.values.subarray(0, count)),
    node: node.values.slice(0, count),
    width,
    parent,
    children: lists(count, childOf.values, child.values, childOf.length),
    predecessors: lists(count, to.values, from.values, to.length),
    successors: lists(count, from.values, to.values, from.length),
    groups: lists(groupCount, grouped.values, member.values, grouped.length),
    groupCount,
    rowBox, rowSide, rowRank, aboveCount, belowCount,
  };
}

/**
 * Each task one layer below its deepest predecessor, in topological order. A cycle, which a
 * session cannot have, would leave tasks out: they go below what is placed of their predecessors.
 * A shared data goes one layer above its shallowest consumer: the whole graph moves down a layer
 * when that is above the first one.
 */
function assignLayers(boxes: Boxes): Int32Array {
  const { count, kind, predecessors, successors } = boxes;
  const layer = new Int32Array(count);
  const pending = new Int32Array(count);
  const queue = new Int32Array(count);
  let queued = 0;
  const done = new Uint8Array(count);
  for (let box = 0; box < count; box++) {
    if (kind[box] === TASK_BOX) {
      for (let k = predecessors.start[box]; k < predecessors.start[box + 1]; k++) {
        if (kind[predecessors.values[k]] === TASK_BOX) {
          pending[box]++;
        }
      }
      if (pending[box] === 0) {
        queue[queued++] = box;
      }
    }
  }
  const settle = (box: number) => {
    done[box] = 1;
    for (let k = successors.start[box]; k < successors.start[box + 1]; k++) {
      const successor = successors.values[k];
      if (kind[successor] === TASK_BOX && !done[successor]) {
        layer[successor] = Math.max(layer[successor], layer[box] + 1);
        if (--pending[successor] === 0) {
          queue[queued++] = successor;
        }
      }
    }
  };
  for (let head = 0; head < queued; head++) {
    settle(queue[head]);
  }
  for (let box = 0; box < count; box++) {
    if (kind[box] === TASK_BOX && !done[box]) {
      settle(box);
    }
  }

  let top = 0;
  for (let box = 0; box < count; box++) {
    if (kind[box] === SHARED_BOX) {
      let shallowest = Infinity;
      for (let k = successors.start[box]; k < successors.start[box + 1]; k++) {
        shallowest = Math.min(shallowest, layer[successors.values[k]]);
      }
      layer[box] = shallowest - 1;
      top = Math.min(top, layer[box]);
    }
  }
  if (top < 0) {
    for (let box = 0; box < count; box++) {
      if (kind[box] !== ALONE_BOX) {
        layer[box] -= top;
      }
    }
  }
  return layer;
}

/** The boxes of each layer, from left to right. */
function orderLayers(boxes: Boxes, layer: Int32Array): Int32Array[] {
  const { count, kind, children, parent, successors, predecessors, groups, groupCount, width } = boxes;
  let depth = 0;
  for (let box = 0; box < count; box++) {
    depth = Math.max(depth, layer[box] + 1);
  }

  // The subtasks tree, depth first from its roots in arrival order: its order has no crossing.
  const rank = new Float64Array(count).fill(-1);
  let next = 0;
  const stack = new Numbers();
  for (let root = 0; root < count; root++) {
    if (kind[root] !== TASK_BOX || parent[root] !== -1) {
      continue;
    }
    stack.push(root);
    while (stack.length !== 0) {
      const box = stack.values[--stack.length];
      if (rank[box] !== -1) {
        continue;
      }
      rank[box] = next++;
      for (let k = children.start[box + 1] - 1; k >= children.start[box]; k--) {
        stack.push(children.values[k]);
      }
    }
  }
  for (let box = 0; box < count; box++) {
    if (kind[box] === TASK_BOX && rank[box] === -1) {
      rank[box] = next++;
    }
  }
  // A shared data right before its first consumer, a data alone after everything.
  for (let box = 0; box < count; box++) {
    if (kind[box] === SHARED_BOX) {
      let first = Infinity;
      for (let k = successors.start[box]; k < successors.start[box + 1]; k++) {
        first = Math.min(first, rank[successors.values[k]]);
      }
      rank[box] = first - 0.5;
    } else if (kind[box] === ALONE_BOX) {
      rank[box] = next++;
    }
  }

  const sizes = new Int32Array(depth);
  for (let box = 0; box < count; box++) {
    sizes[layer[box]]++;
  }
  const layers = Array.from(sizes, size => new Int32Array(size));
  sizes.fill(0);
  for (let box = 0; box < count; box++) {
    layers[layer[box]][sizes[layer[box]]++] = box;
  }
  for (const boxesOfLayer of layers) {
    boxesOfLayer.sort((a, b) => rank[a] - rank[b]);
  }

  // The consumers of a same data, layer by layer, as one block: a union-find, whose root stands
  // for the block.
  const block = new Int32Array(count);
  for (let box = 0; box < count; box++) {
    block[box] = box;
  }
  const rootOf = (box: number): number => {
    let root = box;
    while (block[root] !== root) {
      root = block[root];
    }
    while (block[box] !== root) {
      const up = block[box];
      block[box] = root;
      box = up;
    }
    return root;
  };
  const firstOfLayer = new Int32Array(depth).fill(-1);
  for (let group = 0; group < groupCount; group++) {
    for (let k = groups.start[group]; k < groups.start[group + 1]; k++) {
      const memberBox = groups.values[k];
      const first = firstOfLayer[layer[memberBox]];
      if (first === -1) {
        firstOfLayer[layer[memberBox]] = memberBox;
      } else {
        block[rootOf(memberBox)] = rootOf(first);
      }
    }
    for (let k = groups.start[group]; k < groups.start[group + 1]; k++) {
      firstOfLayer[layer[groups.values[k]]] = -1;
    }
  }
  const blocks = new Int32Array(count);
  const alone = new Int32Array(count);
  for (let box = 0; box < count; box++) {
    blocks[box] = rootOf(box);
    alone[box] = box;
  }
  let blockOf = blocks;

  const x = new Float64Array(count);
  const position = new Int32Array(count);
  const pack = (boxesOfLayer: Int32Array) => packLayer(boxesOfLayer, width, x, position);

  const value = new Float64Array(count);
  const blockSum = new Float64Array(count);
  const blockSize = new Int32Array(count);
  const key = new Float64Array(count);
  const reorder = (boxesOfLayer: Int32Array, neighbours: Lists) => {
    for (const box of boxesOfLayer) {
      let sum = 0;
      for (let k = neighbours.start[box]; k < neighbours.start[box + 1]; k++) {
        sum += x[neighbours.values[k]];
      }
      const degree = neighbours.start[box + 1] - neighbours.start[box];
      value[box] = degree === 0 ? x[box] : sum / degree;
      blockSum[blockOf[box]] = 0;
      blockSize[blockOf[box]] = 0;
    }
    for (const box of boxesOfLayer) {
      blockSum[blockOf[box]] += value[box];
      blockSize[blockOf[box]]++;
    }
    for (const box of boxesOfLayer) {
      key[box] = blockSum[blockOf[box]] / blockSize[blockOf[box]];
    }
    // Ties keep the current order: siblings with the same parent stay as the tree put them.
    boxesOfLayer.sort((a, b) => key[a] - key[b] || blockOf[a] - blockOf[b] || value[a] - value[b] || position[a] - position[b]);
    pack(boxesOfLayer);
  };

  // The consumers of a data kept together cannot always go with their siblings too: when a data is
  // shared across families of subtasks, one of the two has to give. The sweeps run with the
  // blocks, then from the tree order again without them, and the order with the fewest crossings
  // wins, the blocks on a tie. In a planar graph, both agree.
  const initial = layers.map(boxesOfLayer => boxesOfLayer.slice());
  let best = initial;
  let fewest = Infinity;
  for (const grouping of [blocks, alone]) {
    blockOf = grouping;
    initial.forEach((boxesOfLayer, current) => layers[current].set(boxesOfLayer));
    layers.forEach(pack);
    let crossings = countCrossings(layers, successors, layer, position);
    for (let sweep = 0; sweep <= ORDERING_SWEEPS; sweep++) {
      if (crossings < fewest) {
        fewest = crossings;
        best = layers.map(boxesOfLayer => boxesOfLayer.slice());
      }
      if (sweep === ORDERING_SWEEPS || fewest === 0) {
        break;
      }
      for (let current = 1; current < depth; current++) {
        reorder(layers[current], predecessors);
      }
      for (let current = depth - 2; current >= 0; current--) {
        reorder(layers[current], successors);
      }
      crossings = countCrossings(layers, successors, layer, position);
    }
    if (fewest === 0) {
      break;
    }
  }
  return best;
}

/** Side by side from left to right, the layer centred on 0. */
function packLayer(boxesOfLayer: Int32Array, width: Float64Array, x: Float64Array, position: Int32Array) {
  let total = -NODE_GAP;
  for (const box of boxesOfLayer) {
    total += width[box] + NODE_GAP;
  }
  let left = -total / 2;
  for (let i = 0; i < boxesOfLayer.length; i++) {
    const box = boxesOfLayer[i];
    x[box] = left + width[box] / 2;
    left += width[box] + NODE_GAP;
    position[box] = i;
  }
}

/**
 * Crossings of the links between consecutive layers, counted as inversions: sorted by their upper
 * end, a link crosses each earlier one whose lower end is to its right. A Fenwick tree over the
 * lower layer counts them.
 */
function countCrossings(layers: Int32Array[], successors: Lists, layer: Int32Array, position: Int32Array): number {
  let crossings = 0;
  const ends = new Numbers();
  for (let current = 0; current + 1 < layers.length; current++) {
    ends.length = 0;
    for (const box of layers[current]) {
      const start = ends.length;
      for (let k = successors.start[box]; k < successors.start[box + 1]; k++) {
        const successor = successors.values[k];
        if (layer[successor] === current + 1) {
          ends.push(position[successor]);
        }
      }
      ends.values.subarray(start, ends.length).sort();
    }
    const size = layers[current + 1].length;
    const tree = new Int32Array(size + 1);
    for (let seen = 0; seen < ends.length; seen++) {
      const end = ends.values[seen];
      let notRightOf = 0;
      for (let i = end + 1; i > 0; i -= i & -i) {
        notRightOf += tree[i];
      }
      crossings += seen - notRightOf;
      for (let i = end + 1; i <= size; i += i & -i) {
        tree[i]++;
      }
    }
  }
  return crossings;
}

/**
 * Each box moved towards its neighbours above, then below, a few times over, ending upwards: each
 * parent centred over its children, as a tree is best read. In a layer, the boxes keep their order
 * and their spacing: of the positions that do, the one closest to where the neighbours pull them.
 */
function placeBoxes(boxes: Boxes, layers: Int32Array[]): Float64Array {
  const { count, width, predecessors, successors } = boxes;
  const x = new Float64Array(count);
  const position = new Int32Array(count);
  layers.forEach(boxesOfLayer => packLayer(boxesOfLayer, width, x, position));
  const desired = new Float64Array(count);
  const pull = (boxesOfLayer: Int32Array, neighbours: Lists) => {
    for (const box of boxesOfLayer) {
      const degree = neighbours.start[box + 1] - neighbours.start[box];
      let sum = 0;
      for (let k = neighbours.start[box]; k < neighbours.start[box + 1]; k++) {
        sum += x[neighbours.values[k]];
      }
      desired[box] = degree === 0 ? x[box] : sum / degree;
    }
    placeLayer(boxesOfLayer, width, x, desired);
  };
  for (let sweep = 0; sweep < PLACEMENT_SWEEPS; sweep++) {
    for (let current = 1; current < layers.length; current++) {
      pull(layers[current], predecessors);
    }
    for (let current = layers.length - 2; current >= 0; current--) {
      pull(layers[current], successors);
    }
  }
  return x;
}

/**
 * Isotonic regression, by pooling adjacent violators: the x closest to `desired`, Σ (x - desired)²
 * least, under x[i+1] - x[i] at least their half widths and a gap. Offsets take the spacing out:
 * what is left only has to be in order.
 */
function placeLayer(boxesOfLayer: Int32Array, width: Float64Array, x: Float64Array, desired: Float64Array) {
  const size = boxesOfLayer.length;
  if (size === 0) {
    return;
  }
  const offset = new Float64Array(size);
  for (let i = 1; i < size; i++) {
    offset[i] = offset[i - 1] + (width[boxesOfLayer[i - 1]] + width[boxesOfLayer[i]]) / 2 + NODE_GAP;
  }
  const blockMean = new Float64Array(size);
  const blockCount = new Int32Array(size);
  let blocks = 0;
  for (let i = 0; i < size; i++) {
    let mean = desired[boxesOfLayer[i]] - offset[i];
    let members = 1;
    while (blocks !== 0 && blockMean[blocks - 1] > mean) {
      blocks--;
      mean = (blockMean[blocks] * blockCount[blocks] + mean * members) / (blockCount[blocks] + members);
      members += blockCount[blocks];
    }
    blockMean[blocks] = mean;
    blockCount[blocks] = members;
    blocks++;
  }
  let i = 0;
  for (let block = 0; block < blocks; block++) {
    for (let member = 0; member < blockCount[block]; member++, i++) {
      x[boxesOfLayer[i]] = blockMean[block] + offset[i];
    }
  }
}

function positionsOf(input: LayoutInput, boxes: Boxes, layer: Int32Array, x: Float64Array): Float64Array {
  const { kind, node, rowBox, rowSide, rowRank, aboveCount, belowCount } = boxes;
  const positions = new Float64Array(input.nodes.length * 2);
  for (let box = 0; box < boxes.count; box++) {
    // A shared data on the row of outputs, the closest to its consumers below.
    const y = layer[box] * LAYER_STEP + (kind[box] === SHARED_BOX ? DATA_ROW_OFFSET : 0);
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
    positions[data * 2 + 1] = layer[box] * LAYER_STEP + rowSide[data] * DATA_ROW_OFFSET;
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
