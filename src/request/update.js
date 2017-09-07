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
			dynRefs :
			{
				comment : 'the references to dynamics to get updates of',
				json : true,
				type : 'ref_dynamic_anyList',
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
