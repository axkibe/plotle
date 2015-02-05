/*
| The servers replies to a clients (space-)acquire request.
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
			'reply_acquire',
		attributes :
			{
				status :
					{
						comment :
							'the acquire result',
						json :
							true,
						type :
							'String'
					},
				access :
					{
						comment :
							'access level, readonly(r) or read-write(rw)',
						json :
							true,
						type :
							'String',
						defaultValue :
							'undefined'
					},
				seq :
					{
						comment :
							'sequence the space is at',
						json :
							true,
						type :
							'integer',
						defaultValue :
							'undefined'
					},
				space :
					{
						comment :
							'the space',
						json :
							true,
						type :
							'fabric_space',
						defaultValue :
							'undefined'
					}

			}
	};
}


if( SERVER )
{
	require( '../jion/this' )( module );
}


} )( );
