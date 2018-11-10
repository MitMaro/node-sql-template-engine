import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'missing matching tag',
	input: '{{',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
