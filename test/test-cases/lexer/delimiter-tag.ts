import {
	endOfFile,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'tag delimiters',
	input: '{{}}',
	output: [
		tagStart(0),
		tagEnd(2),
		endOfFile(4),
	],
};

export default testCase;
