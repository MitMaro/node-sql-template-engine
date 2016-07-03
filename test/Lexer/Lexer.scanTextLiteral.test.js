'use strict';

const test = require('ava');
const Lexer = require('../../src/Lexer');

test(`with empty string`, (t) => {
	const lexer = new Lexer('');
	lexer.scanTextLiteral();
	t.is(lexer.pointer, 0);
});

test(`with single character`, (t) => {
	const lexer = new Lexer('a');
	lexer.scanTextLiteral();
	t.is(lexer.pointer, 1);
});

test(`with only one {`, (t) => {
	const lexer = new Lexer('{');
	lexer.scanTextLiteral();
	t.is(lexer.pointer, 1);
});

test(`with only one { and before characters`, (t) => {
	const lexer = new Lexer('   {');
	lexer.scanTextLiteral();
	t.is(lexer.pointer, 4);
});

test(`with only one { and after characters`, (t) => {
	const lexer = new Lexer('{   ');
	lexer.scanTextLiteral();
	t.is(lexer.pointer, 4);
});

test(`with only one { and before and after characters`, (t) => {
	const lexer = new Lexer('  {  ');
	lexer.scanTextLiteral();
	t.is(lexer.pointer, 5);
});

test(`with both {{`, (t) => {
	const lexer = new Lexer('{{');
	lexer.scanTextLiteral();
	t.is(lexer.pointer, 0);
});

test(`with both {{ and before characters`, (t) => {
	const lexer = new Lexer('  {{');
	lexer.scanTextLiteral();
	t.is(lexer.pointer, 2);
});

test(`with both {{ and after characters`, (t) => {
	const lexer = new Lexer('{{  ');
	lexer.scanTextLiteral();
	t.is(lexer.pointer, 0);
});

test(`with both {{ and before and after characters`, (t) => {
	const lexer = new Lexer('  {{  ');
	lexer.scanTextLiteral();
	t.is(lexer.pointer, 2);
});
