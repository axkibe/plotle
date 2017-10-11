/*
| The servers replies to a succesfull clients auth request.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'reply_auth',
		attributes :
		{
			userCreds :
			{
				comment : 'the user jion. visitors get their real id here',
				json : true,
				type : 'user_creds'
			},
			userSpaceList :
			{
				comment : 'the list of spaces the user has',
				json : true,
				type : [ 'undefined', 'dynamic_refSpaceList' ]
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
