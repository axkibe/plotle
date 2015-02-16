/*
| Extended user info.
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
			'user_info',
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
					},
				mail :
					{
						comment :
							'the users email',
						type :
							'string',
						defaultValue :
							'""'
					},
				news :
					{
						comment :
							'if the user checked okay with news emails',
						type :
							[ 'boolean', 'string' ],
					}
			}
	};
}


require( '../jion/this' )( module );


}( ) );
