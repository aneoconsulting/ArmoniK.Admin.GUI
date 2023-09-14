
/* eslint-env es6 */
/* eslint-disable no-console */
const { TextEncoder, TextDecoder } = require('util')
module.exports = {
  globals: {
    TextDecoder: TextDecoder,
    TextEncoder: TextEncoder
  }
}