import {
	doubleQuote,
	endOfFile,
	stringValue,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'double quoted string',
	input: '{{"foo"}}',
	output: [
		tagStart(0),
		doubleQuote(2),
		stringValue('foo', 3),
		doubleQuote(6),
		tagEnd(7),
		endOfFile(9),
	],
};

export default testCase;
