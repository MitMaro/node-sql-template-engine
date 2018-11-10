import {
	endOfFile,
	floatingValue,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'expression negative floating point number',
	input: '{{-1.1}}',
	output: [
		tagStart(0),
		floatingValue('-1.1', 2),
		tagEnd(6),
		endOfFile(8),
	],
};

export default testCase;
