import {
	branch,
	branches,
	literal,
	root,
	variable,
} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'if statement with else',
	input: [
		'{{if foo}}',
		'bar',
		'{{else}}',
		'baz',
		'{{fi}}',
	].join('\n'),
	output: [
		branches(
			[
				branch(
					variable('foo', 5),
					root([literal('bar\n', 0, 1)], 0, 1),
					2,
				),
				branch(
					undefined,
					root([literal('baz\n', 0, 3)], 0, 3),
					2,
					2
				),
			],
			2,
		),
	],
};

export default testCase;
