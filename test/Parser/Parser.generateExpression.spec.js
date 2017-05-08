'use strict';

import {expect} from 'chai';
import Parser from '../../src/Parser';
import Lexer from '../../src/Lexer';
import {
	binaryExpression,
	variable as nbVariable,
	value as nbValue,
	notConditional
} from '../nodeBuilder';

import {
	OPERATOR_AND,
	OPERATOR_OR,
	OPERATOR_GREATER_THAN,
} from '../../src/constants';

// indexes all need to be increased for {{if <input> }}
function variable(name, column) {
	return nbVariable(name, column + 5, 0);
}
function value(name, column) {
	return nbValue(name, column + 5, 0);
}

describe('Parser.generateExpression', function() {
	[
		{
			description: 'with base binary operator',
			input: 'a > b',
			expected: binaryExpression(
					variable('a', 0),
					variable('b', 4),
					OPERATOR_GREATER_THAN
			)
		},
		{
			description: 'with expression chain',
			input: 'a > b > c',
			expected: binaryExpression(
					binaryExpression(
						variable('a', 0),
						variable('b', 4),
						OPERATOR_GREATER_THAN
					),
					variable('c', 8),
					OPERATOR_GREATER_THAN
			)
		},
		{
			description: 'with brackets on the right',
			input: 'a > (b > c)',
			expected: binaryExpression(
					variable('a', 0),
					binaryExpression(
							variable('b', 5),
							variable('c', 9),
							OPERATOR_GREATER_THAN
					),
					OPERATOR_GREATER_THAN
			)
		},
		{
			description: 'with brackets on the left',
			input: '(a > b) > c',
			expected: binaryExpression(
					binaryExpression(
							variable('a', 1),
							variable('b', 5),
							OPERATOR_GREATER_THAN
					),
					variable('c', 10),
					OPERATOR_GREATER_THAN
			)
		},
		{
			description: 'with ors and ands',
			input: 'a || b && c',
			expected: binaryExpression(
					variable('a', 0),
					binaryExpression(
							variable('b', 5),
							variable('c', 10),
							OPERATOR_AND
					),
					OPERATOR_OR
			)
		},
		{
			description: 'with a not on the left',
			input: '!a || b',
			expected: binaryExpression(
					notConditional(variable('a', 1)),
					variable('b', 6),
					OPERATOR_OR
			)
		},
		{
			description: 'with a not on the right',
			input: 'a || !b',
			expected: binaryExpression(
					variable('a', 0),
					notConditional(variable('b', 6)),
					OPERATOR_OR
			)
		},
		{
			description: 'with a variable',
			input: 'a',
			expected: variable('a', 0)
		},
		{
			description: 'with a integer value',
			input: '123',
			expected: value(123, 0)
		},
		{
			description: 'with a float value',
			input: '123.34',
			expected: value(123.34, 0)
		},
		{
			description: 'with a single quote string',
			input: '\'foo\'',
			expected: value('foo', 0)
		},
		{
			description: 'with a double quote string',
			input: '"foo"',
			expected: value('foo', 0)
		}
	].forEach((testCase) => {
		it(`should parse ${testCase.description}`, function() {
			const parser = new Parser(new Lexer(`{{if ${testCase.input}}}{{fi}}`));
			const ast = parser.generateAST();
			// we only care about the expression in the condition
			const condition = ast.statements[0].branches[0].condition;

			expect(condition).to.deep.equal(testCase.expected);
		});
	});
});
