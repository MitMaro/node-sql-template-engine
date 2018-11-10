import {
	andOperator,
	bracketClose,
	bracketOpen,
	endOfFile,
	equalsOperator,
	floatingValue,
	greaterEqualThanOperator,
	greaterThanOperator,
	integerValue,
	lessEqualThanOperator,
	lessThanOperator,
	notEqualsOperator,
	notOperator,
	orOperator,
	strictEqualsOperator,
	strictNotEqualsOperator,
	tagEnd,
	tagStart,
	variable,
} from '../../util/token-builder';
import {LexerTestCase} from '../lexer-test-case';

const testCase: LexerTestCase = {
	description: 'expression number zero',
	input: [
		'{{',
		'    !(a === b || a == b || c !== d || c != d)',
		'	!(0 > 1.0 && -1 < 1 && 1 >= 2 && !(-2.3 <= 2.3)',
		'}}',
	].join('\n'),
	output: [
		// line 0
		tagStart(0),
		// line 1
		notOperator(7, 4, 1),
		bracketOpen(8, 5, 1),
		// a === b
		variable('a', 9, 6, 1),
		strictEqualsOperator(11, 8, 1),
		variable('b', 15, 12, 1),
		orOperator(17, 14, 1),
		// a == b
		variable('a', 20, 17, 1),
		equalsOperator(22, 19, 1),
		variable('b', 25, 22, 1),
		orOperator(27, 24, 1),
		// c !== d
		variable('c', 30, 27, 1),
		strictNotEqualsOperator(32, 29, 1),
		variable('d', 36, 33, 1),
		orOperator(38, 35, 1),
		// c != d
		variable('c', 41, 38, 1),
		notEqualsOperator(43, 40, 1),
		variable('d', 46, 43, 1),
		bracketClose(47, 44, 1),
		// line 2
		notOperator(50, 1, 2),
		bracketOpen(51, 2, 2),
		// 0 > 1.0
		integerValue('0', 52, 3, 2),
		greaterThanOperator(54, 5, 2),
		floatingValue('1.0', 56, 7, 2),
		andOperator(60, 11, 2),
		// -1 < 1
		integerValue('-1', 63, 14, 2),
		lessThanOperator(66, 17, 2),
		integerValue('1', 68, 19, 2),
		andOperator(70, 21, 2),
		// 1 >= 2
		integerValue('1', 73, 24, 2),
		greaterEqualThanOperator(75, 26, 2),
		integerValue('2', 78, 29, 2),
		andOperator(80, 31, 2),
		// !(-2.3 <= 2.3)
		notOperator(83, 34, 2),
		bracketOpen(84, 35, 2),
		floatingValue('-2.3', 85, 36, 2),
		lessEqualThanOperator(90, 41, 2),
		floatingValue('2.3', 93, 44, 2),
		bracketClose(96, 47, 2),
		// line 3
		tagEnd(98, 0, 3),
		endOfFile(100, 2, 3),
	],
};

export default testCase;
