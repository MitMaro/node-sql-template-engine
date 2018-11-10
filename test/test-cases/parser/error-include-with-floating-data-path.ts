import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'include statement with floating data path',
	input: '{{include foo 1.23}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
