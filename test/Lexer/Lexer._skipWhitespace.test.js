'use strict';

const test = require('ava');
const Lexer = require('../../src/Lexer');

test(`with empty string`, (t) => {
	const lexer = new Lexer('');
	lexer._skipWhitespace();
	t.is(lexer.pointer, 0);
});

test(`with space only string`, (t) => {
	const lexer = new Lexer('   ');
	lexer._skipWhitespace();
	t.is(lexer.pointer, 3);
});

test(`with newlines`, (t) => {
	const lexer = new Lexer('\n');
	lexer._skipWhitespace();
	t.is(lexer.pointer, 1);
});

test(`with tabs`, (t) => {
	const lexer = new Lexer('\t');
	lexer._skipWhitespace();
	t.is(lexer.pointer, 1);
});

test(`with not move pointer on non-whitespace`, (t) => {
	const lexer = new Lexer('text');
	lexer._skipWhitespace();
	t.is(lexer.pointer, 0);
});

test(`with skip to text`, (t) => {
	const lexer = new Lexer('  text');
	lexer._skipWhitespace();
	t.is(lexer.pointer, 2);
});
