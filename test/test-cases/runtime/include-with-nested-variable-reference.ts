import {RuntimeTestCase} from '../runtime-test-case';

const testCase: RuntimeTestCase = {
	description: 'include with recursive variable reference',
	template: 'index',
	templates: {
		index: ['{{ include "file1" "bar" }}'],
		file1: ['{{ include path }}'],
		file2: ['AAA'],
	},
	input: {bar: {path: 'file2', foo: 'AAA'}},
	output: [
		'AAA',
	],
};

export default testCase;
