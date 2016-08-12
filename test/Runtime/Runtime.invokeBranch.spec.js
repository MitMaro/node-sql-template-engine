'use strict';

const expect = require('chai').expect;
const Runtime = require('../../src/Runtime');
const nb = require('../nodeBuilder');

describe('Runtime.invokeBranch', function() {
	let runtime;

	beforeEach(function() {
		runtime = new Runtime();
	});

	it('should invoke on true condition', function() {
		runtime.invokeBranch(
			nb.branch([
				nb.conditional(nb.value(false), nb.root(nb.literal('aaa'))),
				nb.conditional(nb.value(true), nb.root(nb.literal('bbb')))
			])
		);
		expect(runtime.result).to.deep.equal([ 'bbb' ]);
	});

	it('should invoke else', function() {
		runtime.invokeBranch(
			nb.branch([
				nb.conditional(nb.value(false), nb.root(nb.literal('aaa'))),
				nb.constantConditional(nb.root(nb.literal('bbb')))
			])
		);
		expect(runtime.result).to.deep.equal([ 'bbb' ]);
	});


	it('should not invoke on false condition', function() {
		runtime.invokeBranch(
			nb.branch(
				nb.conditional(nb.value(false), nb.root(nb.literal('foo')))
			)
		);
		expect(runtime.result).to.deep.equal([]);
	});
});
