import {RuntimeTestCase} from '../runtime-test-case';

const testCase: RuntimeTestCase = {
	description: 'include with variable path',
	template: 'index',
	templates: {
		index: ['{{include "recurse"}}\n'],
		recurse: [
			'a',
			'{{ if sub.value }}',
			'{{ include "./recurse" "sub" }}',
			'{{ fi }}',
		],
	},
	input: {
		sub: {
			value: true,
			sub: {
				value: true,
				sub: {
					value: false,
				},
			},
		},
	},
	output: [
		'a\n',
		'a\n',
		'a\n',
	],
};

export default testCase;
