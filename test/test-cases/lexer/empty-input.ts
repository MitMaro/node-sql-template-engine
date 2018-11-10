import {endOfFile} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'empty input',
	input: '',
	output: [
		endOfFile(0),
	],
};

export default testCase;
