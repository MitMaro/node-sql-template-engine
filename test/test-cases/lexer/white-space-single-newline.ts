import {
	endOfFile,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'single tab',
	input: '{{\t}}',
	output: [
		tagStart(0),
		tagEnd(3),
		endOfFile(5),
	],
};

export default testCase;
