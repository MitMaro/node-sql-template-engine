import {literal} from '../../util/abstract-syntax-tree-builder';
import {ParserTestCase} from '../parser-test-case';

const testCase: ParserTestCase = {
	description: 'text literal',
	input: 'foo',
	output: [
		literal('foo'),
	],
};

export default testCase;
