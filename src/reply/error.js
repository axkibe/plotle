/*
| The servers encountered an error with the request.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'reply_error',
		attributes :
		{
			message :
			{
				comment : 'the error message',
				json : true,
				type : 'string'
			}
		}
	};
}


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );
}


} )( );
