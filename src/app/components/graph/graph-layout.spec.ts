import { LayoutInput, NODE_SIZE, prepareLayout } from './graph-layout';

describe('graph layout', () => {
  // parent → payload-child → child → output-child, and parent → output-parent → child
  const input: LayoutInput = {
    nodes: ['payload-parent', 'parent', 'output-parent', 'payload-child', 'child', 'output-child'],
    types: ['result', 'task', 'result', 'result', 'task', 'result'],
    links: [
      { source: 'payload-parent', target: 'parent', type: 'payload' },
      { source: 'parent', target: 'output-parent', type: 'output' },
      { source: 'parent', target: 'payload-child', type: 'parent' },
      { source: 'payload-child', target: 'child', type: 'payload' },
      { source: 'output-parent', target: 'child', type: 'dependency' },
      { source: 'child', target: 'output-child', type: 'output' },
    ],
  };

  describe('prepareLayout', () => {
    it('should keep the tasks only, linked when one feeds the other', () => {
      const { graph } = prepareLayout(input);

      expect(graph.ids).toEqual(['parent', 'child']);
      expect(graph.links).toEqual([{ source: 'parent', target: 'child' }]);
    });

    it('should put a payload above its task and an output below its owner', () => {
      const prepared = prepareLayout(input);
      const coordinates = prepared.placeData(new Map([['parent', [0, 0]], ['child', [0, 500]]]));

      expect(coordinates.get('payload-child')![1]).toBeLessThan(500);
      expect(coordinates.get('output-child')![1]).toBeGreaterThan(500);
      expect(coordinates.get('output-parent')![1]).toBeGreaterThan(0);
      expect(coordinates.get('payload-parent')![1]).toBeLessThan(0);
    });

    it('should make a task as wide as its widest row of data', () => {
      const { graph } = prepareLayout({
        nodes: ['task', 'a', 'b', 'c'],
        types: ['task', 'result', 'result', 'result'],
        links: ['a', 'b', 'c'].map(output => ({ source: 'task', target: output, type: 'output' })),
      });

      expect(graph.widths.get('task')).toBeGreaterThanOrEqual(3 * NODE_SIZE);
    });

    it('should keep a data linked to no task as a node of its own', () => {
      const { graph } = prepareLayout({ nodes: ['alone'], types: ['result'], links: [] });

      expect(graph.ids).toEqual(['alone']);
    });
  });
});
