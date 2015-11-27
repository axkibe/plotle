/*
| A client wants to acquire a space.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'request_acquire',
		attributes :
		{
			createMissing :
			{
				comment : 'if true the space is to be created if missing',
				json : true,
				type : 'boolean'
			},
			spaceRef :
			{
				comment : 'reference of the space to acquire',
				json : true,
				type : 'fabric_spaceRef'
			},
			user :
			{
				comment : 'user requesting the space',
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
