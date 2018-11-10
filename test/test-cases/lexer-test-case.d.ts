import {Token} from '../../src/token';

export interface LexerTestCase {
	only?: boolean;
	description: string;
	input: string;
	output: Token[];
	options?: {
		templatePath?: string;
	};
}
