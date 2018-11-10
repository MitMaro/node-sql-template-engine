import {
	doubleQuote,
	endOfFile,
	stringValue,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'double quoted string with escaped slash',
	input: '{{"foo\\\\s"}}',
	output: [
		tagStart(0),
		doubleQuote(2),
		stringValue('foo\\\\s', 3),
		doubleQuote(9),
		tagEnd(10),
		endOfFile(12),
	],
};

export default testCase;
