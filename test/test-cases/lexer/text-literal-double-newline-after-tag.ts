import {
	endOfFile,
	tagEnd,
	tagStart,
	textLiteral,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'text literal double newline after tag',
	input: '{{}}\n\nfoo',
	output: [
		tagStart(0),
		tagEnd(2),
		textLiteral('\nfoo', 5, 0, 1),
		endOfFile(9, 3, 2),
	],
};

export default testCase;
