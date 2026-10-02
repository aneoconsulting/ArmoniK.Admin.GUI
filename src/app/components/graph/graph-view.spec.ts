import { Camera, NodeGrid } from './graph-view';

describe('Camera', () => {
  let camera: Camera;

  beforeEach(() => {
    camera = new Camera();
    camera.resize(1000, 600);
  });

  it('should put the point it looks at in the middle of the viewport', () => {
    camera.x = 100;
    camera.y = 50;
    camera.scale = 2;

    expect(camera.toScreen(100, 50)).toEqual([500, 300]);
    expect(camera.toGraph(500, 300)).toEqual([100, 50]);
    expect(camera.toGraph(...camera.toScreen(130, -20))).toEqual([130, -20]);
  });

  it('should move the graph with the pointer that drags it', () => {
    camera.scale = 2;
    const [x, y] = camera.toScreen(10, 10);

    camera.pan(40, -20);

    expect(camera.toScreen(10, 10)).toEqual([x + 40, y - 20]);
  });

  it('should zoom towards the pointer, the point under it staying under it', () => {
    const before = camera.toGraph(800, 100);

    camera.zoomAt(800, 100, 3);

    expect(camera.scale).toEqual(3);
    const after = camera.toGraph(800, 100);
    expect(after[0]).toBeCloseTo(before[0]);
    expect(after[1]).toBeCloseTo(before[1]);
  });

  it('should fit a graph however wide, a margin around it', () => {
    camera.fit(0, 455000, 0, 4000, 40, 1);

    expect(camera.x).toEqual(227500);
    expect(camera.scale).toBeCloseTo(920 / 455000);
    const [left] = camera.toScreen(0, 0);
    expect(left).toBeCloseTo(40);
  });

  it('should not zoom in past the given scale to fit a small graph', () => {
    camera.fit(0, 50, 0, 50, 40, 1);

    expect(camera.scale).toEqual(1);
  });
});

describe('NodeGrid', () => {
  // Three nodes on a row, a far one, then a wide gap.
  const positions = Float32Array.from([0, 0, 80, 0, 160, 0, 100000, 500]);

  it('should find the node under a point', () => {
    const grid = new NodeGrid(positions, 4, 50);

    expect(grid.nearest(85, 5, 25)).toEqual(1);
    expect(grid.nearest(100010, 490, 25)).toEqual(3);
  });

  it('should find nothing away from the nodes', () => {
    const grid = new NodeGrid(positions, 4, 50);

    expect(grid.nearest(40, 300, 25)).toEqual(-1);
  });

  it('should take the closest of nodes within reach', () => {
    const grid = new NodeGrid(positions, 4, 50);

    expect(grid.nearest(50, 0, 60)).toEqual(1);
  });

  it('should hold an empty graph', () => {
    expect(new NodeGrid(new Float32Array(0), 0, 50).nearest(0, 0, 10)).toEqual(-1);
  });

  it('should not make a cell for every few pixels of a very wide graph', () => {
    const count = 10000;
    const wide = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      wide[i * 2] = i * 80;
    }
    const grid = new NodeGrid(wide, count, 50);

    expect(grid.nearest(5000 * 80 + 3, 2, 25)).toEqual(5000);
  });
});
