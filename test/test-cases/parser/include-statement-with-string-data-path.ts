import {
	include,
	string,
} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'include statement with string data path',
	input: '{{include "foo" "bar"}}',
	output: [
		include(
			string('foo', 10),
			string('bar', 16),
			2,
		),
	],
};

export default testCase;
