/*
| A client requests updates on dynamics.
|
| The server might hold back the answer until something happens.
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
			moments :
			{
				comment : 'the references to moments in dynamics to get updates for',
				json : true,
				type : 'ref_momentList',
			},
			userCreds :
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
