import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'include statement with integer value',
	input: '{{include 123}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
