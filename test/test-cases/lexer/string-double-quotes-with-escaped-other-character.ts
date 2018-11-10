import {
	doubleQuote,
	endOfFile,
	stringValue,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'single quoted string with an invalid escape',
	input: '{{"foo\\s"}}',
	output: [
		tagStart(0),
		doubleQuote(2),
		stringValue('foo\\s', 3),
		doubleQuote(8),
		tagEnd(9),
		endOfFile(11),
	],
};

export default testCase;
