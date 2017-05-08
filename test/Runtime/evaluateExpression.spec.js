'use strict';

import {expect} from 'chai';
import Runtime from '../../src/Runtime';
import {
	andConditional,
	value,
	notConditional,
	variable,
	invalidExpression
} from '../nodeBuilder';

const runtime = new Runtime();

runtime.input = { foo: 'bar' };

describe('Runtime.evaluateExpression', function() {
	it('should return on binary operator', function() {
		expect(runtime.evaluateExpression(andConditional(value(true), value(false)))).to.be.false;
	});

	it('should return on unary operator', function() {
		expect(runtime.evaluateExpression(notConditional(value(true)))).to.be.false;
	});

	it('should return on value expression', function() {
		expect(runtime.evaluateExpression(value('foo'))).to.equal('foo');
	});

	it('should return on value expression', function() {
		expect(runtime.evaluateExpression(variable('foo'))).to.equal('bar');
	});

	it('should error on unknown expression', function() {
		expect(() => runtime.evaluateExpression(invalidExpression())).to.throw(/Unknown expression type/);
	});
});
