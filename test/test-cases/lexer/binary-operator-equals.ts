import {
	endOfFile,
	equalsOperator,
	tagEnd,
	tagStart,
	variable,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'binary == operator',
	input: '{{a==b}}',
	output: [
		tagStart(0),
		variable('a', 2),
		equalsOperator(3),
		variable('b', 5),
		tagEnd(6),
		endOfFile(8),
	],
};

export default testCase;
