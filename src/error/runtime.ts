import {ExpressionNode, StatementNode} from '../abstract-syntax-tree';
import {Stack} from '../stack';
import {SqlTemplateError} from './error';

/**
 * Throw when an error occurs during the run of a template
 */
export class RuntimeError extends SqlTemplateError {
	/** The statement that caused the error */
	public readonly statement: StatementNode;

	/** The path to the template that caused the error */
	public readonly templatePath: string;

	/**
	 * Construct a RuntimeError
	 * @param message The error message
	 * @param statement The statement that caused the error
	 * @param templatePath The path to the template file that caused the error
	 * @param cause The causing error
	 */
	public constructor(message: string, statement: StatementNode, templatePath: string, cause?: Error) {
		super(message, 'RuntimeError', cause);
		this.statement = statement;
		this.templatePath = templatePath;
	}
}

/**
 * Throw when there is an error with an expression
 */
export class RuntimeExpressionError extends SqlTemplateError {
	/** The expression that caused the error */
	public readonly expression: ExpressionNode;

	/**
	 * Construct a RuntimeExpressionError
	 * @param message The error message
	 * @param expression The expression that caused the error
	 * @param cause The causing error
	 */
	public constructor(message: string, expression: ExpressionNode, cause?: Error) {
		super(message, 'RuntimeExpressionError', cause);
		this.expression = expression;
	}
}

/**
 * Throw when the maximum call depth is reached
 */
export class RuntimeMaximumCallStackExceededError extends SqlTemplateError {
	/** The statement that caused the error */
	public readonly statement: StatementNode;

	/** The path to the template that caused the error */
	public readonly templatePath: string;

	/** A stack of statements that caused the maximum depth */
	public readonly statementStack: Stack[];

	/**
	 * Construct a RuntimeMaximumCallStackExceededError
	 * @param statement The statement that caused the error
	 * @param templatePath The path to the template that caused the error
	 * @param cause The causing error
	 */
	public constructor(statement: StatementNode, templatePath: string, cause?: Error) {
		super('Maximum call stack exceeded', 'RuntimeMaximumCallStackExceededError', cause);
		this.statement = statement;
		this.templatePath = templatePath;
		this.statementStack = [];
	}

	/**
	 * Push a statement and template path on to the statement stack
	 * @param {Statement} statement
	 * @param {string} templatePath
	 */
	public pushStatementStack(statement: StatementNode, templatePath: string): void {
		this.statementStack.push({statement, templatePath});
	}
}

/**
 * Thrown where there is an exception while reading a template during runtime
 */
export class RuntimeReadError extends SqlTemplateError {
	/** The statement that caused the error */
	public readonly statement: StatementNode;

	/** The path that could not be read */
	public readonly path: string;

	/**
	 * Construct a RuntimeReadError
	 * @param message The error message
	 * @param statement The statement that caused the error
	 * @param path The path that could not be read
	 * @param cause The causing error
	 */
	public constructor(message: string, statement: StatementNode, path: string, cause?: Error) {
		super(message, 'RuntimeReadError', cause);
		this.statement = statement;
		this.path = path;
	}
}

/**
 * Throw when a data path reference was invalid
 */
export class RuntimeReferenceError extends SqlTemplateError {
	/** The path to the data reference that caused the error */
	public readonly dataPath: string;

	/**
	 * Construct a RuntimeReferenceError
	 * @param message The error message
	 * @param dataPath The data path of the reference
	 * @param cause The causing error
	 */
	public constructor(message: string, dataPath: string, cause?: Error) {
		super(message, 'RuntimeReferenceError', cause);
		this.dataPath = dataPath;
	}
}
