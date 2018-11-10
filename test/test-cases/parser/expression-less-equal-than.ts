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
	description: 'expression less equal than',
	input: '{{if a <= b}}{{fi}}',
	output: [
		branches(
			[branch(
				binaryExpression(
					variable('a', 5),
					BinaryOperator.LessEqualThan,
					variable('b', 10),
					7
				),
				root([], 13),
				2,
			)],
			2,
		),
	],
};

export default testCase;
