'use strict';

const expect = require('chai').expect;
const Lexer = require('../../src/Lexer');

describe('Lexer.isAtDelimiter', function() {
	// false test cases
	[
		{
			description: 'empty string',
			input: ''
		},
		{
			description: 'a single non-delimiter character',
			input: 'a'
		},
		{
			description: 'double non-delimiter characters',
			input: 'aa'
		},
		{
			description: 'triple non-delimiter characters',
			input: 'aaa'
		},
		{
			description: 'four non-delimiter characters',
			input: 'aaaa'
		},
		{
			description: 'characters before a single character delimiter',
			input: 'a('
		},
		{
			description: 'characters before a double character delimiter',
			input: 'a=='
		},
		{
			description: 'double character delimiter mismatch at second',
			input: '=a'
		},
		{
			description: 'character before a triple character delimiter',
			input: 'a==='
		},
		{
			description: 'triple character delimiter mismatch at second',
			input: '=a='
		}
	].forEach((testCase) => {
		it(`should return false with ${testCase.description}`, function() {
			const lexer = new Lexer(testCase.input);

			expect(lexer.isAtDelimiter()).to.be.false;
		});
	});

	[
		'(', ')', '"', '\'', '!', '>', '<',
		'{{', '}}', '==', '!=', '&&', '||', '>=', '<=',
		'===', '!=='
	].forEach((delimiter) => {
		it(`should return ${delimiter} delimiter`, function() {
			const lexer = new Lexer(delimiter);

			expect(lexer.isAtDelimiter()).to.be.equal(delimiter);
		});
	});

	// the following need to be tested special because they are special characters
	it(`should return space delimiter`, function() {
		const lexer = new Lexer(' ');

		expect(lexer.isAtDelimiter()).to.be.equal(' ');
	});

	it(`should return tab delimiter`, function() {
		const lexer = new Lexer('\t');

		expect(lexer.isAtDelimiter()).to.be.equal('\t');
	});

	it(`should return newline delimiter`, function() {
		const lexer = new Lexer('\n');

		expect(lexer.isAtDelimiter()).to.be.equal('\n');
	});
});
