/*
| A client requests updates to a space.
|
| The server might hold the answer back until something happens.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'request_update',
		attributes :
		{
			seq :
			{
				comment : 'sequence number the client is at',
				json : true,
				type : 'integer'
			},
			spaceRef :
			{
				comment : 'reference of space to get updates of',
				json : true,
				type : 'fabric_spaceRef'
			},
			user :
			{
				comment : 'user creds',
				json : true,
				type : 'user_creds'
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
