module.exports = {
	root: true,
	extends: [
		'mitmaro',
		'mitmaro/config/mocha',
		'mitmaro/config/chai',
		'mitmaro/config/typescript-mocha',
	],
	rules: {
		'security/detect-non-literal-require': 'off',
		'no-loop-func': 'off',
	}
};
