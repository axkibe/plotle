/*
| A client wants to acquire a space.
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
			'request_acquire',
		attributes :
			{
				createMissing :
					{
						comment :
							'if true the space is to be created if missing',
						json :
							true,
						type :
							'boolean'
					},
				passhash :
					{
						comment :
							'password hash of the user requesting the change',
						json :
							true,
						type :
							'String'
					},
				spaceRef :
					{
						comment :
							'reference of the space to acquire',
						json :
							true,
						type :
							'fabric_spaceRef'
					},
				username :
					{
						comment :
							'user requesting the change',
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
