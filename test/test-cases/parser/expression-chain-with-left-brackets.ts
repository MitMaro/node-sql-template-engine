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
	description: 'expression chain with left bracket',
	input: '{{if (a > b) > c}}{{fi}}',
	output: [
		branches(
			[branch(
				binaryExpression(
					binaryExpression(
						variable('a', 6),
						BinaryOperator.GreaterThan,
						variable('b', 10),
						8
					),
					BinaryOperator.GreaterThan,
					variable('c', 15),
					13
				),
				root([], 18),
				2,
			)],
			2,
		),
	],
};

export default testCase;
