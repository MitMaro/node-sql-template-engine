import {
	branch,
	branches,
	number,
	root,
} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression integer',
	input: '{{if 123}}{{fi}}',
	output: [
		branches(
			[branch(
				number(123, 5),
				root([], 10),
				2,
			)],
			2,
		),
	],
};

export default testCase;
