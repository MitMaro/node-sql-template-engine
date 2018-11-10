import {RuntimeTestCase} from '../runtime-test-case';

const testCase: RuntimeTestCase = {
	description: 'include with string path',
	template: 'index',
	templates: {
		index: ['{{ include "file" }}'],
		file: ['AAA'],
	},
	input: {},
	output: [
		'AAA',
	],
};

export default testCase;
