import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';
import {AbstractSyntaxTree} from './abstract-syntax-tree';
import {AbstractSyntaxTreeCache} from './abstract-syntax-tree-cache';
import {FileLoadError} from './error/file-load';
import {Lexer} from './lexer';
import {createMemoryCache} from './lib/memory-cache';
import {Parser} from './parser';
import {InputData, Runtime} from './runtime';

// eslint-disable-next-line security/detect-non-literal-fs-filename
const readFile = promisify(fs.readFile);

export {AbstractSyntaxTreeCache} from './abstract-syntax-tree-cache';
export * from './abstract-syntax-tree';
export {SqlTemplateError} from './error/error';
export {FileLoadError} from './error/file-load';
export {ParserError} from './error/parser';
export {RuntimeError} from './error/runtime';
export {Lexer} from './lexer';
export {createMemoryCache} from './lib/memory-cache';
export {BinaryOperator, UnaryOperator} from './operator';
export {Parser} from './parser';
export {Runtime} from './runtime';
export {TemplateLoader} from './template-loader';

/**
 * Configuration options for creating an instance of the sql template engine
 */
export interface SqlTemplateOptions {
	/** A custom abstract syntax tree cache, defaults to a in-memory cache */
	cache?: AbstractSyntaxTreeCache;
	/** An upper bound on the error due to rounding in floating point comparisons, defaults to Number.EPSILON */
	epsilon?: number;
	/** The file encoding for template files */
	fileEncoding?: string;
	/** The root directory for looking for template files */
	rootPath?: string;
	/** The maximum depth of nested includes */
	maximumCallDepth?: number;
}

/**
 * SQL Template Engine
 */
export interface SqlTemplateEngine {
	/**
	 * Invoke an abstract syntax tree with a set of input data
	 * @param abstractSyntaxTree The abstract syntax tree instance
	 * @param data The template input data
	 * @returns Resolves to an array of the output lines
	 * @throws {RuntimeError} if there was unexpected statement, an expression error, an invalid template path or a data
	 * path reference error
	 * @throws {RuntimeReadError} if there was an error reading a template file
	 * @throws {RuntimeMaximumCallStackExceededError} if the maximum call depth is exceeded
	 */
	invokeAbstractSyntaxTree(abstractSyntaxTree: AbstractSyntaxTree, data: object): Promise<string[]>;

	/**
	 * Invoke a template file with a set of input data
	 * @param file The path to the template file
	 * @param data The template input data
	 * @returns Resolves to an array of the output lines
	 * @throws {RuntimeError} if there was unexpected statement, an expression error, an invalid template path or a data
	 * path reference error
	 * @throws {RuntimeReadError} if there was an error reading a template file
	 * @throws {RuntimeMaximumCallStackExceededError} if the maximum call depth is exceeded
	 */
	invokeTemplateFile(file: string, data: object): Promise<string>;

	/**
	 * Load a template file returning an abstract syntax tree
	 * @param file The path to the template file
	 * @returns Resolves to an abstract syntax tree
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 * @throws {FileLoadError} if the template file cannot be read
	 */
	loadTemplateFile(file: string): Promise<AbstractSyntaxTree>;
}

/**
 * Create an instance of the sql template engine
 * @param options The configuration options for creating an instance of the sql template engine
 * @returns An instance of the sql template engine
 */
export default function create(options: SqlTemplateOptions = {}): SqlTemplateEngine {
	const opts = {
		cache: options.cache,
		epsilon: options.epsilon,
		fileEncoding: options.fileEncoding || 'UTF-8',
		rootPath: options.rootPath || process.cwd(),
		maximumCallDepth: options.maximumCallDepth,
	};

	const cache = opts.cache ? opts.cache : createMemoryCache();

	/**
	 * Load a template file returning an abstract syntax tree
	 * @param file The path to the template file
	 * @returns Resolves to an abstract syntax tree
	 * @throws {ParserError} if there are not enough tokens of the token does not match the passed types
	 * @throws {FileLoadError} if the template file cannot be read
	 */
	async function loadTemplateFile(file: string): Promise<AbstractSyntaxTree> {
		const templatePath = path.isAbsolute(file) ? file : path.resolve(opts.rootPath, file);
		return cache.entry(templatePath, async (): Promise<AbstractSyntaxTree> => {
			try {
				const inputFile = await readFile(templatePath, opts.fileEncoding);
				const lexer = new Lexer(inputFile, templatePath);
				return new Parser(lexer).generateAbstractSyntaxTree();
			}
			catch (e) {
				if (e.code === 'EACCES') {
					throw new FileLoadError('Permission denied', templatePath, e);
				}
				else if (e.code === 'ENOENT') {
					throw new FileLoadError('File not found', templatePath, e);
				}
				throw e;
			}
		});
	}

	const runner = new Runtime(loadTemplateFile, {
		rootPath: opts.rootPath,
		epsilon: opts.epsilon,
		maximumCallDepth: opts.maximumCallDepth,
	});

	const invokeAbstractSyntaxTree = runner.invoke.bind(runner);

	/**
	 * Invoke a template file with a set of input data
	 * @param filePath The path to the template file
	 * @param data The template input data
	 * @returns Resolves to an array of the output lines
	 * @throws {RuntimeError} if there was unexpected statement, an expression error, an invalid template path or a data
	 * path reference error
	 * @throws {RuntimeReadError} if there was an error reading a template file
	 * @throws {RuntimeMaximumCallStackExceededError} if the maximum call depth is exceeded
	 */
	async function invokeTemplateFile(filePath: string, data: InputData): Promise<string> {
		const templateContents = await loadTemplateFile(filePath);
		const results = await runner.invoke(templateContents, data);
		return results.join('');
	}

	/* istanbul ignore next */
	return {
		invokeAbstractSyntaxTree,
		invokeTemplateFile,
		loadTemplateFile,
	};
}
