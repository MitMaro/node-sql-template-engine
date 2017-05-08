'use strict';

import {expect} from 'chai';
import Runtime from '../../src/Runtime';
import {
	invalidExpression,
	value,
	binaryExpression
} from '../nodeBuilder';

import {
	OPERATOR_EQUALS,
	OPERATOR_NOT_EQUALS,
	OPERATOR_STRICT_EQUALS,
	OPERATOR_STRICT_NOT_EQUALS,
	OPERATOR_AND,
	OPERATOR_OR,
	OPERATOR_GREATER_THAN,
	OPERATOR_LESS_THAN,
	OPERATOR_GREATER_EQUAL_THAN,
	OPERATOR_LESS_EQUAL_THAN,
} from '../../src/constants';

const runtime = new Runtime();

const constantValue = value('foo');
const lowNumericValue = value(10);
const highNumericValue = value(20);
const trueValue = value(true);
const falseValue = value(false);

describe('Runtime.evaluateBinaryExpression', function() {
	it('should compare same values with equals operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(constantValue, constantValue, OPERATOR_EQUALS))
		).to.be.true;
	});

	it('should compare different values with equals operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(constantValue, falseValue, OPERATOR_EQUALS))
		).to.be.false;
	});

	it('should compare same values with not equals operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(constantValue, constantValue, OPERATOR_NOT_EQUALS))
		).to.be.false;
	});

	it('should compare different values with equals operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(constantValue, falseValue, OPERATOR_NOT_EQUALS))
		).to.be.true;
	});

	it('should compare same values with strict equals operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(constantValue, constantValue, OPERATOR_STRICT_EQUALS))
		).to.be.true;
	});

	it('should compare different types values with strict equals operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(constantValue, trueValue, OPERATOR_STRICT_EQUALS))
		).to.be.false;
	});

	it('should compare different values, same type with strict equals operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(falseValue, trueValue, OPERATOR_STRICT_EQUALS))
		).to.be.false;
	});

	it('should compare same values with strict not equals operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(constantValue, constantValue, OPERATOR_STRICT_NOT_EQUALS))
		).to.be.false;
	});

	it('should compare different types values with strict not equals operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(constantValue, trueValue, OPERATOR_STRICT_NOT_EQUALS))
		).to.be.true;
	});

	it('should compare different values, same type with strict not equals operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(falseValue, trueValue, OPERATOR_STRICT_NOT_EQUALS))
		).to.be.true;
	});

	it('should compare lesser value against greater value with greater equal than', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(lowNumericValue, highNumericValue, OPERATOR_GREATER_EQUAL_THAN))
		).to.be.false;
	});

	it('should compare greater value against lesser value with greater equal than', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(highNumericValue, lowNumericValue, OPERATOR_GREATER_EQUAL_THAN))
		).to.be.true;
	});

	it('should compare equal values with greater equal than', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(lowNumericValue, lowNumericValue, OPERATOR_GREATER_EQUAL_THAN))
		).to.be.true;
	});

	it('should compare lesser value against greater value with lesser equal than', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(lowNumericValue, highNumericValue, OPERATOR_LESS_EQUAL_THAN))
		).to.be.true;
	});

	it('should compare greater value against lesser value with lesser equal than', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(highNumericValue, lowNumericValue, OPERATOR_LESS_EQUAL_THAN))
		).to.be.false;
	});

	it('should compare equal values with greater lesser than', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(lowNumericValue, lowNumericValue, OPERATOR_LESS_EQUAL_THAN))
		).to.be.true;
	});

	it('should compare lesser value against greater value with greater than', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(lowNumericValue, highNumericValue, OPERATOR_GREATER_THAN))
		).to.be.false;
	});

	it('should compare greater value against lesser value with greater than', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(highNumericValue, lowNumericValue, OPERATOR_GREATER_THAN))
		).to.be.true;
	});

	it('should compare equal values with greater than', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(lowNumericValue, lowNumericValue, OPERATOR_GREATER_THAN))
		).to.be.false;
	});

	it('should compare lesser value against greater value with lesser than', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(lowNumericValue, highNumericValue, OPERATOR_LESS_THAN))
		).to.be.true;
	});

	it('should compare greater value against lesser value with lesser than', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(highNumericValue, lowNumericValue, OPERATOR_LESS_THAN))
		).to.be.false;
	});

	it('should compare equal values with greater than', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(lowNumericValue, lowNumericValue, OPERATOR_LESS_THAN))
		).to.be.false;
	});

	it('should compare same true values with and operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(trueValue, trueValue, OPERATOR_AND))
		).to.be.true;
	});

	it('should compare different values with and operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(trueValue, falseValue, OPERATOR_AND))
		).to.be.false;
	});

	it('should compare same false values with and operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(falseValue, falseValue, OPERATOR_AND))
		).to.be.false;
	});

	it('should compare same true values with or operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(trueValue, trueValue, OPERATOR_OR))
		).to.be.true;
	});

	it('should compare different values with or operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(trueValue, falseValue, OPERATOR_OR))
		).to.be.true;
	});

	it('should compare same false values with or operator', function() {
		expect(runtime.evaluateBinaryExpression(
			binaryExpression(falseValue, falseValue, OPERATOR_OR))
		).to.be.false;
	});

	it('should throw error on unknown operator', function() {
		expect(() => runtime.evaluateBinaryExpression(invalidExpression())).to.throw(/Unknown operator/);
	});
});
