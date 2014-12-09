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
							'String'
					},
				news :
					{
						comment :
							'true if the user is okay with the newsletter',
						json :
							true,
						type :
							'Boolean'
					},
				passhash :
					{
						comment :
							'password hash of the user/visitor',
						json :
							true,
						type :
							'String'
					},
				username :
					{
						comment :
							'user to be registered',
						json :
							true,
						type :
							'String'
					}

			}
	};
}


if( SERVER )
{
	require( '../jion/this' )( module );
}


} )( );
