const assert = require('chai').assert;
global.window = global;
require('../lib/md-links');

describe('mdLinks', () => {
  it('deberia ser una funcion md-links');
  assert.isFunction(mdLinks);
});

// describe('parametros path y options', () => {
// 	it('deberian ser parametros');
// });