import {StatementNode} from './abstract-syntax-tree';

export interface Stack {
	templatePath: string;
	statement: StatementNode;
}
