import {
	elseIfStatement,
	elseStatement,
	endOfFile,
	ifStatement,
	includeStatement,
	tagEnd,
	tagStart,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'statement if',
	input: [
		'{{ if }}',
		'{{ elif }}',
		'{{ else }}',
		'{{ include }}',
	].join('\n'),
	output: [
		// line 0
		tagStart(0),
		ifStatement(3),
		tagEnd(6),
		// line 1
		tagStart(9, 0, 1),
		elseIfStatement(12, 3, 1),
		tagEnd(17, 8, 1),
		// line 2
		tagStart(20, 0, 2),
		elseStatement(23, 3, 2),
		tagEnd(28, 8, 2),
		// line 3
		tagStart(31, 0, 3),
		includeStatement(34, 3, 3),
		tagEnd(42, 11, 3),
		endOfFile(44, 13, 3),
	],
};

export default testCase;
