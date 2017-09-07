/*
| A client requests a new user to be registered.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'request_register',
		attributes :
		{
			mail :
			{
				comment : 'email address of the user, can be empty',
				json : true,
				type : 'string'
			},
			news :
			{
				comment : 'true if the user is okay with the newsletter',
				json : true,
				type : 'boolean'
			},
			userCreds :
			{
				comment : 'user/pass credentials to be registered',
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
