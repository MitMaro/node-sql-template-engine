import {
	endOfFile,
	integerValue,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'expression negative number',
	input: '{{-1}}',
	output: [
		tagStart(0),
		integerValue('-1', 2),
		tagEnd(4),
		endOfFile(6),
	],
};

export default testCase;
