/*
| A client requests updates to a space.
|
| The server might hold the answer back until something happens.
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
			'request_update',
		attributes :
			{
				passhash :
					{
						comment :
							'password hash of the user requesting the change',
						json :
							true,
						type :
							'string'
					},
				seq :
					{
						comment :
							'sequence number the client is at',
						json :
							true,
						type :
							'integer'
					},
				spaceRef :
					{
						comment :
							'reference of space to get updates of',
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
