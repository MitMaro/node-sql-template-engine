'use strict';

const expect = require('chai').expect;
const Lexer = require('../../src/Lexer');

describe('Lexer.scanNextDelimiter', function() {
	it('should scan with empty string', function() {
		const lexer = new Lexer('');
		lexer.scanNextDelimiter();
		expect(lexer.pointer).to.equal(0);
	});
	
	it('should scan with non-delimiter', function() {
		const lexer = new Lexer('aaa');
		lexer.scanNextDelimiter();
		expect(lexer.pointer).to.equal(0);
	});
	
	it('should scan with single character delimiter', function() {
		const lexer = new Lexer('(');
		lexer.scanNextDelimiter();
		expect(lexer.pointer).to.equal(1);
	});
	
	it('should scan with double character delimiter', function() {
		const lexer = new Lexer('==');
		lexer.scanNextDelimiter();
		expect(lexer.pointer).to.equal(2);
	});
	it('should scan with triple character delimiter', function() {
		const lexer = new Lexer('===');
		lexer.scanNextDelimiter();
		expect(lexer.pointer).to.equal(3);
	});
});
