import {
	branch,
	branches,
	root,
	variable,
} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression variable',
	input: '{{if a}}{{fi}}',
	output: [
		branches(
			[branch(
				variable('a', 5),
				root([], 8),
				2,
			)],
			2,
		),
	],
};

export default testCase;
