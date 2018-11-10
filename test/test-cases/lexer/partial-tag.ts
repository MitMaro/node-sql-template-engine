import {
	endOfFile,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	// only: true,
	description: 'partial tag',
	input: '{{ ',
	output: [
		tagStart(0),
		endOfFile(3),
	],
};

export default testCase;
