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
	description: 'expression chain with right bracket',
	input: '{{if a > (b > c)}}{{fi}}',
	output: [
		branches(
			[branch(
				binaryExpression(
					variable('a', 5),
					BinaryOperator.GreaterThan,
					binaryExpression(
						variable('b', 10),
						BinaryOperator.GreaterThan,
						variable('c', 14),
						12
					),
					7
				),
				root([], 18),
				2,
			)],
			2,
		),
	],
};

export default testCase;
