'use strict';

const expect = require('chai').expect;
const tokenBuilders = require('../tokenBuilders');
const tokenGen = require('../tokenGenerator');
const Parser = require('../../src/Parser');

describe('Parser.getNextToken', function() {
	it('should get next token with one token remaining in lexer', function() {
		const token = tokenBuilders.textLiteral(0, 'foo');
		const parser = new Parser(tokenGen([ token ]));

		expect(parser.getNextToken()).to.deep.equal(token);
	});

	it('should get next token with token in cache', function() {
		const token = tokenBuilders.textLiteral(0, 'foo');
		const parser = new Parser(tokenGen([]));

		parser.nextTokens.push(token);
		expect(parser.getNextToken()).to.deep.equal(token);
	});

	it('should error with empty lexer', function() {
		const parser = new Parser(tokenGen([]));

		expect(() => parser.getNextToken()).to.throw('Unexpected end of tokens');
	});
});
