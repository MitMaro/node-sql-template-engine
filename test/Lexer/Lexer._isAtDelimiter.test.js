'use strict';

const test = require('ava');
const Lexer = require('../../src/Lexer');

test(`with empty string`, (t) => {
	const lexer = new Lexer('');
	t.false(lexer._isAtDelimiter());
});

test(`with a single non-delimiter character`, (t) => {
	const lexer = new Lexer('a');
	t.false(lexer._isAtDelimiter());
});

test(`with a double non-delimiter character`, (t) => {
	const lexer = new Lexer('aa');
	t.false(lexer._isAtDelimiter());
});

test(`with a triple non-delimiter character`, (t) => {
	const lexer = new Lexer('aaa');
	t.false(lexer._isAtDelimiter());
});

test(`with a four non-delimiter character`, (t) => {
	const lexer = new Lexer('aaaa');
	t.false(lexer._isAtDelimiter());
});

test(`with single character delimiters`, (t) => {
	const lexer = new Lexer('(');
	t.is(lexer._isAtDelimiter(), '(');
});

test(`with characters before a single character delimiter`, (t) => {
	const lexer = new Lexer('a(');
	t.false(lexer._isAtDelimiter());
});

test(`with double character delimiters`, (t) => {
	const lexer = new Lexer('==');
	t.is(lexer._isAtDelimiter(), '==');
});

test(`with characters before a double character delimiter`, (t) => {
	const lexer = new Lexer('a==');
	t.false(lexer._isAtDelimiter());
});

test(`with double character delimiter mismatch at second`, (t) => {
	const lexer = new Lexer('=a');
	t.false(lexer._isAtDelimiter());
});

test(`with triple character delimiters`, (t) => {
	const lexer = new Lexer('===');
	t.is(lexer._isAtDelimiter(), '===');
});

test(`with character before a triple character delimiter`, (t) => {
	const lexer = new Lexer('a===');
	t.false(lexer._isAtDelimiter());
});

test(`with triple character delimiter mismatch at second`, (t) => {
	const lexer = new Lexer('=a=');
	t.false(lexer._isAtDelimiter());
});

test(`with space delimiter`, (t) => {
	const lexer = new Lexer(' ');
	t.is(lexer._isAtDelimiter(), ' ');
});

test(`with tab delimiter`, (t) => {
	const lexer = new Lexer('\t');
	t.is(lexer._isAtDelimiter(), '\t');
});

test(`with newline delimiter`, (t) => {
	const lexer = new Lexer('\n');
	t.is(lexer._isAtDelimiter(), '\n');
});

[
	'(', ')', '"', '\'', '!', '>', '<',
	'{{', '}}', '==', '!=', '&&', '||', '>=', '<=',
	'===', '!=='
].forEach((delimiter) => {
	test(`with ${delimiter} delimiter`, (t) => {
		const lexer = new Lexer(delimiter);
		t.is(lexer._isAtDelimiter(), delimiter);
	});
});
