import {
	endOfFile,
	singleQuote,
	stringValue,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'single quoted string with escaped double quote',
	input: "{{'foo\\\"s'}}",
	output: [
		tagStart(0),
		singleQuote(2),
		stringValue('foo\\"s', 3),
		singleQuote(9),
		tagEnd(10),
		endOfFile(12),
	],
};

export default testCase;
