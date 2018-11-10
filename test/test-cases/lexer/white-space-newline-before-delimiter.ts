import {
	endOfFile,
	tagEnd,
	tagStart,
	variable,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'newline before delimiter',
	input: '{{\na}}',
	output: [
		tagStart(0),
		variable('a', 3, 0, 1),
		tagEnd(4, 1, 1),
		endOfFile(6, 3, 1),
	],
};

export default testCase;
