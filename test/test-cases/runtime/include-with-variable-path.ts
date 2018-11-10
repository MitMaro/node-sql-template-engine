import {RuntimeTestCase} from '../runtime-test-case';

const testCase: RuntimeTestCase = {
	description: 'include with variable path',
	template: 'index',
	templates: {
		index: ['{{ include foo }}'],
		file: ['AAA'],
	},
	input: {foo: 'file'},
	output: [
		'AAA',
	],
};

export default testCase;
