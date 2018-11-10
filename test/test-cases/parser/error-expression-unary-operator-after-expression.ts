import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression with unary operator after expression',
	input: '{{if a ! }}{{fi}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
