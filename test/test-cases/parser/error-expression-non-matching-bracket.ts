import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression without matching bracket',
	input: '{{if (}}bar{{fi}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
