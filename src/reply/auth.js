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
			user :
			{
				comment : 'the user jion. visitors get their real id here',
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
