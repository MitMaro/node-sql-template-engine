'use strict';

const expect = require('chai').expect;
const Runtime = require('../../src/Runtime');
const nb = require('../nodeBuilder');

describe('Runtime.getValueFromVariable', function() {
	it('should return on not operator', function() {
		const runtime = new Runtime();
		const expression = nb.notConditional(nb.value(true));

		expect(runtime.evaluateUnaryExpression(expression)).to.be.false;
	});

	it('should error on unknown operator', function() {
		const runtime = new Runtime();
		const expression = nb.invalidExpression();

		expect(() => runtime.evaluateUnaryExpression(expression)).to.throw(/Unknown operator/);
	});
});
