import {RuntimeTestCase} from '../runtime-test-case';

const testCase: RuntimeTestCase = {
	description: 'include with string path and string data path',
	template: 'index',
	templates: {
		index: ['{{ include "file" "bar" }}'],
		file: ['AAA'],
	},
	input: {},
	output: [
		'AAA',
	],
};

export default testCase;
