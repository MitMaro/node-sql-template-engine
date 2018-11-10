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
	description: 'expression chain',
	input: '{{if a > b > c}}{{fi}}',
	output: [
		branches(
			[branch(
				binaryExpression(
					binaryExpression(
						variable('a', 5),
						BinaryOperator.GreaterThan,
						variable('b', 9),
						7
					),
					BinaryOperator.GreaterThan,
					variable('c', 13),
					11
				),
				root([], 16),
				2,
			)],
			2,
		),
	],
};

export default testCase;
