/*
| A client wants to acquire a space.
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
			'request.acquire',
		attributes :
			{
				createMissing :
					{
						comment :
							'if true the space is to be created if missing',
						json :
							true,
						type :
							'Boolean'
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
				space :
					{
						comment :
							'the space to acquire',
						json :
							true,
						type :
							'fabric.spaceRef'
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
