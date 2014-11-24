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
			'reply.acquire',
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
							undefined
					},
				seq :
					{
						comment :
							'sequence the space is at',
						json :
							true,
						type :
							'Integer',
						defaultValue :
							undefined
					},
				space :
					{
						comment :
							'the space',
						json :
							true,
						type :
							'visual.space',
						defaultValue :
							undefined
					}

			}
	};
}


if( SERVER )
{
	require( '../jion/this' )( module );
}


} )( );
