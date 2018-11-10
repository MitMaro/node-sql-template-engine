import {RuntimeTestCase} from '../runtime-test-case';

const testCase: RuntimeTestCase = {
	description: 'include with nested include',
	template: 'index',
	templates: {
		index: ['{{ include "file1" }}'],
		file1: ['BBB{{ include "file2" }}'],
		file2: ['AAA'],
	},
	input: {},
	output: [
		'BBB',
		'AAA',
	],
};

export default testCase;
