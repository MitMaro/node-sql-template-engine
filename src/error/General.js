'use strict';

class GeneralError extends Error {
	constructor(message) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = GeneralError;
