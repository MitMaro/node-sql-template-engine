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
	description: 'expression not on left',
	input: '{{if !a || b}}{{fi}}',
	output: [
		branches(
			[branch(
				binaryExpression(
					unaryExpression(
						UnaryOperator.Not,
						variable('a', 6),
						5
					),
					BinaryOperator.Or,
					variable('b', 11),
					8
				),
				root([], 14),
				2,
			)],
			2,
		),
	],
};

export default testCase;
