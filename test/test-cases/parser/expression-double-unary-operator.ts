import {UnaryOperator} from '../../../src/operator';
import {
	branch,
	branches,
	root,
	unaryExpression,
	variable,
} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'expression not',
	input: '{{if !!a}}{{fi}}',
	output: [
		branches(
			[branch(
				unaryExpression(
					UnaryOperator.Not,
					unaryExpression(
						UnaryOperator.Not,
						variable('a', 7),
						6
					),
					5,
				),
				root([], 10),
				2,
			)],
			2,
		),
	],
};

export default testCase;
