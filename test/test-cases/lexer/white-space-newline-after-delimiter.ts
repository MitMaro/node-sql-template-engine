import {
	endOfFile,
	tagEnd,
	tagStart,
	variable,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'newline after delimiter',
	input: '{{a\n}}',
	output: [
		tagStart(0),
		variable('a', 2),
		tagEnd(4, 0, 1),
		endOfFile(6, 2, 1),
	],
};

export default testCase;
