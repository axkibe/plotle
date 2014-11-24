/*
| The servers replies to a succesfull clients auth request.
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
			'reply.auth',
		attributes :
			{
				username :
					{
						comment :
							'the username. visitors get their real id here',
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
