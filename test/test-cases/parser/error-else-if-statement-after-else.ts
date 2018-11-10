import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'else if statement after else',
	input: '{{if foo}}{{else}}{{elif foo}}{{fi}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
