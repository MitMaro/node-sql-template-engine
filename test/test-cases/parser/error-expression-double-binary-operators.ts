import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression with double binary operators',
	input: '{{if a > > b}}{{fi}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
