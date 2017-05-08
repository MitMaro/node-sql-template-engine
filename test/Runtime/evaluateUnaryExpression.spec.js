'use strict';

import {expect} from 'chai';
import Runtime from '../../src/Runtime';

describe('Runtime.evaluateUnaryExpression', function() {
	it('should get matching input data', function() {
		const runtime = new Runtime();

		runtime.input = { foo: 'bar' };
		expect(runtime.getValueFromVariable('foo')).to.equal('bar');
	});

	it('should return undefined on missing input data', function() {
		const runtime = new Runtime();

		runtime.input = {};
		expect(runtime.getValueFromVariable('foo')).to.be.undefined;
	});
});
