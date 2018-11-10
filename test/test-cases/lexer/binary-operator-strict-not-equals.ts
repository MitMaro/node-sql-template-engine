import {
	endOfFile,
	strictNotEqualsOperator,
	tagEnd,
	tagStart,
	variable,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'binary !== operator',
	input: '{{a!==b}}',
	output: [
		tagStart(0),
		variable('a', 2),
		strictNotEqualsOperator(3),
		variable('b', 6),
		tagEnd(7),
		endOfFile(9),
	],
};

export default testCase;
