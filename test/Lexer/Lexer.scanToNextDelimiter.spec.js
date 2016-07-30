'use strict';

const expect = require('chai').expect;
const Lexer = require('../../src/Lexer');

describe('Lexer.scanToNextDelimiter', function() {
	it('should scan with empty string', function() {
		const lexer = new Lexer('');

		lexer.scanToNextDelimiter();
		expect(lexer.pointer).to.equal(1); // EOF
	});

	it('should scan with single character', function() {
		const lexer = new Lexer('a');

		lexer.scanToNextDelimiter();
		expect(lexer.pointer).to.equal(1); // EOF
	});

	it('should scan with multiple characters', function() {
		const lexer = new Lexer('aaa');

		lexer.scanToNextDelimiter();
		expect(lexer.pointer).to.equal(3); // EOF
	});

	it('should scan with single character delimiter', function() {
		const lexer = new Lexer('(');

		lexer.scanToNextDelimiter();
		expect(lexer.pointer).to.equal(0);
	});

	it('should scan with double character delimiter', function() {
		const lexer = new Lexer('==');

		lexer.scanToNextDelimiter();
		expect(lexer.pointer).to.equal(0);
	});

	it('should scan with triple character delimiter', function() {
		const lexer = new Lexer('===');

		lexer.scanToNextDelimiter();
		expect(lexer.pointer).to.equal(0);
	});

	it('should scan with double character delimiter and leading characters', function() {
		const lexer = new Lexer('a==');

		lexer.scanToNextDelimiter();
		expect(lexer.pointer).to.equal(1);
	});
});
