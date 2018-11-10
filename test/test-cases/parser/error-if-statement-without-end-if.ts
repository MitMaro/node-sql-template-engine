import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'if statement without end if',
	input: '{{if foo}}',
	output: [],
	expectedError: 'Unexpected end of tokens',
};

export default testCase;
