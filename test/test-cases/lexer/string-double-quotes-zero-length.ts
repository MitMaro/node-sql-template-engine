import {
	doubleQuote,
	endOfFile,
	stringValue,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'single quoted zero length string',
	input: '{{""}}',
	output: [
		tagStart(0),
		doubleQuote(2),
		stringValue('', 3),
		doubleQuote(3),
		tagEnd(4),
		endOfFile(6),
	],
};

export default testCase;
