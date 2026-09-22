class Chart {
  static register = jest.fn();

  /** Every chart ever built, destroyed ones included: specs reset it and count constructions. */
  static instances = [];

  constructor(canvas, config) {
    this.canvas = canvas;
    this.config = config;
    this.data = (config && config.data) || { labels: [], datasets: [{ data: [] }] };
    // The real Chart exposes its resolved options; code updates scales through them.
    this.options = (config && config.options) || {};
    this.update = jest.fn();
    this.destroy = jest.fn();
    this.resize = jest.fn();
    Chart.instances.push(this);
  }
}

module.exports = {
  Chart,
  BarController: class {},
  BarElement: class {},
  CategoryScale: class {},
  LinearScale: class {},
  LogarithmicScale: class {},
  Tooltip: class {},
  Legend: class {},
  registerables: [],
};
