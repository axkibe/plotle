/*
| A client requests updates to a space.
|
| The server might hold the answer back until something happens.
|
| Authors: Axel Kittenberger
*/


/*
| Exports
*/
var
	request;

request = request || { };


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
			'request.update',
		attributes :
			{
				passhash :
					{
						comment :
							'password hash of the user requesting the change',
						json :
							true,
						type :
							'String'
					},
				seq :
					{
						comment :
							'sequence number the client is at',
						json :
							true,
						type :
							'Integer'
					},
				spaceUser :
					{
						comment :
							'user of the space',
						json :
							true,
						type :
							'String'
					},
				spaceTag :
					{
						comment :
							'tag of the space',
						json :
							true,
						type :
							'String'
					},
				user :
					{
						comment :
							'user requesting the change',
						json :
							true,
						type :
							'String'
					}

			},
		node :
			true
	};
}


if( SERVER )
{
	require( '../jion/this' )( module );
}


} )( );
