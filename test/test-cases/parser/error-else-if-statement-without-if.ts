import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'else if statement without if',
	input: '{{elif foo}}{{fi}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
