'use strict';

const test = require('ava');
const Lexer = require('../../src/Lexer');

test(`with empty string`, (t) => {
	const lexer = new Lexer('');
	lexer._scanToNextDelimiter();
	t.is(lexer.pointer, 1); // EOF
});

test(`with single character`, (t) => {
	const lexer = new Lexer('a');
	lexer._scanToNextDelimiter();
	t.is(lexer.pointer, 1); // EOF
});

test(`with multiple characters`, (t) => {
	const lexer = new Lexer('aaa');
	lexer._scanToNextDelimiter();
	t.is(lexer.pointer, 3); // EOF
});

test(`with single character delimiter`, (t) => {
	const lexer = new Lexer('(');
	lexer._scanToNextDelimiter();
	t.is(lexer.pointer, 0);
});

test(`with double character delimiter`, (t) => {
	const lexer = new Lexer('==');
	lexer._scanToNextDelimiter();
	t.is(lexer.pointer, 0);
});

test(`with triple character delimiter`, (t) => {
	const lexer = new Lexer('===');
	lexer._scanToNextDelimiter();
	t.is(lexer.pointer, 0);
});

test(`with double character delimiter and leading characters`, (t) => {
	const lexer = new Lexer('a==');
	lexer._scanToNextDelimiter();
	t.is(lexer.pointer, 1);
});
