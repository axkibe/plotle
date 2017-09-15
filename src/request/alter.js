/*
| A client requests the space tree to be altered.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'request_alter',
		attributes :
		{
			changeWrapList :
			{
				comment : 'the changes to be applied',
				json : true,
				type : 'change_wrapList'
			},
			refMomentSpace :
			{
				comment : 'reference to the space dynamic',
				json : true,
				type : 'ref_moment'
			},
			userCreds :
			{
				comment : 'user requesting the change',
				json : true,
				type : 'user_creds'
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
