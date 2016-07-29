'use strict';

const expect = require('chai').expect;
const Parser = require('../../src/Parser');
const Lexer = require('../../src/Lexer');
const nb = require('../nodeBuilder');

const {
	OPERATOR_AND,
	OPERATOR_OR,
	OPERATOR_GREATER_THAN,
} = require('../../src/constants');

describe('Parser.generateExpression', function() {
	[
		{
			description: 'with base binary operator',
			input: 'a > b',
			expected: nb.binaryExpression(
					nb.variable('a'),
					nb.variable('b'),
					OPERATOR_GREATER_THAN
			)
		},
		{
			description: 'with expression chain',
			input: 'a > b > c',
			expected: nb.binaryExpression(
					nb.binaryExpression(
						nb.variable('a'),
						nb.variable('b'),
						OPERATOR_GREATER_THAN
					),
					nb.variable('c'),
					OPERATOR_GREATER_THAN
			)
		},
		{
			description: 'with brackets on the right',
			input: 'a > (b > c)',
			expected: nb.binaryExpression(
					nb.variable('a'),
					nb.binaryExpression(
							nb.variable('b'),
							nb.variable('c'),
							OPERATOR_GREATER_THAN
					),
					OPERATOR_GREATER_THAN
			)
		},
		{
			description: 'with brackets on the left',
			input: '(a > b) > c',
			expected: nb.binaryExpression(
					nb.binaryExpression(
							nb.variable('a'),
							nb.variable('b'),
							OPERATOR_GREATER_THAN
					),
					nb.variable('c'),
					OPERATOR_GREATER_THAN
			)
		},
		{
			description: 'with ors and ands',
			input: 'a || b && c',
			expected: nb.binaryExpression(
					nb.variable('a'),
					nb.binaryExpression(
							nb.variable('b'),
							nb.variable('c'),
							OPERATOR_AND
					),
					OPERATOR_OR
			)
		},
		{
			description: 'with a not on the left',
			input: '!a || b',
			expected: nb.binaryExpression(
					nb.notConditional(nb.variable('a')),
					nb.variable('b'),
					OPERATOR_OR
			)
		},
		{
			description: 'with a not on the right',
			input: 'a || !b',
			expected: nb.binaryExpression(
					nb.variable('a'),
					nb.notConditional(nb.variable('b')),
					OPERATOR_OR
			)
		},
		{
			description: 'with a variable',
			input: 'a',
			expected: nb.variable('a')
		},
		{
			description: 'with a integer value',
			input: '123',
			expected: nb.value(123)
		},
		{
			description: 'with a float value',
			input: '123.34',
			expected: nb.value(123.34)
		},
		{
			description: 'with a single quote string',
			input: '\'foo\'',
			expected: nb.value('foo')
		},
		{
			description: 'with a double quote string',
			input: '"foo"',
			expected: nb.value('foo')
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
