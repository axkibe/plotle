/*
| A client requests a new user to be registered.
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
			'request_register',
		attributes :
			{
				mail :
					{
						comment :
							'email address of the user, can be empty',
						json :
							true,
						type :
							'string'
					},
				news :
					{
						comment :
							'true if the user is okay with the newsletter',
						json :
							true,
						type :
							'boolean'
					},
				user :
					{
						comment :
							'user/pass credentials to be registered',
						json :
							true,
						type :
							'user_creds'
					}
			}
	};
}


if( SERVER )
{
	require( 'jion' ).this( module );
}


} )( );
