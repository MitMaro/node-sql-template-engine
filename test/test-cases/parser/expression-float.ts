import {
	branch,
	branches,
	number,
	root,
} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression float',
	input: '{{if 1.23}}{{fi}}',
	output: [
		branches(
			[branch(
				number(1.23, 5),
				root([], 11),
				2,
			)],
			2,
		),
	],
};

export default testCase;
