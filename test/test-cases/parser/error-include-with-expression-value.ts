import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'include statement with expression',
	input: '{{include (a == b)}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
