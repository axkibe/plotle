/*
| A client request authentication to be checked,
| or to be assigned a visitor-id.
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


if( NODE )
{
	require( 'jion' ).this( module, 'source' );
}


} )( );
