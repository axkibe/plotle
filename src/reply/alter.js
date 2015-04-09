/*
| The servers replies to a clients alter request.
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
		id : 'reply_alter',
		json : true
	};
}


if( SERVER )
{
	require( 'jion' ).this( module, 'source' );
}


} )( );
