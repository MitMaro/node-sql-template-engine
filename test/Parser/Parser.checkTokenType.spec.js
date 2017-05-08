'use strict';

import {expect} from 'chai';
import {textLiteral} from '../tokenBuilders';
import Parser from '../../src/Parser';
import {
	TOKEN_TYPE_STRUCTURE,
	TOKEN_STRUCTURE_TEXT_LITERAL,
	TOKEN_STATEMENT_IF
} from '../../src/constants';

const tokenLiteral = textLiteral(0, 'foo');

describe('Parser#checkTokenType', function() {
	it('should check with matching token type', function() {
		expect(Parser.checkTokenType(
			tokenLiteral,
			[TOKEN_TYPE_STRUCTURE]
			)).to.deep.equal(tokenLiteral);
	});

	it('should check with matching token subType', function() {
		expect(Parser.checkTokenType(
			tokenLiteral,
			[TOKEN_STRUCTURE_TEXT_LITERAL]
		)).to.deep.equal(tokenLiteral);
	});

	it('should check with multiple types', function() {
		expect(Parser.checkTokenType(
			tokenLiteral,
			[TOKEN_STATEMENT_IF, TOKEN_STRUCTURE_TEXT_LITERAL]
		)).to.deep.equal(tokenLiteral);
	});

	it('should check with non-matching type', function() {
		expect(() => Parser.checkTokenType(tokenLiteral, [ TOKEN_STATEMENT_IF ]))
			.to.throw('Unexpected token');
	});
});
