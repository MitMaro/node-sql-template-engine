'use strict';

const chalk = require('chalk');
const JsDiff = require('diff');

module.exports = function prettyDiff(actual, expected) {
	const diff = JsDiff.diffJson(expected, actual).map((part) => {
		if (part.added) {
			return chalk.green(part.value.replace(/.+/g, '    - $&'));
		}
		if (part.removed) {
			return chalk.red(part.value.replace(/.+/g, '    + $&'));
		}
		return chalk.gray(part.value.replace(/.+/g, '    | $&'));
	}).join('');

	return `\n${diff}\n`;
};
