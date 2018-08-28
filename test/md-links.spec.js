// const assert = require('chai').assert;
// global.window = global;
// // require('mdLinks.js');
// require('../index.js');

// describe('retornar funciones', () => {
// 	it('deberia ser una funcion renderer.link',()=> {
// 		assert.isFunction(window.renderer);
// 	});
// 	it('deberia ser una funcion renderer.image',()=> {
// 		assert.isFunction(window.renderer.image);
// 	});
// });

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


// it('debería retornar arreglo de objetos', () => {
// 	const processed = computeUsersStats(users, progress, courses);

// 	assert.equal(users.length, processed.length);

// 	processed.forEach(user => {
// 		assert.ok(user.hasOwnProperty('stats'));
// 		assert.isNumber(user.stats.percent);
// 		assert.isObject(user.stats.exercises);
// 		assert.isObject(user.stats.quizzes);
// 		assert.isObject(user.stats.reads);
// 	});
// });

// describe('parametros path y options', () => {
// 	it('deberian ser parametros');
// });

// describe('Validar que el archivo tenga formato .md', () => {
// 	expect(fs.readdir).toBeTruthy;
// });


// const validateLink = require('../src/md-links').validateLink;

// describe('Validar que existan links dentro del archivo', () => {
// 	expect(validateLink).toBeTruthy;
// });

// const mdLinks = require('./md-links')

// describe('Debería devolver verdadero para validar el link', () => {
// 	it('blabla');
// 	assert(mdLinks.mdLinks(1)).toEqual({
// 		validate: true
// 	})
// })

// describe('options debería ser objeto', () => {
// 	it('blabla');
// 	assert(mdLinks.mdLinks()).toEqual({
// 		validate: true
// 	})