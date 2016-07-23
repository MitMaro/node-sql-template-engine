'use strict';

const expect = require('chai').expect;
const Lexer = require('../../src/Lexer');

describe('Lexer.skipWhitespace', function() {
	it('should skip on empty string', function() {
		const lexer = new Lexer('');
		lexer.skipWhitespace();
		expect(lexer.pointer).to.equal(0);
	});
	
	it('should skip on space only string', function() {
		const lexer = new Lexer('   ');
		lexer.skipWhitespace();
		expect(lexer.pointer).to.equal(3);
	});
	
	it('should skip on newlines', function() {
		const lexer = new Lexer('\n');
		lexer.skipWhitespace();
		expect(lexer.pointer).to.equal(1);
	});
	
	it('should skip on tabs', function() {
		const lexer = new Lexer('\t');
		lexer.skipWhitespace();
		expect(lexer.pointer).to.equal(1);
	});
	
	it('should not move pointer on non-whitespace', function() {
		const lexer = new Lexer('text');
		lexer.skipWhitespace();
		expect(lexer.pointer).to.equal(0);
	});
	
	it('should skip to text', function() {
		const lexer = new Lexer('  text');
		lexer.skipWhitespace();
		expect(lexer.pointer).to.equal(2);
	});
});
