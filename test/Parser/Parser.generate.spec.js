'use strict';

import {expect} from 'chai';
import Parser from '../../src/Parser';
import Lexer from '../../src/Lexer';
import {
	literal,
	include,
	value,
	variable,
	branch,
	variableConditional,
	constantConditional,
	conditional,
	andConditional,
	root,
	notConditional
} from '../nodeBuilder';

function getParserResult(input) {
	const inputString = Array.isArray(input) ? input.join('\n') : input;
	const parser = new Parser(new Lexer(inputString));

	return parser.generateAST();
}

describe('Parser.generate', function() {
	it('should parse with empty lexer', function() {
		const result = getParserResult([ '' ]);
		const expected = [];

		expect(result.type).to.equal('ROOT');
		expect(result.statements).to.deep.equal(expected);
	});

	it('should parse with single literal', function() {
		const result = getParserResult('literal value');
		const expected = [
			literal('literal value', 0, 0)
		];

		expect(result.statements).to.deep.equal(expected);
	});

	it('should parse with basic include statement and string value', function() {
		const result = getParserResult('{{include "foo"}}');
		const expected = [
			include(value('foo', 10, 0))
		];

		expect(result.statements).to.deep.equal(expected);
	});

	it('should parse with basic include statement and variable value', function() {
		const result = getParserResult('{{include foo}}');
		const expected = [
			include(variable('foo', 10, 0))
		];

		expect(result.statements).to.deep.equal(expected);
	});

	it('should parse with basic include statement and string dataPath', function() {
		const result = getParserResult('{{include "foo" "bar"}}');
		const expected = [
			include(value('foo', 10, 0), value('bar', 16, 0))
		];

		expect(result.statements).to.deep.equal(expected);
	});

	it('should parse with basic include statement and variable dataPath', function() {
		const result = getParserResult('{{include "foo" bar}}');
		const expected = [
			include(value('foo', 10, 0), variable('bar', 16, 0))
		];

		expect(result.statements).to.deep.equal(expected);
	});

	it('should parse with basic if statement', function() {
		const result = getParserResult('{{if foo}}bar{{fi}}');
		const expected = [
			branch(
				variableConditional('foo', 5, 0, root(literal('bar', 10, 0)))
			)
		];

		expect(result.statements).to.deep.equal(expected);
	});

	it('should parse with if and else statements', function() {
		const result = getParserResult([
			'{{if foo}}',
			'bar',
			'{{else}}',
			'baz',
			'{{fi}}'
		]);
		const expected = [
			branch([
				variableConditional('foo', 5, 0, root(literal('bar\n', 0, 1))),
				constantConditional(root(literal('baz\n', 0, 3)))
			])
		];

		expect(result.statements).to.deep.equal(expected);
	});

	it('should parse with if statement with binary expression', function() {
		const result = getParserResult([
			'{{if foo && bar}}',
			'baz',
			'{{fi}}'
		]);
		const expected = [
			branch([
				conditional(
					andConditional(
						variable('foo', 5, 0),
						variable('bar', 12, 0)
					),
					root(literal('baz\n', 0, 1))
				)
			])
		];

		expect(result.statements).to.deep.equal(expected);
	});

	it('should parse with if statement with unary expression', function() {
		const result = getParserResult([
			'{{if !foo}}',
			'bar',
			'{{fi}}'
		]);
		const expected = [
			branch([
				conditional(
					notConditional(variable('foo', 6, 0)),
					root(literal('bar\n', 0, 1))
				)
			])
		];

		expect(result.statements).to.deep.equal(expected);
	});
});
