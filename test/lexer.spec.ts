import * as path from 'path';

import {expect} from 'chai';
import * as fs from 'fs-extra';

import {Lexer} from '../src/lexer';
import {LexerTestCase} from './test-cases/lexer-test-case';

const lexerTestCasesDirectory = path.resolve(__dirname, 'test-cases', 'lexer');

describe('Lexer', function () {
	const testCaseFiles = fs.readdirSync(lexerTestCasesDirectory);
	for (const testCaseFile of testCaseFiles) {
		// eslint-disable-next-line security/detect-non-literal-require
		const {only, description, input, output, options} = require(
			path.resolve(lexerTestCasesDirectory, testCaseFile)
		).default as LexerTestCase;

		const lexerOptions = options === undefined ? {} : options;
		(only ? it.only : it)(`should correctly tokenize with ${description}`, function () {
			const lexer = new Lexer(input, lexerOptions.templatePath);
			expect(Array.from(lexer.tokens())).to.deep.equal(output);
		});
	}
});
