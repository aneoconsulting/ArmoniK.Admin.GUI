// The real factory relies on `import.meta`, which the CommonJS test build rejects.
module.exports = {
  createLayoutWorker: jest.fn(),
};
