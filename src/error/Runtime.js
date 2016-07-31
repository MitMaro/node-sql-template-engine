'use strict';

const GeneralError = require('./General');

class RuntimeError extends GeneralError {
	constructor(message, statement) {
		super(message);
		this.statement = statement;
	}
}

module.exports = RuntimeError;
