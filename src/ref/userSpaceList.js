/*
| A reference to a dynamic list of space references belonging to a user.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'ref_userSpacesList',
		attributes :
		{
			username :
			{
				comment : 'the username for the list',
				json : true,
				type : 'string'
			}
		}
	};
}


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );
}


} )( );
