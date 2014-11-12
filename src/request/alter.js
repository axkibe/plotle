/*
| A client requests the space tree to be altered.
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
			'request.alter',
		attributes :
			{
				changeWrapRay :
					{
						comment :
							'the changes to be applied',
						json :
							true,
						type :
							'ccot.changeWrapRay'
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
				seq :
					{
						comment :
							'sequence number',
						json :
							true,
						type :
							'Integer'
					},
				spaceRef :
					{
						comment :
							'reference to space to alter',
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