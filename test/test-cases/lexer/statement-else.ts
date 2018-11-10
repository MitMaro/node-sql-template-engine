import {
	elseStatement,
	endOfFile,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'statement else',
	input: '{{else}}',
	output: [
		tagStart(0),
		elseStatement(2),
		tagEnd(6),
		endOfFile(8),
	],
};

export default testCase;
