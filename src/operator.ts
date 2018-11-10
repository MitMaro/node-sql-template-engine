/**
 * A binary operator type
 */
export const enum BinaryOperator {
	Equals = 'EQUALS',
	NotEquals = 'NOT_EQUALS',
	StrictEquals = 'STRICT_EQUALS',
	StrictNotEquals = 'STRICT_NOT_EQUALS',
	And = 'AND',
	Or = 'OR',
	GreaterThan = 'GREATER_THAN',
	LessThan = 'LESS_THAN',
	GreaterEqualThan = 'GREATER_EQUAL_THAN',
	LessEqualThan = 'LESS_EQUAL_THAN',
}

/**
 * A unary operator type
 */
export const enum UnaryOperator {
	Not = 'NOT',
}
