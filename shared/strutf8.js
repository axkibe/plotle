/*
---
name: String.UTF-8
description: String UTF8 encoding.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne]
...
[Axel Kittenberger]
* imported from:
https://github.com/sixtyseconds/mootools-string-cryptography/blob/master/Source/String.UTF-8.js
* made browser/node shared friendly
* changed it to not alter String.prototype
* cleaned from jshint warnings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Exports
*/
var toUTF8   = null;
var fromUTF8 = null;

(function(){
"use strict";

toUTF8 = function(string) {
	var a, b,
		result = '',
		code = String.fromCharCode;

	string = string.replace(/\r\n/g,"\n");

	for (a = 0; (b = string.charCodeAt(a)); a++){
		if (b < 128){
			result += code(b);
		} else if ((b > 127) && (b < 2048)){
			result += code((b >> 6) | 192);
			result += code((b & 63) | 128);
		} else {
			result += code((b >> 12) | 224);
			result += code(((b >> 6) & 63) | 128);
			result += code((b & 63) | 128);
		}
	}

	return result;
};

fromUTF8 = function (string) {
	var a = 0,
		result = '',
		c1 = 0, c2 = 0, c3 = 0;

	while (a < string.length){
		c1 = string.charCodeAt(a);

		if (c1 < 128){
			result += String.fromCharCode(c1);
			a++;
		} else if ((c1 > 191) && (c1 < 224)){
			c2 = string.charCodeAt(a+1);
			result += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
			a += 2;
		} else {
			c2 = string.charCodeAt(a + 1);
			c3 = string.charCodeAt(a + 2);
			result += String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
			a += 3;
		}
	}

	return result;
};

/**
| Node exports
*/
if (typeof(window) === 'undefined') {
	module.exports = {
		toUTF8   : toUTF8,
		fromUTF8 : fromUTF8
	};
}

})();
