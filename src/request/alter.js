/*
| A client requests the space tree to be altered.
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
			'request_alter',
		attributes :
			{
				changeWrapRay :
					{
						comment :
							'the changes to be applied',
						json :
							true,
						type :
							'ccot_changeWrapRay'
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
