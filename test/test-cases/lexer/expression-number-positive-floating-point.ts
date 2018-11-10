import {
	endOfFile,
	floatingValue,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'expression positive floating point number',
	input: '{{1.1}}',
	output: [
		tagStart(0),
		floatingValue('1.1', 2),
		tagEnd(5),
		endOfFile(7),
	],
};

export default testCase;
