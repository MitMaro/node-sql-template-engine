import {
	endOfFile,
	notOperator,
	tagEnd,
	tagStart,
	variable,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'unary ! operator',
	input: '{{!a}}',
	output: [
		tagStart(0),
		notOperator(2),
		variable('a', 3),
		tagEnd(4),
		endOfFile(6),
	],
};

export default testCase;
