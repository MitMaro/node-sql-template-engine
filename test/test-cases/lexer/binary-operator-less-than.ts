import {
	endOfFile,
	lessThanOperator,
	tagEnd,
	tagStart,
	variable,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'binary < operator',
	input: '{{a<b}}',
	output: [
		tagStart(0),
		variable('a', 2),
		lessThanOperator(3),
		variable('b', 4),
		tagEnd(5),
		endOfFile(7),
	],
};

export default testCase;
