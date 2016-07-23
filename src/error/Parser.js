'use strict';

const GeneralError = require('./General');

class ParserError extends GeneralError {
	constructor(message, token) {
		super(message);
		this.token = token;
	}
}

module.exports = ParserError;
