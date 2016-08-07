'use strict';

const expect = require('chai').expect;
const Runtime = require('../../src/Runtime');

describe('Runtime.evaluateEquals', function() {
	it('should compare same loose equals on non-float', function() {
		const runtime = new Runtime();

		expect(runtime.evaluateEquals(1, true)).to.be.true;
	});

	it('should compare different loose equals on non-float', function() {
		const runtime = new Runtime();

		expect(runtime.evaluateEquals(0, true)).to.be.false;
	});

	it('should compare same strict equals on non-float', function() {
		const runtime = new Runtime();

		expect(runtime.evaluateEquals('foo', 'foo', true)).to.be.true;
	});

	it('should compare different types strict equals on non-float', function() {
		const runtime = new Runtime();

		expect(runtime.evaluateEquals(true, 1, true)).to.be.false;
	});

	it('should compare different values strict equals on non-float', function() {
		const runtime = new Runtime();

		expect(runtime.evaluateEquals('foo', 'bar', true)).to.be.false;
	});
});
