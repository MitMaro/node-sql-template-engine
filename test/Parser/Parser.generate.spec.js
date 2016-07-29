'use strict';

const expect = require('chai').expect;
const Parser = require('../../src/Parser');
const Lexer = require('../../src/Lexer');
const nb = require('../nodeBuilder');

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
			nb.literal('literal value')
		];
		expect(result.statements).to.deep.equal(expected);
	});
	
	it('should parse with basic include statement and string value', function() {
		const result = getParserResult('{{include "foo"}}');
		const expected = [
			nb.include(nb.value('foo'))
		];
		expect(result.statements).to.deep.equal(expected);
	});
	
	it('should parse with basic include statement and variable value', function() {
		const result = getParserResult('{{include foo}}');
		const expected = [
			nb.include(nb.variable('foo'))
		];
		expect(result.statements).to.deep.equal(expected);
	});
	
	it('should parse with basic if statement', function() {
		const result = getParserResult('{{if foo}}bar{{fi}}');
		const expected = [
			nb.branch(
				nb.variableConditional('foo', nb.root(nb.literal('bar')))
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
			nb.branch([
				nb.variableConditional('foo', nb.root(nb.literal('\nbar\n'))),
				nb.constantConditional(nb.root(nb.literal('\nbaz\n')))
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
			nb.branch([
				nb.conditional(
					nb.andConditional(
						nb.variable('foo'),
						nb.variable('bar')
					),
					nb.root(nb.literal('\nbaz\n'))
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
			nb.branch([
				nb.conditional(
					nb.notConditional(nb.variable('foo')),
					nb.root(nb.literal('\nbar\n'))
				)
			])
		];
		
		expect(result.statements).to.deep.equal(expected);
	});
});
