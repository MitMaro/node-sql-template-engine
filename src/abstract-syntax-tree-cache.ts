import {AbstractSyntaxTree} from './abstract-syntax-tree';

/**
 * A cache for abstract syntax trees
 */
export interface AbstractSyntaxTreeCache {
	/**
	 * Get the abstract syntax tree associated with key, retrieving the value from the `factory` if needed.
	 * @param key The entry key
	 * @param factory The factory function to retrieve the abstract syntax tree if cache does not have a value
	 * @returns The abstract syntax tree for the key
	 */
	entry(key: string, factory: () => Promise<AbstractSyntaxTree>): Promise<AbstractSyntaxTree>;
}
