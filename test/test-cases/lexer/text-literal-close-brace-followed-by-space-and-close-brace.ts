import {
	endOfFile,
	textLiteral,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'text literal of close brace followed by a space and close brace',
	input: '} }',
	output: [
		textLiteral('} }', 0),
		endOfFile(3),
	],
};

export default testCase;
