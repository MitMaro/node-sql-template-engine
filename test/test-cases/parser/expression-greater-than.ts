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
	description: 'expression greater than',
	input: '{{if a > b}}{{fi}}',
	output: [
		branches(
			[branch(
				binaryExpression(
					variable('a', 5),
					BinaryOperator.GreaterThan,
					variable('b', 9),
					7
				),
				root([], 12),
				2,
			)],
			2,
		),
	],
};

export default testCase;
