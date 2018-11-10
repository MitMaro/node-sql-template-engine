import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'include statement with expression data path',
	input: '{{include foo (a == b)}}',
	output: [],
	expectedError: 'Unexpected token',
};

export default testCase;
