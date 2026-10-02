import { Coordinates, LayoutInput, LayoutLink, NODE_GAP, NODE_SIZE, layOut as layOutPositions } from './graph-layout';

/** The positions, by node id. */
function layOut(input: LayoutInput): Coordinates {
  const positions = layOutPositions(input);
  return new Map(input.nodes.map((id, index) => [id, [positions[index * 2], positions[index * 2 + 1]]]));
}

/** A session as the events describe it: tasks with a payload, a parent, inputs and outputs. */
class Session {
  readonly nodes: string[] = [];
  readonly types: string[] = [];
  readonly links: LayoutLink[] = [];

  data(id: string): this {
    this.nodes.push(id);
    this.types.push('result');
    return this;
  }

  /** A task, its payload, and its outputs `<id>-out<n>`. Its parent feeds its payload. */
  task(id: string, { parent, inputs = [], outputs = 1 }: { parent?: string, inputs?: string[], outputs?: number } = {}): this {
    this.nodes.push(id);
    this.types.push('task');
    this.data(`${id}-payload`);
    this.links.push({ source: `${id}-payload`, target: id, type: 'payload' });
    if (parent) {
      this.links.push({ source: parent, target: `${id}-payload`, type: 'parent' });
    }
    for (const input of inputs) {
      this.links.push({ source: input, target: id, type: 'dependency' });
    }
    for (let output = 0; output < outputs; output++) {
      this.data(`${id}-out${output}`);
      this.links.push({ source: id, target: `${id}-out${output}`, type: 'output' });
    }
    return this;
  }

  input(): LayoutInput {
    return { nodes: this.nodes, types: this.types, links: this.links };
  }
}

/** The tasks of a layer, from left to right. */
function layer(coordinates: Coordinates, tasks: string[], y: number): string[] {
  return tasks.filter(id => coordinates.get(id)![1] === y).sort((a, b) => coordinates.get(a)![0] - coordinates.get(b)![0]);
}

/** Two nodes on a same row closer than a node and a gap. */
function overlaps(coordinates: Coordinates): [string, string][] {
  const rows = new Map<number, [string, number][]>();
  for (const [id, [x, y]] of coordinates) {
    rows.set(y, [...(rows.get(y) ?? []), [id, x]]);
  }
  const found: [string, string][] = [];
  for (const row of rows.values()) {
    row.sort((a, b) => a[1] - b[1]);
    for (let i = 1; i < row.length; i++) {
      if (row[i][1] - row[i - 1][1] < NODE_SIZE + NODE_GAP - 1e-6) {
        found.push([row[i - 1][0], row[i][0]]);
      }
    }
  }
  return found;
}

describe('layOut', () => {
  it('should put a payload above its task and its outputs below it', () => {
    const coordinates = layOut(new Session().task('task', { outputs: 2 }).input());
    const [, y] = coordinates.get('task')!;

    expect(coordinates.get('task-payload')![1]).toBeLessThan(y);
    expect(coordinates.get('task-out0')![1]).toBeGreaterThan(y);
    expect(coordinates.get('task-out1')![1]).toEqual(coordinates.get('task-out0')![1]);
  });

  it('should put a task below the subtrees of the siblings it reads', () => {
    const session = new Session()
      .task('root')
      .task('child', { parent: 'root' })
      .task('grandchild', { parent: 'child' })
      // Reads the root and the grandchild: below the whole subtree of the root.
      .task('reduce', { inputs: ['root-out0', 'grandchild-out0'] });
    const coordinates = layOut(session.input());
    const y = (id: string) => coordinates.get(id)![1];

    expect(y('child')).toBeGreaterThan(y('root'));
    expect(y('grandchild')).toBeGreaterThan(y('child'));
    expect(y('reduce')).toBeGreaterThan(y('grandchild'));
    expect(y('reduce') - y('grandchild')).toEqual(y('grandchild') - y('child'));
  });

  it('should keep each aggregation under the subtasks it gathers, in their family', () => {
    // A recursive map-reduce: root submits m0 to m3 and r, which gathers their outputs; m0 submits
    // m00, m01 and r0, which gathers theirs and takes over the output of m0.
    const session = new Session().task('root');
    session.task('m0', { parent: 'root', outputs: 0 }).data('m0-out0');
    for (let index = 1; index < 4; index++) {
      session.task(`m${index}`, { parent: 'root' });
    }
    session.task('m00', { parent: 'm0' }).task('m01', { parent: 'm0' });
    session.task('r0', { parent: 'm0', inputs: ['m00-out0', 'm01-out0'], outputs: 0 });
    session.links.push({ source: 'r0', target: 'm0-out0', type: 'output' });
    session.task('r', { parent: 'root', inputs: ['m0-out0', 'm1-out0', 'm2-out0', 'm3-out0'] });
    const coordinates = layOut(session.input());
    const x = (id: string) => coordinates.get(id)![0];
    const y = (id: string) => coordinates.get(id)![1];

    expect(y('r0')).toBeGreaterThan(y('m00'));
    expect(y('r')).toBeGreaterThan(y('r0'));
    // r0 under m00 and m01, close to m0; r under m0 to m3.
    expect(x('r0')).toBeGreaterThanOrEqual(Math.min(x('m00'), x('m01')));
    expect(x('r0')).toBeLessThanOrEqual(Math.max(x('m00'), x('m01')));
    expect(Math.abs(x('r0') - x('m0'))).toBeLessThan(2 * (NODE_SIZE + NODE_GAP));
    expect(x('r')).toBeGreaterThan(Math.min(x('m0'), x('m3')));
    expect(x('r')).toBeLessThan(Math.max(x('m0'), x('m3')));
    expect(overlaps(coordinates)).toEqual([]);
  });

  it('should lay a tree of subtasks out without crossing, each parent above its children', () => {
    const session = new Session().task('root');
    const tasks = ['root'];
    const parents = new Map<string, string>();
    let level = ['root'];
    for (let depth = 0; depth < 3; depth++) {
      const next: string[] = [];
      for (const parent of level) {
        for (let child = 0; child < 3; child++) {
          const id = `${parent}.${child}`;
          session.task(id, { parent });
          parents.set(id, parent);
          tasks.push(id);
          next.push(id);
        }
      }
      level = next;
    }
    const coordinates = layOut(session.input());
    const ys = [...new Set(tasks.map(id => coordinates.get(id)![1]))].sort((a, b) => a - b);

    expect(overlaps(coordinates)).toEqual([]);
    for (let i = 1; i < ys.length; i++) {
      const upper = layer(coordinates, tasks, ys[i - 1]);
      const lower = layer(coordinates, tasks, ys[i]);
      // In order of their parents: no link between the two layers crosses another.
      const parentRanks = lower.map(id => upper.indexOf(parents.get(id)!));
      expect(parentRanks).toEqual([...parentRanks].sort((a, b) => a - b));
      // Each parent between its first and its last child.
      for (const parent of upper) {
        const children = lower.filter(id => parents.get(id) === parent).map(id => coordinates.get(id)![0]);
        expect(coordinates.get(parent)![0]).toBeGreaterThanOrEqual(Math.min(...children));
        expect(coordinates.get(parent)![0]).toBeLessThanOrEqual(Math.max(...children));
      }
    }
  });

  it('should keep side by side, below it, the subtasks reading a data the client uploaded', () => {
    const session = new Session().data('shared').task('parent');
    for (let child = 0; child < 6; child++) {
      session.task(`child${child}`, { parent: 'parent', inputs: child % 2 === 1 ? ['shared'] : [] });
    }
    const coordinates = layOut(session.input());
    const consumers = ['child1', 'child3', 'child5'];
    const row = layer(coordinates, session.nodes.filter((_, index) => session.types[index] === 'task'), coordinates.get('child1')![1]);
    const ranks = consumers.map(id => row.indexOf(id)).sort((a, b) => a - b);

    expect(ranks[2] - ranks[0]).toEqual(consumers.length - 1);
    expect(coordinates.get('shared')![1]).toBeLessThan(coordinates.get('child1')![1]);
    const xs = consumers.map(id => coordinates.get(id)![0]);
    expect(coordinates.get('shared')![0]).toBeGreaterThanOrEqual(Math.min(...xs));
    expect(coordinates.get('shared')![0]).toBeLessThanOrEqual(Math.max(...xs));
    expect(overlaps(coordinates)).toEqual([]);
  });

  it('should keep side by side, below it, the siblings reading a same output', () => {
    const session = new Session().task('parent').task('producer', { parent: 'parent' }).task('other', { parent: 'parent' });
    session.task('first', { parent: 'parent', inputs: ['producer-out0'] }).task('second', { parent: 'parent', inputs: ['producer-out0'] });
    const coordinates = layOut(session.input());
    const row = layer(coordinates, session.nodes.filter((_, index) => session.types[index] === 'task'), coordinates.get('first')![1]);

    expect(coordinates.get('first')![1]).toBeGreaterThan(coordinates.get('producer')![1]);
    expect(Math.abs(row.indexOf('first') - row.indexOf('second'))).toEqual(1);
  });

  it('should wrap a family of thousands of subtasks to about the proportions of a screen', () => {
    const session = new Session().task('parent');
    for (let child = 0; child < 2000; child++) {
      session.task(`child${child}`, { parent: 'parent' });
    }
    const coordinates = layOut(session.input());
    const children = [...coordinates].filter(([id]) => /^child\d+$/.test(id)).map(([, position]) => position);
    const width = Math.max(...children.map(([x]) => x)) - Math.min(...children.map(([x]) => x));
    const height = Math.max(...children.map(([, y]) => y)) - Math.min(...children.map(([, y]) => y));

    expect(width / height).toBeGreaterThan(0.5);
    expect(width / height).toBeLessThan(4);
    expect(overlaps(coordinates)).toEqual([]);
  });

  it('should lay independent tasks out in a grid', () => {
    const session = new Session();
    for (let task = 0; task < 1000; task++) {
      session.task(`task${task}`);
    }
    const coordinates = layOut(session.input());
    const rows = new Set(Array.from({ length: 1000 }, (_, task) => coordinates.get(`task${task}`)![1]));

    expect(rows.size).toBeGreaterThan(5);
    expect(overlaps(coordinates)).toEqual([]);
  });

  it('should make a task as wide as its widest row of data', () => {
    const coordinates = layOut(new Session().task('wide', { outputs: 3 }).task('next').input());

    expect(overlaps(coordinates)).toEqual([]);
  });

  it('should keep a data linked to no task', () => {
    const coordinates = layOut({ nodes: ['alone'], types: ['result'], links: [] });

    expect(coordinates.get('alone')).toBeDefined();
  });

  it('should place a data shared by more consumers than a call takes arguments', () => {
    // Spread into a call, 200000 of them overflow the stack.
    const consumers = Array.from({ length: 200000 }, (_, index) => `task-${index}`);
    const coordinates = layOut({
      nodes: ['input', ...consumers],
      types: ['result', ...consumers.map(() => 'task')],
      links: consumers.map(consumer => ({ source: 'input', target: consumer, type: 'dependency' })),
    });

    expect(coordinates.get('input')![1]).toBeLessThan(coordinates.get('task-0')![1]);
  });

  it('should lay out a chain of subtasks tens of thousands long without recursion', () => {
    const session = new Session().task('task-0');
    for (let index = 1; index < 50000; index++) {
      session.task(`task-${index}`, { parent: `task-${index - 1}` });
    }
    const coordinates = layOut(session.input());

    expect(coordinates.get('task-49999')![1]).toBeGreaterThan(coordinates.get('task-0')![1]);
  });

  it('should still place tasks caught in a cycle', () => {
    const coordinates = layOut({
      nodes: ['a', 'b', 'a-out', 'b-out'],
      types: ['task', 'task', 'result', 'result'],
      links: [
        { source: 'a', target: 'a-out', type: 'output' },
        { source: 'a-out', target: 'b', type: 'dependency' },
        { source: 'b', target: 'b-out', type: 'output' },
        { source: 'b-out', target: 'a', type: 'dependency' },
      ],
    });

    expect(coordinates.get('a')).toBeDefined();
    expect(coordinates.get('b')).toBeDefined();
  });
});
