/*
| A user.
*/


/*
| Capsule
*/
( function( ) {
"use strict";


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'user_user',
		attributes :
			{
				name :
					{
						comment :
							'the username',
						type :
							'string',
					},
				passhash :
					{
						comment :
							'password hash',
						type :
							'string'
					}
			}
	};
}

if( SERVER)
{
	require( '../jion/this' )( module );
}


}( ) );
