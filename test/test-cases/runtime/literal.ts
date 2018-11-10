import {RuntimeTestCase} from '../runtime-test-case';

const testCase: RuntimeTestCase = {
	description: 'literal',
	template: 'index',
	templates: {
		index: ['AAA'],
	},
	input: {},
	output: [
		'AAA',
	],
};

export default testCase;
