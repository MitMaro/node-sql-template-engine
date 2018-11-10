import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'else if statement without expression',
	input: '{{if foo}}{{elif}}{{fi}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
