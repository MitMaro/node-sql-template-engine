import {
	branch,
	branches,
	literal,
	root,
	variable,
} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'if statement',
	input: '{{if foo}}bar{{fi}}',
	output: [
		branches(
			[branch(
				variable('foo', 5),
				root([literal('bar', 10)], 10),
				2,
			)],
			2,
		),
	],
};

export default testCase;
