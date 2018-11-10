import {
	endOfFile,
	tagEnd,
	tagStart,
	textLiteral,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'text literal after tag',
	input: '{{}}foo',
	output: [
		tagStart(0),
		tagEnd(2),
		textLiteral('foo', 4),
		endOfFile(7),
	],
};

export default testCase;
