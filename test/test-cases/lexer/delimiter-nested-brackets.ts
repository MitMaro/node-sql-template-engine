import {
	bracketClose,
	bracketOpen,
	endOfFile,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'nested bracket delimiters',
	input: '{{ ( ( ) ) }}',
	output: [
		tagStart(0),
		bracketOpen(3),
		bracketOpen(5),
		bracketClose(7),
		bracketClose(9),
		tagEnd(11),
		endOfFile(13),
	],
};

export default testCase;
