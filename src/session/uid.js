/*
| Unique identifier.
*/


var
	session_uid;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Returns an unique identifier.
*/
session_uid =
	function( )
{
	var
		a,
		b,
		mime,
		ua,
		r32;

	mime = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	ua = [ ];

	for( a = 0; a < 3; a++ )
	{
		r32 = Math.floor( 0x100000000 * Math.random( ) );

		for( b = 0; b < 6; b++ )
		{
			ua.push( mime[ r32 & 0x3F ] );

			r32 = r32 >>> 6;
		}
	}

	return ua.join( '' );
};


if( NODE )
{
	module.exports = session_uid;
}


} )( );
