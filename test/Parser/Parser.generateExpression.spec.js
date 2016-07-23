'use strict';

const expect = require('chai').expect;
const Parser = require('../../src/Parser');
const Lexer = require('../../src/Lexer');
const nb = require('../nodeBuilder');

const {
	OPERATOR_EQUALS,
	OPERATOR_NOT_EQUALS,
	OPERATOR_STRICT_EQUALS,
	OPERATOR_STRICT_NOT_EQUALS,
	OPERATOR_AND,
	OPERATOR_OR,
	OPERATOR_NOT,
	OPERATOR_GREATER_THAN,
	OPERATOR_LESS_THAN,
	OPERATOR_GREATER_EQUAL_THAN,
	OPERATOR_LESS_EQUAL_THAN,
} = require('../../src/constants');

describe.only('Parser.generateExpression', function() {
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
			description: 'with nested expression operator',
			input: 'a > b > c',
			expected: nb.binaryExpression(
					nb.variable('a'),
					nb.variable('b'),
					OPERATOR_GREATER_THAN
			)
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
