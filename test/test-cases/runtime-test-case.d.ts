import {InputData} from '../../src/runtime';

export interface RuntimeTestCase {
	only?: boolean;
	description: string;
	template: string;
	templates: {
		[name: string]: string[];
	};
	input: InputData;
	output: string[];
	options?: {
		epsilon?: number;
		rootPath?: string;
		maximumCallDepth?: number;
	};
}
