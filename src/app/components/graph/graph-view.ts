/**
 * What the graph renderer needs besides drawing: where the view looks, and which node is under the
 * pointer. Nothing here touches WebGL, so that it can be tested.
 */

/**
 * The view on the graph: the point of the graph at the centre of the viewport, and the pixels a
 * graph unit spans. Pixels here are CSS pixels; the renderer multiplies by the device pixel ratio.
 */
export class Camera {
  x = 0;
  y = 0;
  scale = 1;
  width = 1;
  height = 1;

  resize(width: number, height: number): void {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
  }

  toScreen(x: number, y: number): [number, number] {
    return [(x - this.x) * this.scale + this.width / 2, (y - this.y) * this.scale + this.height / 2];
  }

  toGraph(x: number, y: number): [number, number] {
    return [(x - this.width / 2) / this.scale + this.x, (y - this.height / 2) / this.scale + this.y];
  }

  /** Moves the view by a drag of `dx`, `dy` pixels: the graph follows the pointer. */
  pan(dx: number, dy: number): void {
    this.x -= dx / this.scale;
    this.y -= dy / this.scale;
  }

  /** Zooms by `factor`, the point under the pointer staying under it. */
  zoomAt(screenX: number, screenY: number, factor: number): void {
    const [x, y] = this.toGraph(screenX, screenY);
    this.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, this.scale * factor));
    const [after, afterY] = this.toGraph(screenX, screenY);
    this.x += x - after;
    this.y += y - afterY;
  }

  /** The box in the view, `padding` pixels around it, zoomed in no further than `maxScale`. */
  fit(minX: number, maxX: number, minY: number, maxY: number, padding: number, maxScale: number): void {
    this.x = (minX + maxX) / 2;
    this.y = (minY + maxY) / 2;
    const scaleX = (this.width - 2 * padding) / Math.max(1, maxX - minX);
    const scaleY = (this.height - 2 * padding) / Math.max(1, maxY - minY);
    this.scale = Math.max(MIN_SCALE, Math.min(maxScale, scaleX, scaleY));
  }
}

/** However large the graph, a view can fit it… */
const MIN_SCALE = 1e-5;
/** …and zoom in until a node fills the screen. */
const MAX_SCALE = 50;

/**
 * The nodes by cell of a uniform grid over the graph, to find the one under the pointer without
 * reading pixels back from the GPU, which stalls it. Built in linear time, from flat arrays.
 */
export class NodeGrid {
  private cellSize = 1;
  private minX = 0;
  private minY = 0;
  private columns = 1;
  private rows = 1;
  private start = new Int32Array(2);
  private nodes = new Int32Array(0);

  constructor(private readonly positions: Float32Array, private readonly count: number, cellSize: number) {
    if (count === 0) {
      return;
    }
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < count; i++) {
      minX = Math.min(minX, positions[i * 2]);
      maxX = Math.max(maxX, positions[i * 2]);
      minY = Math.min(minY, positions[i * 2 + 1]);
      maxY = Math.max(maxY, positions[i * 2 + 1]);
    }
    // No more cells than nodes: a very wide graph gets wider cells, not millions of empty ones.
    const area = Math.max(1, (maxX - minX) * (maxY - minY));
    this.cellSize = Math.max(cellSize, Math.sqrt(area / count));
    this.minX = minX;
    this.minY = minY;
    this.columns = Math.floor((maxX - minX) / this.cellSize) + 1;
    this.rows = Math.floor((maxY - minY) / this.cellSize) + 1;
    const cells = this.columns * this.rows;
    const cellOf = new Int32Array(count);
    this.start = new Int32Array(cells + 1);
    for (let i = 0; i < count; i++) {
      cellOf[i] = this.cell(positions[i * 2], positions[i * 2 + 1]);
      this.start[cellOf[i] + 1]++;
    }
    for (let cell = 0; cell < cells; cell++) {
      this.start[cell + 1] += this.start[cell];
    }
    const next = this.start.slice(0, cells);
    this.nodes = new Int32Array(count);
    for (let i = 0; i < count; i++) {
      this.nodes[next[cellOf[i]]++] = i;
    }
  }

  private cell(x: number, y: number): number {
    const column = Math.min(this.columns - 1, Math.max(0, Math.floor((x - this.minX) / this.cellSize)));
    const row = Math.min(this.rows - 1, Math.max(0, Math.floor((y - this.minY) / this.cellSize)));
    return row * this.columns + column;
  }

  /** The node closest to `x`, `y` within `radius`, -1 for none. */
  nearest(x: number, y: number, radius: number): number {
    if (this.count === 0) {
      return -1;
    }
    let best = -1;
    let bestDistance = radius * radius;
    const reach = Math.ceil(radius / this.cellSize);
    const column = Math.floor((x - this.minX) / this.cellSize);
    const row = Math.floor((y - this.minY) / this.cellSize);
    for (let r = Math.max(0, row - reach); r <= Math.min(this.rows - 1, row + reach); r++) {
      for (let c = Math.max(0, column - reach); c <= Math.min(this.columns - 1, column + reach); c++) {
        const cell = r * this.columns + c;
        for (let k = this.start[cell]; k < this.start[cell + 1]; k++) {
          const node = this.nodes[k];
          const dx = this.positions[node * 2] - x;
          const dy = this.positions[node * 2 + 1] - y;
          const distance = dx * dx + dy * dy;
          if (distance <= bestDistance) {
            bestDistance = distance;
            best = node;
          }
        }
      }
    }
    return best;
  }
}
