'use strict';

const test = require('ava');
const Lexer = require('../../src/Lexer');

test(`with empty string`, (t) => {
	const lexer = new Lexer('');
	lexer._scanString();
	t.is(lexer.pointer, 1); // EOF
});

test(`with single character`, (t) => {
	const lexer = new Lexer('a');
	lexer._scanString();
	t.is(lexer.pointer, 1); // EOF
});

test(`with a single quote in double quote mode`, (t) => {
	const lexer = new Lexer('\'');
	lexer._stringDelimiter = '"';
	lexer._scanString();
	t.is(lexer.pointer, 1); //EOF
});

test(`with a double quote in dingle quote mode`, (t) => {
	const lexer = new Lexer('"');
	lexer._stringDelimiter = '\'';
	lexer._scanString();
	t.is(lexer.pointer, 1); //EOF
});

test(`with characters before end single quote`, (t) => {
	const lexer = new Lexer('   \'');
	lexer._stringDelimiter = '\'';
	lexer._scanString();
	t.is(lexer.pointer, 3); //EOF
});

test(`with characters before end double quote`, (t) => {
	const lexer = new Lexer('   "');
	lexer._stringDelimiter = '"';
	lexer._scanString();
	t.is(lexer.pointer, 3); //EOF
});

test(`with characters after end single quote`, (t) => {
	const lexer = new Lexer('\'  ');
	lexer._stringDelimiter = '\'';
	lexer._scanString();
	t.is(lexer.pointer, 0); //EOF
});

test(`with characters after end double quote`, (t) => {
	const lexer = new Lexer('"  ');
	lexer._stringDelimiter = '"';
	lexer._scanString();
	t.is(lexer.pointer, 0); //EOF
});

test(`with characters before and after end single quote`, (t) => {
	const lexer = new Lexer('  \'  ');
	lexer._stringDelimiter = '\'';
	lexer._scanString();
	t.is(lexer.pointer, 2); //EOF
});

test(`with characters before and after end double quote`, (t) => {
	const lexer = new Lexer('  "  ');
	lexer._stringDelimiter = '"';
	lexer._scanString();
	t.is(lexer.pointer, 2); //EOF
});

test(`with escaped single quote`, (t) => {
	const lexer = new Lexer('\\\'');
	lexer._stringDelimiter = '\'';
	lexer._scanString();
	t.is(lexer.pointer, 2); //EOF
});

test(`with escaped double quote`, (t) => {
	const lexer = new Lexer('\\"');
	lexer._stringDelimiter = '"';
	lexer._scanString();
	t.is(lexer.pointer, 2); //EOF
});
