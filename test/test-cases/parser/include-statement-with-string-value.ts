import {
	include,
	string,
} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'include statement with string value',
	input: '{{include "foo"}}',
	output: [
		include(string('foo', 10), undefined, 2),
	],
};

export default testCase;
