import {
	endOfFile,
	singleQuote,
	stringValue,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'single quoted string',
	input: "{{'foo'}}",
	output: [
		tagStart(0),
		singleQuote(2),
		stringValue('foo', 3),
		singleQuote(6),
		tagEnd(7),
		endOfFile(9),
	],
};

export default testCase;
