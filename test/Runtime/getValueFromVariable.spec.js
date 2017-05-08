'use strict';

import {expect} from 'chai';
import Runtime from '../../src/Runtime';
import {
	notConditional,
	invalidExpression,
	value
} from '../nodeBuilder';

describe('Runtime.getValueFromVariable', function() {
	it('should return on not operator', function() {
		const runtime = new Runtime();
		const expression = notConditional(value(true));

		expect(runtime.evaluateUnaryExpression(expression)).to.be.false;
	});

	it('should error on unknown operator', function() {
		const runtime = new Runtime();
		const expression = invalidExpression();

		expect(() => runtime.evaluateUnaryExpression(expression)).to.throw(/Unknown operator/);
	});
});
