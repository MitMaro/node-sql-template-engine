'use strict';

import {expect} from 'chai';
import {textLiteral} from '../tokenBuilders';
import tokenGen from '../tokenGenerator';
import Parser from '../../src/Parser';

describe('Parser.getNextToken', function() {
	it('should get next token with one token remaining in lexer', function() {
		const token = textLiteral(0, 'foo');
		const parser = new Parser(tokenGen([ token ]));

		expect(parser.getNextToken()).to.deep.equal(token);
	});

	it('should get next token with token in cache', function() {
		const token = textLiteral(0, 'foo');
		const parser = new Parser(tokenGen([]));

		parser.nextTokens.push(token);
		expect(parser.getNextToken()).to.deep.equal(token);
	});

	it('should error with empty lexer', function() {
		const parser = new Parser(tokenGen([]));

		expect(() => parser.getNextToken()).to.throw('Unexpected end of tokens');
	});
});
