'use strict';

class GeneralError extends Error {
	constructor(message, cause) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.cause = cause;
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = GeneralError;
