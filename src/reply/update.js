/*
| The servers replies to a clients update request.
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
			'reply_update',
		attributes :
			{
				seq :
					{
						comment :
							'sequence the update starts at',
						json :
							true,
						type :
							'Integer'
					},
				changeWrapRay :
					{
						comment :
							'the changes',
						json :
							true,
						type :
							'change_wrapRay'
					}
			}
	};
}


if( SERVER )
{
	require( '../jion/this' )( module );
}


} )( );
