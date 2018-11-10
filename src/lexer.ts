import {
	BinaryOperator,
	UnaryOperator,
} from './operator';
import {
	Token,
	TokenBoundaryType,
	TokenStatementType,
	TokenStructureType,
	TokenType,
	TokenValueType,
} from './token';

const boundaryTypeLookup: {readonly [boundry: string]: TokenBoundaryType} = {
	'{{': TokenBoundaryType.TagStart,
	'}}': TokenBoundaryType.TagEnd,
	'(': TokenBoundaryType.BracketOpen,
	')': TokenBoundaryType.BracketClose,
	'"': TokenBoundaryType.StringDouble,
	"'": TokenBoundaryType.StringSingle,
};

const statementTypeLookup: {readonly [name: string]: TokenStatementType} = {
	if: TokenStatementType.If,
	elif: TokenStatementType.ElseIf,
	else: TokenStatementType.Else,
	fi: TokenStatementType.EndIf,
	include: TokenStatementType.Include,
};

const binaryOperatorTypeLookup: {readonly [operator: string]: BinaryOperator} = {
	'==': BinaryOperator.Equals,
	'!=': BinaryOperator.NotEquals,
	'===': BinaryOperator.StrictEquals,
	'!==': BinaryOperator.StrictNotEquals,
	'&&': BinaryOperator.And,
	'||': BinaryOperator.Or,
	'>': BinaryOperator.GreaterThan,
	'<': BinaryOperator.LessThan,
	'>=': BinaryOperator.GreaterEqualThan,
	'<=': BinaryOperator.LessEqualThan,
};

const unaryOperatorTypeLookup: {readonly [operator: string]: UnaryOperator} = {'!': UnaryOperator.Not};

/**
 * The state of the parser
 */
enum ParserState {
	Tag = 'TAG',
	TextLiteral = 'TEXT_LITERAL',
	String = 'STRING',
	EndString = 'STRING_END',
}

const generalDelimiters = [' ', '\t', '\n'];

const delimiters: {readonly [delimiterLength: number]: string[]} = {
	1: [],
	2: [],
	3: [],
};

// build delimiters
[
	...generalDelimiters,
	...Object.keys(boundaryTypeLookup),
	...Object.keys(binaryOperatorTypeLookup),
	...Object.keys(unaryOperatorTypeLookup),
].forEach((delimiter: string): void => {
	delimiters[delimiter.length].push(delimiter);
});

type StringDelimiter = null | "'" | '"';

/**
 * A lexer for sql templates
 */
export class Lexer {
	public readonly templatePath: string;
	private state: ParserState;
	private pointer: number;
	private columnNumber: number;
	private rowNumber: number;
	private readonly input: string;
	private readonly lookAheadLength: number;
	private stringDelimiter: StringDelimiter;

	/**
	 * Construct a lexer
	 * @param input The template content
	 * @param templatePath The path of the file the template was loaded from
	 */
	public constructor(input: string, templatePath = '<anonymous>') {
		this.templatePath = templatePath;
		this.state = ParserState.TextLiteral;
		this.pointer = 0;
		this.columnNumber = 0;
		this.rowNumber = 0;
		this.input = input;
		// length used for cases of checking ahead by one character from pointer
		this.lookAheadLength = this.input.length - 1;
		this.stringDelimiter = null;
	}

	/**
	 * A generator that yields a token at time
	 * @returns A token iterable
	 */
	public *tokens(): IterableIterator<Token> {
		let column = -1;
		let row = -1;
		while (this.pointer < this.input.length) {
			if (this.state === ParserState.TextLiteral) {
				column = this.columnNumber;
				row = this.rowNumber;
				const startIndex = this.pointer;

				this.scanTextLiteral();
				this.state = ParserState.Tag;

				const value = this.input.substring(startIndex, this.pointer);

				if (!value.length) {
					continue;
				}
				yield {
					file: this.templatePath,
					column,
					row,
					type: TokenType.Structure,
					subType: TokenStructureType.TextLiteral,
					value,
					startIndex,
					endIndex: this.pointer,
				};
			}
			else if (this.state === ParserState.Tag || this.state === ParserState.EndString) {
				let type;

				this.skipWhitespace();

				column = this.columnNumber;
				row = this.rowNumber;
				let startIndex = this.pointer;

				// scan until next delimiter
				this.scanToNextDelimiter();
				let value = this.input.substring(startIndex, this.pointer);

				if (value.length) {
					type = statementTypeLookup[value];
					if (type) {
						yield {
							file: this.templatePath,
							column,
							row,
							type: TokenType.Statement,
							subType: type,
							value,
							startIndex,
							endIndex: this.pointer,
						};
						continue;
					}

					// if first digit is a number, it's a numerical value
					/* tslint:disable-next-line:prefer-conditional-expression */
					if ((value[0] >= '0' && value[0] <= '9') || value[0] === '-') {
						// floats have a decimal number
						type = value.includes('.') ? TokenValueType.Float : TokenValueType.Integer;
					}
					else {
						type = TokenValueType.Variable;
					}

					yield {
						file: this.templatePath,
						column,
						row,
						type: TokenType.Value,
						subType: type,
						value,
						startIndex,
						endIndex: this.pointer,
					};
					continue;
				}

				column = this.columnNumber;
				row = this.rowNumber;
				startIndex = this.pointer;
				this.scanNextDelimiter();
				value = this.input.substring(startIndex, this.pointer);
				// early EOF reached
				if (value === '') {
					continue;
				}
				// boundary types are the most complicated
				type = boundaryTypeLookup[value];
				if (type) {
					const endIndex = this.pointer;
					if (type === TokenBoundaryType.StringDouble || type === TokenBoundaryType.StringSingle) {
						this.stringDelimiter = type === TokenBoundaryType.StringDouble ? '"' : "'";
						this.state = this.state === ParserState.EndString ? ParserState.Tag : ParserState.String;
					}
					else if (type === TokenBoundaryType.TagEnd) {
						this.skipNewline();
						this.state = ParserState.TextLiteral;
					}
					yield {
						file: this.templatePath,
						column,
						row,
						type: TokenType.Boundary,
						subType: type,
						value,
						startIndex,
						endIndex,
					};
					continue;
				}
				type = binaryOperatorTypeLookup[value];
				if (type) {
					yield {
						file: this.templatePath,
						column,
						row,
						type: TokenType.BinaryOperator,
						subType: type,
						value,
						startIndex,
						endIndex: this.pointer,
					};
					continue;
				}
				type = unaryOperatorTypeLookup[value];
				yield {
					file: this.templatePath,
					column,
					row,
					type: TokenType.UnaryOperator,
					subType: type,
					value,
					startIndex,
					endIndex: this.pointer,
				};
			}
			// else this.state === ParserState.String
			else {
				column = this.columnNumber;
				row = this.rowNumber;
				const startIndex = this.pointer;

				this.scanString();
				this.state = ParserState.EndString;
				yield {
					file: this.templatePath,
					column,
					row,
					type: TokenType.Value,
					subType: TokenValueType.String,
					value: this.input.substring(startIndex, this.pointer),
					startIndex,
					endIndex: this.pointer,
				};
			}
		}

		yield {
			file: this.templatePath,
			column: this.columnNumber,
			row: this.rowNumber,
			type: TokenType.Structure,
			subType: TokenStructureType.EndOfFile,
			value: null,
			startIndex: this.pointer,
			endIndex: this.pointer,
		};
	}

	/**
	 * Move the internal pointer ahead by one character, updating row and column number as needed
	 */
	private movePointer(): void {
		// don't move pointer beyond EOF
		if (this.pointer + 1 > this.input.length) {
			return;
		}

		if (this.input[this.pointer] === '\n') {
			this.rowNumber++;
			this.columnNumber = 0;
		}
		else {
			this.columnNumber++;
		}
		this.pointer++;
	}

	/**
	 * Advance internal pointer past all whitespace
	 */
	private skipWhitespace(): void {
		while (this.pointer < this.input.length && this.input[this.pointer].trim().length === 0) {
			this.movePointer();
		}
	}

	/**
	 * Skip a newline if the next character is one
	 */
	private skipNewline(): void {
		if (this.input[this.pointer] === '\n') {
			this.movePointer();
		}
	}

	/**
	 * Advance internal pointer until {{ is found or EndOfFile reached
	 */
	private scanTextLiteral(): void {
		while (
			this.pointer < this.lookAheadLength
			&& !(
				this.input[this.pointer] === '{'
				&& this.input[this.pointer + 1] === '{'
			)
		) {
			this.movePointer();
		}

		// because we look two characters ahead, we need to increment the
		// pointer by one if end of input is reached
		if (this.lookAheadLength >= 0 && this.pointer >= this.lookAheadLength) {
			this.movePointer();
		}
	}

	/**
	 * Advance internal pointer to the end of a string
	 */
	private scanString(): void {
		// if next character is the delimiter we have a zero length string
		if (this.input[this.pointer] === this.stringDelimiter) {
			return;
		}

		while (this.pointer < this.lookAheadLength) {
			// check ahead for delimiter but only if current isn't an escape
			if (this.input[this.pointer + 1] === this.stringDelimiter && this.input[this.pointer] !== '\\') {
				break;
			}
			this.movePointer();
		}
		this.movePointer();
	}

	/**
	 * Get the next delimiter
	 * @returns The limiter or null if one cannot be found
	 */
	private getDelimiter(): string | null {
		for (let length = 3; length > 0; length--) {
			// if we don't have enough input remaining then stop
			if (length + this.pointer > this.input.length) {
				continue;
			}

			d: for (const delimiter of delimiters[length]) {
				// check for match
				for (let i = 0; i < length; i++) {
					if (this.input[this.pointer + i] !== delimiter[i]) {
						continue d;
					}
				}
				// match found so return
				return delimiter;
			}
		}
		return null;
	}

	/**
	 * Advanced the internal pointer to the next delimiter
	 */
	private scanToNextDelimiter(): void {
		// if already at delimiter
		if (this.getDelimiter() !== null) {
			return;
		}
		this.movePointer();

		while (this.pointer < this.input.length) {
			if (this.getDelimiter() !== null) {
				return;
			}
			this.movePointer();
		}
	}

	/**
	 * Advance the internal pointer past the next delimiter
	 */
	private scanNextDelimiter(): void {
		const delimiter = this.getDelimiter();
		// if the delimiter is null then the end of the file has been reached
		if (delimiter === null) {
			return;
		}
		/* tslint:disable-next-line:prefer-for-of */
		for (let i = 0; i < delimiter.length; i++) {
			this.movePointer();
		}
	}
}
