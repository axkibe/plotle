/*
| A client requests updates to a space.
|
| The server might hold the answer back until something happens.
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
