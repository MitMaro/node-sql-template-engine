'use strict';

import path from 'path';
import fs from 'fs';
import {expect} from 'chai';
import RuntimeError from '../../src/error/Runtime';
import Parser from '../../src/Parser';
import Lexer from '../../src/Lexer';
import Runtime from '../../src/Runtime';
import {
	branch,
	conditional,
	constantConditional,
	include,
	invalidExpression,
	invalidStatement,
	literal,
	root,
	value,
} from '../nodeBuilder';

const fixtureDirectory = path.resolve(__dirname, 'fixtures');

describe('Runtime.invoke', function() {
	let runtime;

	beforeEach(function() {
		runtime = new Runtime({rootPath: fixtureDirectory});
	});

	[
		{
			description: 'literal value only',
			input: 'literal/in',
			output: 'literal/out',
			variables: {}
		},
		{
			description: 'basic if statement with true value',
			input: 'basic-if/in',
			output: 'basic-if/out-1',
			variables: {foo: true}
		},
		{
			description: 'basic if statement with false value',
			input: 'basic-if/in',
			output: 'basic-if/out-2',
			variables: {foo: false}
		},
		{
			description: 'basic include',
			input: 'basic-include/in',
			output: 'basic-include/out',
			variables: {}
		},
		{
			description: 'nested include',
			input: 'nested-include/in',
			output: 'nested-include/out',
			variables: {}
		},
		{
			description: 'recursive include',
			input: 'recursive-include/in',
			output: 'recursive-include/out',
			variables: {
				sub: {
					sub: {
						sub: false, value: 'foo'
					}
				}
			}
		},
		{
			description: 'variable-include',
			input: 'variable-include/in',
			output: 'variable-include/out',
			variables: {
				templatePath: 'a.tpl'
			}
		}
	].forEach(({input, output, description, variables}) => {
		it(`should have correct result with ${description}`, async function () {
			const inputFile = fs.readFileSync(path.join(fixtureDirectory, 'cases', input), 'UTF-8');
			const outputFile = fs.readFileSync(path.join(fixtureDirectory, 'cases', output), 'UTF-8');
			const ast = new Parser(new Lexer(inputFile)).generateAST();
			const results = await runtime.invoke(ast, variables);
			expect(results.join('')).to.equal(outputFile);
		});
	});

	it('should invoke on true condition in branch', async function() {
		await runtime.invoke(
			root([
				branch([
					conditional(value(false), root(literal('aaa'))),
					conditional(value(true), root(literal('bbb')))
				])
			])
		);
		expect(runtime.result).to.deep.equal([ 'bbb' ]);
	});

	it('should invoke else in branch', async function() {
		await runtime.invoke(
			root([
				branch([
					conditional(value(false), root(literal('aaa'))),
					constantConditional(root(literal('bbb')))
				])
			])
		);
		expect(runtime.result).to.deep.equal([ 'bbb' ]);
	});

	it('should not invoke on false condition', async function() {
		await runtime.invoke(
			root([branch(conditional(value(false), root(literal('foo'))))])
		);
		expect(runtime.result).to.deep.equal([]);
	});

	it('should error on invalid condition expression in branch', async function() {
		return runtime
			.invoke(
				root([branch(conditional(invalidExpression, root()))])
			)
			.then(() => {
				throw new Error('Did not error when expected');
			})
			.catch((err) => {
				expect(err).to.be.instanceOf(RuntimeError);
			});
	});

	it('should load an absolute path template', async function() {
		const templatePath = path.resolve(__dirname, 'fixtures', 'a.tpl');
		await runtime.invoke(root([include(value(templatePath))]));
		expect(runtime.result).to.deep.equal([ 'aaa\n' ]);
	});

	it('should error on invalid statement type', function() {
		return runtime
			.invoke(root([invalidStatement()]))
			.then(() => {
				throw new Error('Did not error when expected');
			})
			.catch((err) => {
				expect(err.message).to.equal('Unexpected statement');
			});
	});

	it('should error on invalid expression inside an included template', function() {
		runtime.astCache.set('/invalid.tpl', root([]));
		return runtime
			.invoke(root([include(value('/invalid.tpl'), invalidStatement())]))
			.then(() => {
				throw new Error('Did not error when expected');
			})
			.catch((err) => {
				expect(err).to.be.an.instanceOf(RuntimeError);
			});
	});

	it('should error on file not found error', function() {
		const templatePath = path.resolve(__dirname, 'fixtures', 'file-not-found.tpl');

		return runtime
			.invoke(root([include(value(templatePath))]))
			.then(() => {
				throw new Error('Did not error when expected');
			})
			.catch((err) => {
				expect(err.message).to.equal('File not found');
			});
	});

	it('should error on file permission access error', function() {
		const templatePath = path.resolve(__dirname, 'fixtures', 'access-denied.tpl');

		return runtime
			.invoke(root([include(value(templatePath))]))
			.then(() => {
				throw new Error('Did not error when expected');
			})
			.catch((err) => {
				expect(err.message).to.equal('Permission denied');
			});
	});
});
