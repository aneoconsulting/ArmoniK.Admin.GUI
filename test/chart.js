class Chart {
  static register = jest.fn();

  static instances = [];

  constructor(canvas, config) {
    this.canvas = canvas;
    this.config = config;
    this.data = (config && config.data) || { labels: [], datasets: [{ data: [] }] };
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
  Tooltip: class {},
  Legend: class {},
  registerables: [],
};
