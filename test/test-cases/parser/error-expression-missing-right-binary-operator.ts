import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression with missing right on binary operator',
	input: '{{if a > }}{{fi}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
