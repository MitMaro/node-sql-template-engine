import {
	endOfFile,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'single newline',
	input: '{{\n}}',
	output: [
		tagStart(0),
		tagEnd(3, 0, 1),
		endOfFile(5, 2, 1),
	],
};

export default testCase;
