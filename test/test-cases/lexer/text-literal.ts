import {
	endOfFile,
	textLiteral,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'text literal',
	input: 'foo',
	output: [
		textLiteral('foo', 0),
		endOfFile(3),
	],
};

export default testCase;
