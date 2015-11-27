/*
| The servers replies to a clients alter request.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'reply_alter',
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
