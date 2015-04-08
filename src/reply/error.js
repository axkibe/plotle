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
			'reply_error',
		attributes :
			{
				message :
					{
						comment :
							'the error message',
						json :
							true,
						type :
							'string'
					}
			}
	};
}


if( SERVER )
{
	require( 'jion' ).this( module );
}


} )( );
