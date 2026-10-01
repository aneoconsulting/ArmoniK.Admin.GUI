// Every method of the chainable force-graph API: a mock returning the instance, created on first use.
module.exports = class ForceGraph {
  constructor() {
    const methods = new Map();
    const instance = new Proxy(this, {
      get: (target, property) => {
        if (property in target || typeof property === 'symbol') {
          return target[property];
        }
        if (!methods.has(property)) {
          methods.set(property, jest.fn(() => instance));
        }
        return methods.get(property);
      },
    });
    return instance;
  }
};
