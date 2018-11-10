import {
	endOfFile,
	tagEnd,
	tagStart,
	textLiteral,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'text literal newline after tag',
	input: '{{}}\nfoo',
	output: [
		tagStart(0),
		tagEnd(2),
		textLiteral('foo', 5, 0, 1),
		endOfFile(8, 3, 1),
	],
};

export default testCase;
