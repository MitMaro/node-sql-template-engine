import {
	endOfFile,
	integerValue,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'expression number zero',
	input: '{{0}}',
	output: [
		tagStart(0),
		integerValue('0', 2),
		tagEnd(3),
		endOfFile(5),
	],
};

export default testCase;
