'use strict';

const expect = require('chai').expect;
const tokenBuilders = require('../tokenBuilders');
const Parser = require('../../src/Parser');

const {
	TOKEN_TYPE_STRUCTURE,
	TOKEN_STRUCTURE_TEXT_LITERAL,
	TOKEN_STATEMENT_IF
} = require('../../src/constants');
const tokenLiteral = tokenBuilders.textLiteral(0, 'foo');

describe('Parser#checkTokenType', function() {
	it('should check with matching token type', function() {
		expect(Parser.checkTokenType(tokenLiteral, [ TOKEN_TYPE_STRUCTURE ])).to.deep.equal(tokenLiteral);
	});

	it('should check with matching token subType', function() {
		expect(Parser.checkTokenType(tokenLiteral, [ TOKEN_STRUCTURE_TEXT_LITERAL ])).to.deep.equal(tokenLiteral);
	});

	it('should check with multiple types', function() {
		expect(Parser.checkTokenType(
			tokenLiteral, [TOKEN_STATEMENT_IF, TOKEN_STRUCTURE_TEXT_LITERAL])).to.deep.equal(tokenLiteral
		);
	});

	it('should check with non-matching type', function() {
		expect(() => Parser.checkTokenType(tokenLiteral, [ TOKEN_STATEMENT_IF ]))
			.to.throw('Unexpected token: STRUCTURE:TEXT_LITERAL');
	});
});
