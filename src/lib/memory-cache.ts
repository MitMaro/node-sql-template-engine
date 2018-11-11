import {AbstractSyntaxTree} from '../abstract-syntax-tree';
import {AbstractSyntaxTreeCache} from '../abstract-syntax-tree-cache';

/**
 * Create an in-memory cache for the compiled templates
 * @returns A cache instance
 */
export function createMemoryCache(): AbstractSyntaxTreeCache {
	const cache = new Map<string, AbstractSyntaxTree>();

	return {
		/**
		 * Get or create a value for the key
		 * @param key The key of this entry
		 * @param factory A function to call to create the value if it is missing
		 * @returns Resolves with the compiled template as an abstract syntax tree
		 */
		async entry(key: string, factory: () => Promise<AbstractSyntaxTree>): Promise<AbstractSyntaxTree> {
			if (!cache.has(key)) {
				cache.set(key, await factory());
			}
			return cache.get(key)!;
		},
	};
}
