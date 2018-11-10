import {RuntimeTestCase} from '../runtime-test-case';

const testCase: RuntimeTestCase = {
	description: 'empty input',
	template: 'index',
	templates: {
		index: [''],
	},
	input: {},
	output: [],
};

export default testCase;
