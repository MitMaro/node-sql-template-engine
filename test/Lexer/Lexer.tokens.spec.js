'use strict';

import {expect} from 'chai';
import Lexer from '../../src/Lexer';
import {TOKEN_STRUCTURE_EOF} from '../../src/constants';
import {
	textLiteral,
	startTag,
	endTag,
	ifStatement,
	variable,
	string,
	stringSingle,
	stringDouble,
	bracketOpen,
	bracketClose,
	andOperator,
	notOperator,
	integer,
	float,
} from '../tokenBuilders';

describe('Lexer.tokens', function() {
	[
		{
			description: 'with empty string',
			input: [ '' ],
			expected: []
		},
		{
			description: 'with string literal only',
			input: [ 'a' ],
			expected: [
				textLiteral(0, 'a')
			]
		},
		{
			description: 'with tag only',
			input: [ '{{' ],
			expected: [
				startTag(0)
			]
		},
		{
			description: 'with tag after literal',
			input: [ 'aa{{' ],
			expected: [
				textLiteral(0, 'aa'), startTag(2)
			]
		},
		{
			description: 'with if tag',
			input: ['a', '{{if}}'],
			expected: [
				textLiteral(0, 'a\n', 0, 0),
				startTag(2, 0, 1), ifStatement(4, 2, 1), endTag(6, 4, 1)
			]
		},
		{
			description: 'with whitespace inside tag',
			input: ['a', '{{ if }}'],
			expected: [
				textLiteral(0, 'a\n', 0, 0),
				startTag(2, 0 , 1), ifStatement(5, 3, 1), endTag(8, 6, 1)
			]
		},
		{
			description: 'with variable in if',
			input: ['a', '{{if var}}'],
			expected: [
				textLiteral(0, 'a\n', 0, 0),
				startTag(2, 0, 1), ifStatement(4, 2, 1), variable(7, 'var', 5, 1), endTag(10, 8, 1)
			]
		},
		{
			description: 'with single quoted string in if',
			input: [ '{{if \'str\'}}' ],
			expected: [
				startTag(0), ifStatement(2),
				stringSingle(5), string(6, 'str'), stringSingle(9), endTag(10)
			]
		},
		{
			description: 'with double quoted string in if',
			input: [ '{{if "str"}}' ],
			expected: [
				startTag(0), ifStatement(2),
				stringDouble(5), string(6, 'str'), stringDouble(9), endTag(10)
			]
		},
		{
			description: 'with brackets',
			input: [ '{{()}}' ],
			expected: [
				startTag(0), bracketOpen(2), bracketClose(3), endTag(4)
			]
		},
		{
			description: 'with nested brackets',
			input: [ '{{ ( ( ) ) }}' ],
			expected: [
				startTag(0),
				bracketOpen(3), bracketOpen(5), bracketClose(7), bracketClose(9),
				endTag(11)
			]
		},
		{
			description: 'with binary operator',
			input: [ '{{foo&&bar}}' ],
			expected: [
				startTag(0),
				variable(2, 'foo'), andOperator(5), variable(7, 'bar'),
				endTag(10)
			]
		},
		{
			description: 'with unary operator',
			input: [ '{{!foo}}' ],
			expected: [
				startTag(0),
				notOperator(2), variable(3, 'foo'),
				endTag(6)
			]
		},
		{
			description: 'with integer literal',
			input: [ '{{123}}' ],
			expected: [
				startTag(0), integer(2, '123'), endTag(5)
			]
		},
		{
			description: 'with float literal',
			input: [ '{{1.23}}' ],
			expected: [
				startTag(0), float(2, '1.23'), endTag(6)
			]
		},
		{
			description: 'with negative integer literal',
			input: [ '{{-123}}' ],
			expected: [
				startTag(0), integer(2, '-123'), endTag(6)
			]
		},
		{
			description: 'with negative float literal',
			input: [ '{{-1.23}}' ],
			expected: [
				startTag(0), float(2, '-1.23'), endTag(7)
			]
		}
	].forEach((testCase) => {
		it(`should tokenize ${testCase.description}`, function() {
			const lexer = new Lexer(testCase.input.join('\n'));
			const tokens = Array.from(lexer.tokens());

			expect(tokens.pop().subType).to.equal(TOKEN_STRUCTURE_EOF);

			expect(tokens).to.deep.equal(testCase.expected);
		});
	});

	it('should error with invalid state', function() {
		const lexer = new Lexer('foo');

		lexer.state = 'INVALID';

		const tokens = lexer.tokens();

		expect(() => tokens.next()).to.throw(/Invalid state incurred/);
	});
});
