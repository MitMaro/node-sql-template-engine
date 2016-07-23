'use strict';

const expect = require('chai').expect;
const tokenBuilders = require('../tokenBuilders');
const tokenGen = require('../tokenGenerator');
const Parser = require('../../src/Parser');

const {
	TOKEN_STRUCTURE_TEXT_LITERAL,
	TOKEN_TYPE_VALUE
} = require('../../src/constants');

describe('Parser.lookahead', function() {
	it('should lookahead with one token remaining in lexer', function() {
		const token = tokenBuilders.textLiteral(0, 'foo');
		const parser = new Parser(tokenGen([ token ]));
		expect(parser.lookahead()).to.deep.equal(token);
	});
	
	it('should lookahead by two with more than one token remaining in lexer', function() {
		const token = tokenBuilders.textLiteral(0, 'second');
		const parser = new Parser(tokenGen([
			tokenBuilders.textLiteral(0, 'first'),
			token
		]));
		expect(parser.lookahead(2)).to.deep.equal(token);
	});
	
	it('should lookahead with one token in tokens cache', function() {
		const token = tokenBuilders.textLiteral(0, 'foo');
		const parser = new Parser(tokenGen([]));
		parser.nextTokens.push(token);
		expect(parser.lookahead()).to.deep.equal(token);
	});
	
	it('should lookahead by two with more than one token in tokens cache', function() {
		const token = tokenBuilders.textLiteral(0, 'second');
		const parser = new Parser(tokenGen([]));
		parser.nextTokens.push(tokenBuilders.textLiteral(0, 'first'));
		parser.nextTokens.push(token);
		parser.nextTokens.push(tokenBuilders.textLiteral(0, 'third'));
		expect(parser.lookahead(2)).to.deep.equal(token);
	});
	
	it('should lookahead with passing type check', function() {
		const token = tokenBuilders.textLiteral(0, 'foo');
		const parser = new Parser(tokenGen([ token ]));
		expect(parser.lookahead(1, TOKEN_STRUCTURE_TEXT_LITERAL)).to.deep.equal(token);
	});
	
	it('should lookahead with failing type check', function() {
		const token = tokenBuilders.textLiteral(0, 'foo');
		const parser = new Parser(tokenGen([ token ]));
		expect(() => parser.lookahead(1, TOKEN_TYPE_VALUE)).to.throw(/Unexpected token/);
	});
});
