import {RuntimeTestCase} from '../runtime-test-case';

const expressions: {[name: string]: boolean} = {
	'"foo"': false,
	'""': true,
	'"-1.1"': false,
	'"-1"': false,
	'"0"': false,
	'"1"': false,
	'"1.1"': false,
	'-1.1': false,
	'-1': false,
	0: true,
	1: false,
	1.1: false,
	true: false,
	false: true,
};

const testCases: RuntimeTestCase[] = [];
for (const expression in expressions) {
	testCases.push({
		description: `unary expression - !${expression} is ${expressions[expression]}`,
		template: 'index',
		templates: {
			index: [`{{ if ! ${expression} }}A{{ fi }}`],
		},
		input: {true: true, false: false},
		output: expressions[expression] === true ? ['A'] : [],
	});
}

export default testCases;
