import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression with only brackets',
	input: '{{if ()}}{{fi}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
