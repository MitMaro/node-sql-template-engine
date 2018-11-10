import {
	elseIfStatement,
	endOfFile,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'statement else if',
	input: '{{elif}}',
	output: [
		tagStart(0),
		elseIfStatement(2),
		tagEnd(6),
		endOfFile(8),
	],
};

export default testCase;
