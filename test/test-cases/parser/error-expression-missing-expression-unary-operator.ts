import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression with missing expression unary operator',
	input: '{{if ! }}{{fi}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
