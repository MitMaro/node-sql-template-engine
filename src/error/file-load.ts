import {SqlTemplateError} from './error';

/**
 * Thrown where there is an exception while reading a template file
 */
export class FileLoadError extends SqlTemplateError {
	/** The path that could not be read */
	public readonly path: string;

	/**
	 * Construct a FileLoadError
	 * @param message The error message
	 * @param path The path that could not be read
	 * @param cause The causing error
	 */
	public constructor(message: string, path: string, cause?: Error) {
		super(message, 'FileLoadError', cause);
		this.path = path;
	}
}
