/* eslint-disable no-console,mocha/no-top-level-hooks,mocha/no-hooks-for-single-case */

let unhandledError = false;
process.on('unhandledRejection', (reason) => {
	/* tslint:disable:no-console*/
	console.error('Unhandled Rejection');
	console.error(reason);
	/* tslint:enable:no-console*/
	unhandledError = true;
});

after(function (done) {
	setImmediate(() => {
		if (unhandledError) {
			return done(new Error('Unhandled promise in tests'));
		}
		return done();
	});
});
