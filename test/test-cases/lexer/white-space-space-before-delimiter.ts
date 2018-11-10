import {
	endOfFile,
	tagEnd,
	tagStart,
	variable,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'space before delimiter',
	input: '{{ a}}',
	output: [
		tagStart(0),
		variable('a', 3),
		tagEnd(4),
		endOfFile(6),
	],
};

export default testCase;
