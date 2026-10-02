// The scene every renderer draws: the graph of a running session, laid out as ELK does it, by
// layers of tasks with their data above and below them.

export const NODE_SIZE = 50;
export const STATUS_COLORS = ['#00ff00', '#ff0000', '#ffa500', '#2196f3'];
export const LINK_COLOR = '#6464ff';

/**
 * A tree of `tasks` tasks, 4 subtasks each: every task has a payload above it, fed by its parent,
 * and an output below it. `tick()` then plays 200 ms of a running session.
 */
export function createScene(tasks) {
  const nodes = [];
  const links = [];
  const byId = new Map();
  const depth = [];
  const perLayer = new Map();

  const addTask = (i, parent) => {
    const layer = parent === undefined ? 0 : depth[parent] + 1;
    depth[i] = layer;
    const column = perLayer.get(layer) ?? 0;
    perLayer.set(layer, column + 1);
    // A new task is put on its parent until the next layout, as the app does.
    const x = i < tasks ? column * 80 : byId.get(`t${parent}`).x;
    const y = i < tasks ? layer * 200 : byId.get(`t${parent}`).y;
    const added = [
      { id: `p${i}`, type: 'result', status: 0, x, y: y - 70 },
      { id: `t${i}`, type: 'task', status: 0, x, y },
      { id: `o${i}`, type: 'result', status: 0, x, y: y + 70 },
    ];
    const addedLinks = [
      { source: `p${i}`, target: `t${i}`, type: 'payload' },
      { source: `t${i}`, target: `o${i}`, type: 'output' },
    ];
    if (parent !== undefined) {
      addedLinks.push({ source: `t${parent}`, target: `p${i}`, type: 'parent' });
    }
    for (const node of added) {
      node.index = nodes.length;
      nodes.push(node);
      byId.set(node.id, node);
    }
    links.push(...addedLinks);
    return { nodes: added, links: addedLinks };
  };

  for (let i = 0; i < tasks; i++) {
    addTask(i, i === 0 ? undefined : Math.floor((i - 1) / 4));
  }
  let next = tasks;

  const bounds = () => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const node of nodes) {
      minX = Math.min(minX, node.x); maxX = Math.max(maxX, node.x);
      minY = Math.min(minY, node.y); maxY = Math.max(maxY, node.y);
    }
    return { minX, maxX, minY, maxY };
  };

  /** 200 ms of a running session: 50 status changes, and `grow` new tasks with their data. */
  const tick = grow => {
    const changed = [];
    for (let k = 0; k < 50; k++) {
      const node = byId.get(`o${Math.floor(Math.random() * next)}`);
      node.status = (node.status + 1) % STATUS_COLORS.length;
      changed.push(node);
    }
    const added = { nodes: [], links: [] };
    for (let k = 0; k < grow; k++) {
      const i = next++;
      const task = addTask(i, Math.floor(Math.random() * i));
      added.nodes.push(...task.nodes);
      added.links.push(...task.links);
    }
    return { changed, added };
  };

  return { nodes, links, byId, bounds, tick };
}

/** The view that fits the whole scene in a viewport, a margin of 40 pixels around it. */
export function fitView(scene, width, height) {
  const { minX, maxX, minY, maxY } = scene.bounds();
  return {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
    scale: Math.min((width - 80) / (maxX - minX || 1), (height - 80) / (maxY - minY || 1)),
  };
}

export function rgba(hex, alpha = 1) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [value >> 16 & 255, value >> 8 & 255, value & 255, Math.round(alpha * 255)];
}
