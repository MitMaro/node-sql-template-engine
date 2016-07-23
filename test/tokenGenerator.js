'use strict';

module.exports = (values) => {
	return {
		*tokens() {
			while (values.length) {
				yield values.shift();
			}
		}
	};
};
