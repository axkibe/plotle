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
		attributes :
		{
			seq :
			{
				comment : 'sequence the update starts at',
				json : true,
				type : 'integer'
			},
			changeWrapRay :
			{
				comment : 'the changes',
				json : true,
				type : 'change_wrapRay'
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
