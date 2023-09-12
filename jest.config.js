const { TextDecoder, TextEncoder } = require('util');

module.exports = {
  globals: {
    TextDecoder: TextDecoder,
    TextEncoder: TextEncoder,
  }, 
  "testRunner": "jest-circus/runner"
}