// force-graph as main uses it: no simulation, nodes painted on a canvas, the whole data given
// again on a change of structure, the painter set again to redraw on a change of status.
import ForceGraph from 'force-graph';
import { LINK_COLOR, NODE_SIZE, STATUS_COLORS, fitView } from '../scene.js';

export function forceGraphRenderer(container, scene, width, height, onFrame) {
  for (const node of scene.nodes) {
    node.fx = node.x;
    node.fy = node.y;
  }
  const paint = (node, ctx) => {
    ctx.fillStyle = STATUS_COLORS[node.status];
    if (node.type === 'task') {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_SIZE / 2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillRect(node.x - NODE_SIZE / 2, node.y - NODE_SIZE / 3, NODE_SIZE, NODE_SIZE * 2 / 3);
    }
  };
  let frameStart = 0;
  const graph = new ForceGraph(container)
    .width(width).height(height)
    .d3Force('charge', null).d3Force('link', null).d3Force('center', null)
    .cooldownTicks(0)
    .nodeRelSize(NODE_SIZE / 2)
    .nodeCanvasObject(paint)
    .linkColor(() => `${LINK_COLOR}4d`)
    .onRenderFramePre(() => (frameStart = performance.now()))
    .onRenderFramePost(() => onFrame(performance.now() - frameStart));
  graph.graphData({ nodes: [...scene.nodes], links: [...scene.links] });
  const view = fitView(scene, width, height);
  graph.centerAt(view.x, view.y).zoom(view.scale);

  return {
    /** Draws asynchronously, in its own loop: its draws are reported through onFrame. */
    asyncDraw: true,
    apply({ added }) {
      for (const node of added.nodes) {
        node.fx = node.x;
        node.fy = node.y;
      }
      if (added.nodes.length !== 0) {
        graph.graphData({ nodes: [...scene.nodes], links: [...scene.links] });
      }
      graph.nodeCanvasObject(paint);
    },
    pan(dx) {
      view.x += dx / view.scale;
      graph.centerAt(view.x, view.y);
    },
    destroy() {
      graph._destructor();
    },
  };
}
