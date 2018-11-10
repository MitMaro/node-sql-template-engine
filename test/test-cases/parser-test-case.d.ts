import {StatementNode} from '../../src/abstract-syntax-tree';

export interface ParserTestCase {
	only?: boolean;
	description: string;
	input: string;
	output: StatementNode[];
	expectedError?: string;
	options?: {
		templatePath?: string;
	};
}
