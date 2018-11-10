import {
	include,
	variable,
} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'include statement with variable value',
	input: '{{include foo}}',
	output: [
		include(variable('foo', 10), undefined, 2),
	],
};

export default testCase;
