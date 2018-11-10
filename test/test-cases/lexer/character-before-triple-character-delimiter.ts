import {
	endOfFile,
	strictEqualsOperator,
	tagEnd,
	tagStart,
	variable,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'character before a double character delimiter',
	input: '{{a===}}',
	output: [
		tagStart(0),
		variable('a', 2),
		strictEqualsOperator(3),
		tagEnd(6),
		endOfFile(8),
	],
};

export default testCase;
