'use strict';

const test = require('ava');
const Lexer = require('../../src/Lexer');

test(`with empty string`, (t) => {
	const lexer = new Lexer('');
	lexer.scanString();
	t.is(lexer.pointer, 1);
});

test(`with single character`, (t) => {
	const lexer = new Lexer('a');
	lexer.scanString();
	t.is(lexer.pointer, 1);
});

test(`with a single quote in double quote mode`, (t) => {
	const lexer = new Lexer('\'');
	lexer.stringDelimiter = '"';
	lexer.scanString();
	t.is(lexer.pointer, 1);
});

test(`with a double quote in dingle quote mode`, (t) => {
	const lexer = new Lexer('"');
	lexer.stringDelimiter = '\'';
	lexer.scanString();
	t.is(lexer.pointer, 1);
});

test(`with characters before end single quote`, (t) => {
	const lexer = new Lexer('   \'');
	lexer.stringDelimiter = '\'';
	lexer.scanString();
	t.is(lexer.pointer, 3);
});

test(`with characters before end double quote`, (t) => {
	const lexer = new Lexer('   "');
	lexer.stringDelimiter = '"';
	lexer.scanString();
	t.is(lexer.pointer, 3);
});

test(`with characters after end single quote`, (t) => {
	const lexer = new Lexer('\'  ');
	lexer.stringDelimiter = '\'';
	lexer.scanString();
	t.is(lexer.pointer, 0);
});

test(`with characters after end double quote`, (t) => {
	const lexer = new Lexer('"  ');
	lexer.stringDelimiter = '"';
	lexer.scanString();
	t.is(lexer.pointer, 0);
});

test(`with characters before and after end single quote`, (t) => {
	const lexer = new Lexer('  \'  ');
	lexer.stringDelimiter = '\'';
	lexer.scanString();
	t.is(lexer.pointer, 2);
});

test(`with characters before and after end double quote`, (t) => {
	const lexer = new Lexer('  "  ');
	lexer.stringDelimiter = '"';
	lexer.scanString();
	t.is(lexer.pointer, 2);
});

test(`with escaped single quote`, (t) => {
	const lexer = new Lexer('\\\'');
	lexer.stringDelimiter = '\'';
	lexer.scanString();
	t.is(lexer.pointer, 2);
});

test(`with escaped double quote`, (t) => {
	const lexer = new Lexer('\\"');
	lexer.stringDelimiter = '"';
	lexer.scanString();
	t.is(lexer.pointer, 2);
});
