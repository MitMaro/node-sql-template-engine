import {
	endOfFile,
	ifStatement,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'statement if',
	input: '{{if}}',
	output: [
		tagStart(0),
		ifStatement(2),
		tagEnd(4),
		endOfFile(6),
	],
};

export default testCase;
