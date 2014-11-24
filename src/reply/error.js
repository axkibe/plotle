/*
| The servers encountered an error with the request.
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
			'reply.error',
		attributes :
			{
				message :
					{
						comment :
							'the error message',
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
