import {
	endOfFile,
	includeStatement,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'statement include',
	input: '{{include}}',
	output: [
		tagStart(0),
		includeStatement(2),
		tagEnd(9),
		endOfFile(11),
	],
};

export default testCase;
