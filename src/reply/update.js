/*
| The servers replies to a clients update request.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'reply_update',
		list : [ 'change_dynamic' ],
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
