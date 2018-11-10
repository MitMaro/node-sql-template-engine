import {RuntimeTestCase} from '../runtime-test-case';

const testCase: RuntimeTestCase = {
	description: 'include with string path and variable data path',
	template: 'index',
	templates: {
		index: ['{{ include "file" bar }}'],
		file: ['AAA'],
	},
	input: {bar: 'bar'},
	output: [
		'AAA',
	],
};

export default testCase;
