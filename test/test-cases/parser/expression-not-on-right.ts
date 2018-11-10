import {BinaryOperator, UnaryOperator} from '../../../src/operator';
import {
	binaryExpression,
	branch,
	branches,
	root, unaryExpression,
	variable,
} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression not on right',
	input: '{{if a || !b}}{{fi}}',
	output: [
		branches(
			[branch(
				binaryExpression(
					variable('a', 5),
					BinaryOperator.Or,
					unaryExpression(
						UnaryOperator.Not,
						variable('b', 11),
						10
					),
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
