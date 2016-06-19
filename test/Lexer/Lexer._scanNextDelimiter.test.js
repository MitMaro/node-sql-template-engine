'use strict';

const test = require('ava');
const Lexer = require('../../src/Lexer');

test(`with empty string`, (t) => {
	const lexer = new Lexer('');
	lexer._scanNextDelimiter();
	t.is(lexer.pointer, 0);
});

test(`with non-delimiter`, (t) => {
	const lexer = new Lexer('aaa');
	lexer._scanNextDelimiter();
	t.is(lexer.pointer, 0);
});

test(`with single character delimiter`, (t) => {
	const lexer = new Lexer('(');
	lexer._scanNextDelimiter();
	t.is(lexer.pointer, 1);
});

test(`with double character delimiter`, (t) => {
	const lexer = new Lexer('==');
	lexer._scanNextDelimiter();
	t.is(lexer.pointer, 2);
});
test(`with triple character delimiter`, (t) => {
	const lexer = new Lexer('===');
	lexer._scanNextDelimiter();
	t.is(lexer.pointer, 3);
});
