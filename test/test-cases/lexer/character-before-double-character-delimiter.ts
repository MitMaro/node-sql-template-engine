import {
	endOfFile,
	equalsOperator,
	tagEnd,
	tagStart,
	variable,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'character before a double character delimiter',
	input: '{{a==}}',
	output: [
		tagStart(0),
		variable('a', 2),
		equalsOperator(3),
		tagEnd(5),
		endOfFile(7),
	],
};

export default testCase;
