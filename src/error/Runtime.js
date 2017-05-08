'use strict';

const GeneralError = require('./General');

export default class RuntimeError extends GeneralError {
	constructor(message, statement, cause) {
		super(message, cause);
		this.statement = statement;
	}
}

export class RuntimeExpressionError extends GeneralError {
	constructor(message, expression) {
		super(message);
		this.expression = expression;
	}
}

export class RuntimeReadError extends RuntimeError {
	constructor(message, statement, path) {
		super(message, statement);
		this.path = path;
	}
}
