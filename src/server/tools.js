/*
| Various tools for abstract syntax use
|
| Authors: Axel Kittenberger
*/


var
	tools;

tools =
module.exports =
	{ };


/*
| Capsule
*/
(function() {
'use strict';


var
	_b64Mask;

_b64Mask = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_';


/*
| Returns a number as base64 string.
*/
tools.b64Encode =
	function(
		num // number to encode
	)
{
	var
		result;

	result = '';

	do
	{
		result = _b64Mask[ num & 0x3F ] + result;

		num = num >> 6;
	}
	while( num > 0 );

	return result;
};



} )( );
