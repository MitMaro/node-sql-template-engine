import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression with missing left on binary operator',
	input: '{{if > s}}{{fi}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
