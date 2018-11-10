import {Token} from '../token';
import {SqlTemplateError} from './error';

/**
 * Thrown when there is an exception during the parsing stage
 */
export class ParserError extends SqlTemplateError {
	/** The token being parsed during the exception */
	public readonly token: Token;

	/**
	 * Construct a ParserError with a message, token and optional causing error.
	 * @param message The error message
	 * @param token The token being parsed when the exception occurred
	 * @param cause The causing error
	 */
	public constructor(message: string, token: Token, cause?: Error) {
		super(message, 'ParserError', cause);
		this.token = token;
	}
}
