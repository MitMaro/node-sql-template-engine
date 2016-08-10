'use strict';

const expect = require('chai').expect;
const Runtime = require('../../src/Runtime');
const nb = require('../nodeBuilder');

const runtime = new Runtime();

runtime.input = { foo: 'bar' };

describe('Runtime.evaluateExpression', function() {
	it('should return on binary operator', function() {
		expect(runtime.evaluateExpression(nb.andConditional(nb.value(true), nb.value(false)))).to.be.false;
	});

	it('should return on unary operator', function() {
		expect(runtime.evaluateExpression(nb.notConditional(nb.value(true)))).to.be.false;
	});

	it('should return on value expression', function() {
		expect(runtime.evaluateExpression(nb.value('foo'))).to.equal('foo');
	});

	it('should return on value expression', function() {
		expect(runtime.evaluateExpression(nb.variable('foo'))).to.equal('bar');
	});

	it('should error on unknown expression', function() {
		expect(() => runtime.evaluateExpression(nb.invalidExpression())).to.throw(/Unknown expression type:/);
	});
});
