import {
	endOfFile,
	tagStart,
	textLiteral,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'text literal before tag',
	input: 'foo{{',
	output: [
		textLiteral('foo', 0),
		tagStart(3),
		endOfFile(5),
	],
};

export default testCase;
