/*
| A client request authentication to be checked,
| or to be assigned a visitor-id.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'request_auth',
		attributes :
		{
			user :
			{
				comment : 'user creds to be authenticated',
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
