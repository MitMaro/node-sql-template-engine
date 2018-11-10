import {
	branch,
	branches,
	literal,
	root,
	string,
} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression double quote string',
	input: '{{if "foo"}}bar{{fi}}',
	output: [
		branches(
			[branch(
				string('foo', 5),
				root([literal('bar', 12)], 12),
				2,
			)],
			2,
		),
	],
};

export default testCase;
