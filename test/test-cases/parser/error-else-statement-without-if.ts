import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'else statement without if',
	input: '{{else foo}}{{fi}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
