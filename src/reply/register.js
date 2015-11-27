/*
| The servers replies to a succesful clients register request.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'reply_register',
		json : true
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
