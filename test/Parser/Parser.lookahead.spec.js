'use strict';

import {expect} from 'chai';
import {textLiteral} from '../tokenBuilders';
import tokenGen from '../tokenGenerator';
import Parser from '../../src/Parser';

import {
	TOKEN_STRUCTURE_TEXT_LITERAL,
	TOKEN_TYPE_VALUE
} from '../../src/constants';

describe('Parser.lookahead', function() {
	it('should lookahead with one token remaining in lexer', function() {
		const token = textLiteral(0, 'foo');
		const parser = new Parser(tokenGen([ token ]));

		expect(parser.lookahead()).to.deep.equal(token);
	});

	it('should lookahead by two with more than one token remaining in lexer', function() {
		const token = textLiteral(0, 'second');
		const parser = new Parser(tokenGen([
			textLiteral(0, 'first'),
			token
		]));

		expect(parser.lookahead(2)).to.deep.equal(token);
	});

	it('should lookahead with one token in tokens cache', function() {
		const token = textLiteral(0, 'foo');
		const parser = new Parser(tokenGen([]));

		parser.nextTokens.push(token);
		expect(parser.lookahead()).to.deep.equal(token);
	});

	it('should lookahead by two with more than one token in tokens cache', function() {
		const token = textLiteral(0, 'second');
		const parser = new Parser(tokenGen([]));

		parser.nextTokens.push(textLiteral(0, 'first'));
		parser.nextTokens.push(token);
		parser.nextTokens.push(textLiteral(0, 'third'));
		expect(parser.lookahead(2)).to.deep.equal(token);
	});

	it('should lookahead with passing type check', function() {
		const token = textLiteral(0, 'foo');
		const parser = new Parser(tokenGen([ token ]));

		expect(parser.lookahead(1, TOKEN_STRUCTURE_TEXT_LITERAL)).to.deep.equal(token);
	});

	it('should lookahead with failing type check', function() {
		const token = textLiteral(0, 'foo');
		const parser = new Parser(tokenGen([ token ]));

		expect(() => parser.lookahead(1, TOKEN_TYPE_VALUE)).to.throw(/Unexpected token/);
	});
});
