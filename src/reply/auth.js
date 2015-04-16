/*
| The servers replies to a succesfull clients auth request.
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


if( NODE )
{
	require( 'jion' ).this( module, 'source' );
}


} )( );
