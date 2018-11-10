import {
	bracketOpen,
	endOfFile,
	tagEnd,
	tagStart,
	variable,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'character before a single character delimiter',
	input: '{{a(}}',
	output: [
		tagStart(0),
		variable('a', 2),
		bracketOpen(3),
		tagEnd(4),
		endOfFile(6),
	],
};

export default testCase;
