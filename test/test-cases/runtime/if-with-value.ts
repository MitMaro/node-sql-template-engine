import {RuntimeTestCase} from '../runtime-test-case';

const testCase: RuntimeTestCase = {
	description: 'basic if',
	template: 'index',
	templates: {
		index: [
			'{{ if "foo" }}',
			'    AAA',
			'{{ fi }}',
		],
	},
	input: {foo: true},
	output: [
		'    AAA\n',
	],
};

export default testCase;
