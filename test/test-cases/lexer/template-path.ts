import {
	endOfFile,
	textLiteral,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'template path',
	input: 'foo',
	output: [
		textLiteral('foo', 0, 0, 0, 'custom-path.tpl'),
		endOfFile(3, 3, 0, 'custom-path.tpl'),
	],
	options: {
		templatePath: 'custom-path.tpl',
	},
};

export default testCase;
