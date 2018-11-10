import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'elif statement without if',
	input: '{{if foo}}{{else}}{{elif foo}}{{fi}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
