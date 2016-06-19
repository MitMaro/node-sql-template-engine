'use strict';

const test = require('ava');
const Lexer = require('../../src/Lexer');

test(`with empty string`, (t) => {
	const lexer = new Lexer('');
	lexer._scanTextLiteral();
	t.is(lexer.pointer, 0); // EOF
});

test(`with single character`, (t) => {
	const lexer = new Lexer('a');
	lexer._scanTextLiteral();
	t.is(lexer.pointer, 1); // EOF
});

test(`with only one {`, (t) => {
	const lexer = new Lexer('{');
	lexer._scanTextLiteral();
	t.is(lexer.pointer, 1); //EOF
});

test(`with only one { and before characters`, (t) => {
	const lexer = new Lexer('   {');
	lexer._scanTextLiteral();
	t.is(lexer.pointer, 4); //EOF
});

test(`with only one { and after characters`, (t) => {
	const lexer = new Lexer('{   ');
	lexer._scanTextLiteral();
	t.is(lexer.pointer, 4); //EOF
});

test(`with only one { and before and after characters`, (t) => {
	const lexer = new Lexer('  {  ');
	lexer._scanTextLiteral();
	t.is(lexer.pointer, 5); //EOF
});

test(`with both {{`, (t) => {
	const lexer = new Lexer('{{');
	lexer._scanTextLiteral();
	t.is(lexer.pointer, 0);
});

test(`with both {{ and before characters`, (t) => {
	const lexer = new Lexer('  {{');
	lexer._scanTextLiteral();
	t.is(lexer.pointer, 2);
});

test(`with both {{ and after characters`, (t) => {
	const lexer = new Lexer('{{  ');
	lexer._scanTextLiteral();
	t.is(lexer.pointer, 0);
});

test(`with both {{ and before and after characters`, (t) => {
	const lexer = new Lexer('  {{  ');
	lexer._scanTextLiteral();
	t.is(lexer.pointer, 2);
});
