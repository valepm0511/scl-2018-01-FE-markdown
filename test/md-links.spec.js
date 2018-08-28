const assert = require('chai').assert;
global.window = global;
// require('mdLinks.js');
require('../index.js');

describe('retornar funciones', () => {
	it('deberia ser una funcion renderer.link',()=> {
		assert.isFunction(renderer.link);
	});
	it('deberia ser una funcion renderer.image',()=> {
		assert.isFunction(renderer.image);
	});
});

// describe('retornar arreglos'. () => {
// 	it('deberia ser un arreglo', () => {
// 		assert.isArray(links);
// 	})
// })

// describe('retornar objetos'. () => {
// 	it('deberia ser un objeto', () => {
// 		assert.isObject(links);
// 	})
// })
