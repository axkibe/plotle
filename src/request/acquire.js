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
				spaceRef :
					{
						comment :
							'reference of the space to acquire',
						json :
							true,
						type :
							'fabric_spaceRef'
					},
				user :
					{
						comment :
							'user requesting the space',
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
	require( '../jion/this' )( module );
}


} )( );
