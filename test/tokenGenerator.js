'use strict';


export default function(values) {
	return {
		*tokens() {
			while (values.length) {
				yield values.shift();
			}
		}
	};
};
