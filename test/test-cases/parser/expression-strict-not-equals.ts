import {BinaryOperator} from '../../../src/operator';
import {
	binaryExpression,
	branch,
	branches,
	root,
	variable,
} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression strict not equals',
	input: '{{if a !== b}}{{fi}}',
	output: [
		branches(
			[branch(
				binaryExpression(
					variable('a', 5),
					BinaryOperator.StrictNotEquals,
					variable('b', 11),
					7
				),
				root([], 14),
				2,
			)],
			2,
		),
	],
};

export default testCase;
