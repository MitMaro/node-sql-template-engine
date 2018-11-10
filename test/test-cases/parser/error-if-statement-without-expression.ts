import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'if statement without expression',
	input: '{{if}}{{fi}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
