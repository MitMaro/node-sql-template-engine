import * as path from 'path';

import {expect} from 'chai';
import * as fs from 'fs-extra';
import {
	AbstractSyntaxTree,
	ExpressionNode,
	NodeType, StatementNode,
	StringNode,
} from '../src/abstract-syntax-tree';
import {FileLoadError} from '../src/error/file-load';
import {
	RuntimeError,
	RuntimeMaximumCallStackExceededError,
	RuntimeReadError,
	RuntimeReferenceError,
} from '../src/error/runtime';

import {Lexer} from '../src/lexer';
import {BinaryOperator, UnaryOperator} from '../src/operator';
import {Parser} from '../src/parser';
import {Runtime} from '../src/runtime';
import {RuntimeTestCase} from './test-cases/runtime-test-case';

import {
	abstractSyntaxTree,
	binaryExpression,
	branch,
	branches,
	include,
	literal,
	number,
	root,
	string,
	unaryExpression,
	variable,
} from './util/abstract-syntax-tree-builder';

const parserTestCasesDirectory = path.resolve(__dirname, 'test-cases', 'runtime');

async function defaultLoadTemplateFile(): Promise<AbstractSyntaxTree> {
	return abstractSyntaxTree([]);
}

describe('Runtime', function () {
	const testCaseFiles = fs.readdirSync(parserTestCasesDirectory);
	for (const testCaseFile of testCaseFiles) {
		const testCases = require(
			path.resolve(parserTestCasesDirectory, testCaseFile)
		).default;

		for (const testCase of Array.isArray(testCases) ? testCases : [testCases]) {
			// eslint-disable-next-line security/detect-non-literal-require
			const {
				only,
				description,
				template,
				templates,
				input,
				output,
				options,
			} = testCase as RuntimeTestCase;

			const runtimeOptions = options === undefined ? {} : options;

			const loadTestTemplateFile = async (file: string): Promise<AbstractSyntaxTree> => {
				const templateFileName = file.replace(
					runtimeOptions.rootPath === undefined ? `${process.cwd()}/` : runtimeOptions.rootPath, ''
				);
				if (!templates[templateFileName]) {
					throw new Error(`No template could be loaded for ${templateFileName}`);
				}
				return new Parser(new Lexer(templates[templateFileName].join('\n'))).generateAbstractSyntaxTree();
			};

			(only ? it.only : it)(`should correctly run with ${description}`, async function () {
				const runtime = new Runtime(loadTestTemplateFile, runtimeOptions);
				expect(await runtime.invoke(await loadTestTemplateFile(template), input)).to.deep.equal(output);
			});
		}
	}

	it('should error on invalid binary operator', function () {
		const runtime = new Runtime(defaultLoadTemplateFile);
		const ast = abstractSyntaxTree([
			branches([
				branch(
					binaryExpression(string('foo'), 'invalid' as BinaryOperator, string('foo')),
					root([literal('bar')])
				),
			]),
		]);

		return expect(runtime.invoke(ast, {})).to.be.rejectedWith(RuntimeError, 'Unknown operator');
	});

	it('should error on invalid unary operator', function () {
		const runtime = new Runtime(defaultLoadTemplateFile);
		const ast = abstractSyntaxTree([
			branches([
				branch(
					unaryExpression('invalid' as UnaryOperator, string('foo')),
					root([literal('bar')])
				),
			]),
		]);

		return expect(runtime.invoke(ast, {})).to.be.rejectedWith(RuntimeError, 'Unknown operator');
	});

	it('should error on unknown expression', function () {
		const runtime = new Runtime(defaultLoadTemplateFile);
		// tslint:disable-next-line no-object-literal-type-assertion
		const invalidExpression: ExpressionNode = {
			type: 'unknown' as NodeType,
			value: 'foo',
			column: 0,
			row: 0,
		} as ExpressionNode;
		const ast = abstractSyntaxTree([
			branches([
				branch(
					invalidExpression,
					root([literal('bar')])
				),
			]),
		]);

		return expect(runtime.invoke(ast, {})).to.be.rejectedWith(RuntimeError, 'Unknown expression type');
	});

	it('should error on invalid data path', function () {
		const runtime = new Runtime(defaultLoadTemplateFile);
		const ast = abstractSyntaxTree([
			include(string('foo'), variable('does.not.exist')),
		]);

		return expect(runtime.invoke(ast, {}))
			.to.eventually.be.rejectedWith(RuntimeError, 'exist is not defined')
			.to.have.property('cause').is.instanceOf(RuntimeReferenceError);
	});

	it('should error on non-string data path', function () {
		const runtime = new Runtime(defaultLoadTemplateFile);
		// tslint:disable-next-line:no-any
		const invalidPathValue: StringNode = number(0) as any;
		const ast = abstractSyntaxTree([
			include(invalidPathValue),
		]);

		return expect(runtime.invoke(ast, {}))
			.to.eventually.be.rejectedWith(RuntimeError, 'Non-string type passed as path')
			.to.have.property('templatePath').to.equal('0');
	});

	it('should error on nested invalid data path', function () {
		const ast = abstractSyntaxTree([
			include(string('foo'), string('does')),
		]);

		const runtime = new Runtime(async (): Promise<AbstractSyntaxTree> => ast);

		return expect(runtime.invoke(ast, {does: {}}))
			.to.eventually.be.rejectedWith(RuntimeMaximumCallStackExceededError, 'Maximum call stack exceeded');
	});

	it('should error on non-string include path', function () {
		const runtime = new Runtime(defaultLoadTemplateFile);

		const ast = abstractSyntaxTree([
			include(string('foo'), variable('foo')),
		]);

		return expect(runtime.invoke(ast, {foo: 0}))
			.to.eventually.be.rejectedWith(RuntimeError, 'Invalid data path: 0');
	});

	it('should error object variable reference', function () {
		const runtime = new Runtime(defaultLoadTemplateFile);
		const ast = abstractSyntaxTree([
			branches([
				branch(
					unaryExpression(UnaryOperator.Not, variable('foo')),
					root([literal('bar')])
				),
			]),
		]);

		return expect(runtime.invoke(ast, {foo: {}}))
			.to.be.rejectedWith(RuntimeError, 'Invalid use of object in expression');
	});

	it('should error on unexpected statement', function () {
		const runtime = new Runtime(defaultLoadTemplateFile);

		const unexpectedStatement: StatementNode = {
			column: 0,
			row: 0,
			type: 'invalid' as NodeType,
			value: 'my-value',
			// tslint:disable-next-line:no-any
		} as any;
		const ast = abstractSyntaxTree([unexpectedStatement]);

		return expect(runtime.invoke(ast, {foo: 0}))
			.to.eventually.be.rejectedWith(RuntimeError, 'Unexpected statement');
	});

	it('should error on file loading error', function () {
		const runtime = new Runtime((): Promise<AbstractSyntaxTree> => {
			throw new FileLoadError('Permission denied', 'foo');
		});

		const ast = abstractSyntaxTree([include(string('foo'))]);

		return expect(runtime.invoke(ast, {foo: 0}))
			.to.eventually.be.rejectedWith(RuntimeReadError, 'Error loading template file')
			.to.have.property('cause').is.instanceOf(FileLoadError);
	});

	it('should error on invalid reference in recursive include', function () {
		const runtime = new Runtime(async (p: string): Promise<AbstractSyntaxTree> => {
			if (p === '/foo') {
				return abstractSyntaxTree([
					include(string('/bar'), string('foo')),
				]);
			}
			return abstractSyntaxTree([
				include(variable('bar')),
			]);
		});

		const ast = abstractSyntaxTree([
			include(string('/foo')),
		]);

		return expect(runtime.invoke(ast, {}))
			.to.eventually.be.rejectedWith(RuntimeError, 'bar is not defined');
	});
});
