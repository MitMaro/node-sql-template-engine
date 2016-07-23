'use strict';

const expect = require('chai').expect;
const Lexer = require('../../src/Lexer');

describe('Lexer.scanString', function() {
	it('should scan with empty string', function() {
		const lexer = new Lexer('');
		lexer.scanString();
		expect(lexer.pointer).to.equal(1);
	});
	
	it('should scan with single character', function() {
		const lexer = new Lexer('a');
		lexer.scanString();
		expect(lexer.pointer).to.equal(1);
	});
	
	it('should scan with a single quote in double quote mode', function() {
		const lexer = new Lexer('\'');
		lexer.stringDelimiter = '"';
		lexer.scanString();
		expect(lexer.pointer).to.equal(1);
	});
	
	it('should scan with a double quote in dingle quote mode', function() {
		const lexer = new Lexer('"');
		lexer.stringDelimiter = '\'';
		lexer.scanString();
		expect(lexer.pointer).to.equal(1);
	});
	
	it('should scan with characters before end single quote', function() {
		const lexer = new Lexer('   \'');
		lexer.stringDelimiter = '\'';
		lexer.scanString();
		expect(lexer.pointer).to.equal(3);
	});
	
	it('should scan with characters before end double quote', function() {
		const lexer = new Lexer('   "');
		lexer.stringDelimiter = '"';
		lexer.scanString();
		expect(lexer.pointer).to.equal(3);
	});
	
	it('should scan with characters after end single quote', function() {
		const lexer = new Lexer('\'  ');
		lexer.stringDelimiter = '\'';
		lexer.scanString();
		expect(lexer.pointer).to.equal(0);
	});
	
	it('should scan with characters after end double quote', function() {
		const lexer = new Lexer('"  ');
		lexer.stringDelimiter = '"';
		lexer.scanString();
		expect(lexer.pointer).to.equal(0);
	});
	
	it('should scan with characters before and after end single quote', function() {
		const lexer = new Lexer('  \'  ');
		lexer.stringDelimiter = '\'';
		lexer.scanString();
		expect(lexer.pointer).to.equal(2);
	});
	
	it('should scan with characters before and after end double quote', function() {
		const lexer = new Lexer('  "  ');
		lexer.stringDelimiter = '"';
		lexer.scanString();
		expect(lexer.pointer).to.equal(2);
	});
	
	it('should scan with escaped single quote', function() {
		const lexer = new Lexer('\\\'');
		lexer.stringDelimiter = '\'';
		lexer.scanString();
		expect(lexer.pointer).to.equal(2);
	});
	
	it('should scan with escaped double quote', function() {
		const lexer = new Lexer('\\"');
		lexer.stringDelimiter = '"';
		lexer.scanString();
		expect(lexer.pointer).to.equal(2);
	});
});

