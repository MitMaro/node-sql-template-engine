import {
	bracketClose,
	bracketOpen,
	endOfFile,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'bracket delimiters',
	input: '{{()}}',
	output: [
		tagStart(0),
		bracketOpen(2),
		bracketClose(3),
		tagEnd(4),
		endOfFile(6),
	],
};

export default testCase;
