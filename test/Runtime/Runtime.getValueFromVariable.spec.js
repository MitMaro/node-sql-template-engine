'use strict';

const expect = require('chai').expect;
const Runtime = require('../../src/Runtime');

describe('Runtime.getValueFromVariable', function() {
	it('should get matching input data', function() {
		const runtime = new Runtime();

		runtime.input = { foo: 'bar' };
		expect(runtime.getValueFromVariable('foo')).to.equal('bar');
	});

	it('should error on missing input data', function() {
		const runtime = new Runtime();

		runtime.input = {};
		expect(() => runtime.getValueFromVariable('foo')).to.throw(/Unset variable/);
	});
});
