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
	return {
		id :
			'request_auth',
		attributes :
			{
				passhash :
					{
						comment :
							'password hash of the user/visitor',
						json :
							true,
						type :
							'string'
					},
				username :
					{
						comment :
							'user/visitor to be authenticated',
						json :
							true,
						type :
							'string'
					}

			}
	};
}


if( SERVER )
{
	require( '../jion/this' )( module );
}


} )( );
