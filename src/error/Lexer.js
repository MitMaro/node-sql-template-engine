'use strict';

const GeneralError = require('./General');

class LexerError extends GeneralError {
	constructor(message) {
		super(message);
	}
}

module.exports = LexerError;
