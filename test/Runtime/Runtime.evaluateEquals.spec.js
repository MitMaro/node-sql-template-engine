'use strict';

const expect = require('chai').expect;
const Runtime = require('../../src/Runtime');

const runtime = new Runtime();

describe('Runtime.evaluateEquals', function() {
	it('should compare same loose equals on non-float', function() {
		expect(runtime.evaluateEquals(1, true)).to.be.true;
	});

	it('should compare different loose equals on non-float', function() {
		expect(runtime.evaluateEquals(0, true)).to.be.false;
	});

	it('should compare same strict equals on non-float', function() {
		expect(runtime.evaluateEquals('foo', 'foo', true)).to.be.true;
	});

	it('should compare different types strict equals on non-float', function() {
		expect(runtime.evaluateEquals(true, 1, true)).to.be.false;
	});

	it('should compare different values strict equals on non-float', function() {
		expect(runtime.evaluateEquals('foo', 'bar', true)).to.be.false;
	});

	// cases adapted from: http://floating-point-gui.de/errors/NearlyEqualsTest.java
	describe('with numeric values', function() {
		[
			[1000000, 1000001],
			[1000001, 1000000],
			[-1000000, -1000001],
			[-1000001, -1000000],
			[1.0000001, 1.0000002],
			[1.0000002, 1.0000001],
			[-1.0000001, -1.0000002],
			[-1.0000002, -1.0000001],
			[0.000000001000001, 0.000000001000002],
			[0.000000001000002, 0.000000001000001],
			[-0.000000001000001, -0.000000001000002],
			[-0.000000001000002, -0.000000001000001],
			[0.0, 0.0],
			[0.0, -0.0],
			[-0.0, -0.0],
			[0, Math.pow(10, -40), 0.01],
			[Math.pow(10, -40), 0, 0.01],
			[0, -Math.pow(10, -40), 0.01],
			[-Math.pow(10, -40), 0, 0.01],
			[Number.MAX_VALUE, Number.MAX_VALUE],
			[Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
			[Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
			[10 * Number.MIN_VALUE, 10 * -Number.MIN_VALUE],
			[Number.MIN_VALUE, Number.MIN_VALUE],
			[Number.MIN_VALUE, -Number.MIN_VALUE],
			[-Number.MIN_VALUE, Number.MIN_VALUE],
			[Number.MIN_VALUE, 0],
			[0, Number.MIN_VALUE],
			[-Number.MIN_VALUE, 0],
			[0, -Number.MIN_VALUE]
		].forEach((c) => {
			const epsilon = c[2] || 0.00001;

			it(`should compare ${c[0]} to be equal to ${c[1]} with epsilon ${epsilon}`, function() {
				runtime.epsilon = epsilon;
				expect(runtime.evaluateEquals(...c)).to.be.true;
			});
		});
		[
			[10000, 10001],
			[10001, 10000],
			[-10000, -10001],
			[-10001, -10000],
			[1.0002, 1.0001],
			[1.0001, 1.0002],
			[-1.0001, -1.0002],
			[-1.0002, -1.0001],
			[Number.MAX_VALUE, -Number.MAX_VALUE],
			[-Number.MAX_VALUE, Number.MAX_VALUE],
			[Number.MAX_VALUE, Number.MAX_VALUE / 2],
			[Number.MAX_VALUE, -Number.MAX_VALUE / 2],
			[-Number.MAX_VALUE, Number.MAX_VALUE / 2],
			[Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
			[Number.POSITIVE_INFINITY, Number.MAX_VALUE],
			[Number.NEGATIVE_INFINITY, -Number.MAX_VALUE],
			[Number.NaN, Number.NaN],
			[Number.NaN, 0.0],
			[-0.0, Number.NaN],
			[Number.NaN, -0.0],
			[0.0, Number.NaN],
			[Number.NaN, Number.POSITIVE_INFINITY],
			[Number.POSITIVE_INFINITY, Number.NaN],
			[Number.NaN, Number.NEGATIVE_INFINITY],
			[Number.NEGATIVE_INFINITY, Number.NaN],
			[Number.NaN, Number.MAX_VALUE],
			[Number.MAX_VALUE, Number.NaN],
			[Number.NaN, -Number.MAX_VALUE],
			[-Number.MAX_VALUE, Number.NaN],
			[Number.NaN, Number.MIN_VALUE],
			[Number.MIN_VALUE, Number.NaN],
			[Number.NaN, -Number.MIN_VALUE],
			[-Number.MIN_VALUE, Number.NaN],
			[1.000000001, -1.0],
			[-1.0, 1.000000001],
			[-1.000000001, 1.0],
			[1.0, -1.000000001]
		].forEach((c) => {
			it(`should compare ${c[0]} to be not equal to ${c[1]} with epsilon  0.00001`, function() {
				runtime.epsilon = 0.00001;
				expect(runtime.evaluateEquals(...c)).to.be.false;
			});
		});
	});
});
