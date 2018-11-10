import {
	equalNumbers,
	numericVariables,
	unequalNumbers,
} from '../number-values';
import {RuntimeTestCase} from '../runtime-test-case';

const unequalNumericCases = unequalNumbers.map(([a, b]) => `{{ if ${a} !== ${b} }}pass_${a}_${b}{{ fi }}`);
const equalNumericCases = equalNumbers.map(([a, b]) => `{{ if ${a} !== ${b} }}fail_${a}_${b}{{ fi }}`);

const indexTemplate = [...equalNumericCases, ...unequalNumericCases];

const output = unequalNumbers.map(([a, b]) => `pass_${a}_${b}`);

const testCase: RuntimeTestCase = {
	description: 'binary expression strict not equals with numbers',
	template: 'index',
	templates: {
		index: indexTemplate,
	},
	input: numericVariables,
	output,
	options: {
		epsilon: 0.00001,
	},
};

export default testCase;
