module.exports = class ForceGraph {
  constructor(value) {}

  node = {
    x: 0,
    y: 0,
    type: 'task',
  };

  link = {
    type: 'taskResultLink',
  };

  ctx = {
    fillText: jest.fn(),
  };

  graphData = jest.fn(() => this);

  d3Force = jest.fn(() => this);

  dagMode = jest.fn(() => this);

  dagLevelDistance = jest.fn(() => this);

  nodeCanvasObject = jest.fn((fn) => {
    fn(this.node, this.ctx);
    return this;
  });

  linkColor = jest.fn((linkFn) => {
    linkFn(this.link);
    return this;
  });

  linkWidth = jest.fn(() => this);

  nodeLabel = jest.fn(() => this);

  onNodeClick = jest.fn((fn) => {
    fn(this.node);
    return this;
  });

  centerAt = jest.fn(() => this);
  zoom = jest.fn(() => this);

  width = jest.fn(() => this);
  height = jest.fn(() => this);

  linkDirectionalParticles = jest.fn(() => this);
  linkDirectionalParticleWidth = jest.fn(() => this);
}