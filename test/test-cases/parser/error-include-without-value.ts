import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'include statement without value',
	input: '{{include}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
