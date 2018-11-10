import {
	endOfFile,
	tagEnd,
	tagStart,
	variable,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'double non-delimiter characters',
	input: '{{aa}}',
	output: [
		tagStart(0),
		variable('aa', 2),
		tagEnd(4),
		endOfFile(6),
	],
};

export default testCase;
