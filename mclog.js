/**
| Common Logging/Debugging utility for meshcraft.
|
| Authors: Axel Kittenberger
| License: GNU Affero AGPLv3
*/

var log = function() {
	// todo make browser equivalent.
	var inspect = require('util').inspect;

	/**
	| Pushes a 2-decimal number on an array.
	*/
	function pushpad(a, n, s) {
		if (n < 10) a.push('0');
		a.push(n);
		a.push(s);
	}

	/**
	| Creates a timestamp which will be returned as joinable array. 
	*/
	function timestamp() {
		var now = new Date();
		var a = [];
		pushpad(a, now.getMonth() + 1, '-');
		pushpad(a, now.getDate(), ' ');
		pushpad(a, now.getHours(), ':');
		pushpad(a, now.getMinutes(), ':');
		pushpad(a, now.getSeconds(), ' ');
		return a;
	}

	/**
	| Logs if category is configured to be logged.
	*/
	function _log(category) {
		if (!log || !log.enable[category]) return;
		var a = timestamp();
		a.push('(');
		a.push(category);
		a.push(') ');
		for(var i = 1; i < arguments.length; i++) {
			if (i > 1) a.push(' ');
			a.push(inspect(arguments[i]));
		}
		console.log(a.join(''));
	}

	return _log;
}();

module.exports = log;

