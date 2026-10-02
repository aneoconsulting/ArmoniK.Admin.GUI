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

  it('should put each task one layer below its deepest predecessor', () => {
    const session = new Session()
      .task('root')
      .task('child', { parent: 'root' })
      .task('grandchild', { parent: 'child' })
      // Depends on the root and on the grandchild: below the grandchild.
      .task('reduce', { inputs: ['root-out0', 'grandchild-out0'] });
    const coordinates = layOut(session.input());
    const y = (id: string) => coordinates.get(id)![1];

    expect(y('child')).toBeGreaterThan(y('root'));
    expect(y('grandchild')).toBeGreaterThan(y('child'));
    expect(y('reduce')).toBeGreaterThan(y('grandchild'));
    expect(y('reduce') - y('grandchild')).toEqual(y('grandchild') - y('child'));
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

  it('should keep side by side the tasks consuming a data the client uploaded, below it', () => {
    // Two families of subtasks; the shared data is consumed by one subtask of each.
    const session = new Session().data('shared').task('a').task('b');
    for (const parent of ['a', 'b']) {
      for (let child = 0; child < 4; child++) {
        session.task(`${parent}${child}`, { parent, inputs: child === 0 && parent === 'b' || child === 3 && parent === 'a' ? ['shared'] : [] });
      }
    }
    // And a task consuming it apart, in the same layer.
    session.task('c').task('c0', { parent: 'c', inputs: ['shared'] });
    const coordinates = layOut(session.input());
    const consumers = ['a3', 'b0', 'c0'];
    const row = layer(coordinates, session.nodes.filter((_, index) => session.types[index] === 'task'), coordinates.get('a3')![1]);
    const ranks = consumers.map(id => row.indexOf(id)).sort((a, b) => a - b);

    expect(ranks[2] - ranks[0]).toEqual(consumers.length - 1);
    expect(coordinates.get('shared')![1]).toBeLessThan(coordinates.get('a3')![1]);
    const xs = consumers.map(id => coordinates.get(id)![0]);
    expect(coordinates.get('shared')![0]).toBeGreaterThanOrEqual(Math.min(...xs));
    expect(coordinates.get('shared')![0]).toBeLessThanOrEqual(Math.max(...xs));
    expect(overlaps(coordinates)).toEqual([]);
  });

  it('should keep side by side the tasks consuming a same output', () => {
    const session = new Session().task('producer').task('x').task('y');
    session.task('x0', { parent: 'x', inputs: ['producer-out0'] }).task('x1', { parent: 'x' });
    session.task('y0', { parent: 'y' }).task('y1', { parent: 'y', inputs: ['producer-out0'] });
    const coordinates = layOut(session.input());
    const row = layer(coordinates, session.nodes.filter((_, index) => session.types[index] === 'task'), coordinates.get('x0')![1]);

    expect(Math.abs(row.indexOf('x0') - row.indexOf('y1'))).toEqual(1);
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
