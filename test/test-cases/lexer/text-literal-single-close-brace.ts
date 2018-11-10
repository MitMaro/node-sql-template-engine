import {
	endOfFile,
	textLiteral,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'text literal single close brace',
	input: '}',
	output: [
		textLiteral('}', 0),
		endOfFile(1),
	],
};

export default testCase;
