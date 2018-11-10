import {
	include,
	variable,
} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'include statement with variable data path',
	input: '{{include foo bar}}',
	output: [
		include(
			variable('foo', 10),
			variable('bar', 14),
			2
		),
	],
};

export default testCase;
