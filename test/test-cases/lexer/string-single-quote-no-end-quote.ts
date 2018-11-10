import {
	endOfFile,
	singleQuote,
	stringValue,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'single quoted string with missing end quote',
	input: "{{'foo",
	output: [
		tagStart(0),
		singleQuote(2),
		stringValue('foo', 3),
		endOfFile(6),
	],
};

export default testCase;
