import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'include statement with integer data path',
	input: '{{include foo 123}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
