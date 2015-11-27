/*
| The servers replies to a clients (space-)acquire request.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'reply_acquire',
		attributes :
		{
			status :
			{
				comment : 'the acquire result',
				json : true,
				type : 'string'
			},
			access :
			{
				comment : 'access level, readonly(r) or read-write(rw)',
				json : true,
				type : [ 'undefined', 'string' ]
			},
			seq :
			{
				comment : 'sequence the space is at',
				json : true,
				type : [ 'undefined', 'integer' ]
			},
			space :
			{
				comment : 'the space',
				json : true,
				type : [ 'undefined', 'fabric_space' ]
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
