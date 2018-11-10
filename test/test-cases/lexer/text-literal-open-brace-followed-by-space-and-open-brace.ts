import {
	endOfFile,
	textLiteral,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'text literal of open brace followed by a space and open brace',
	input: '{ {',
	output: [
		textLiteral('{ {', 0),
		endOfFile(3),
	],
};

export default testCase;
