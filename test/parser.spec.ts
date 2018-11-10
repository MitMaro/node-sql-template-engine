import * as path from 'path';

import {expect} from 'chai';
import * as fs from 'fs-extra';

import {Lexer} from '../src/lexer';
import {Parser} from '../src/parser';
import {ParserTestCase} from './test-cases/parser-test-case';
import {abstractSyntaxTree} from './util/abstract-syntax-tree-builder';

const parserTestCasesDirectory = path.resolve(__dirname, 'test-cases', 'parser');

describe('Parser', function () {
	const testCaseFiles = fs.readdirSync(parserTestCasesDirectory);
	for (const testCaseFile of testCaseFiles) {
		// eslint-disable-next-line security/detect-non-literal-require
		const {only, description, input, output, expectedError, options} = require(
			path.resolve(parserTestCasesDirectory, testCaseFile)
		).default as ParserTestCase;

		const parserOptions = options === undefined ? {} : options;

		if (expectedError === undefined) {
			(only ? it.only : it)(`should correctly parse with ${description}`, function () {
				const parser = new Parser(new Lexer(input));
				expect(parser.generateAbstractSyntaxTree()).to.deep.equal(
					abstractSyntaxTree(output, 0, 0, parserOptions.templatePath)
				);
			});
		}
		else {
			(only ? it.only : it)(`should error with ${description}`, function () {
				const parser = new Parser(new Lexer(input));
				expect(() => parser.generateAbstractSyntaxTree()).to.throw(expectedError);
			});
		}
	}
});
