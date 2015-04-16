/*
| The servers replies to a succesful clients register request.
*/


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'reply_register',
		json : true
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );
}


} )( );
