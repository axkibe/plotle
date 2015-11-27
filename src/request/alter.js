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
			changeWrapRay :
			{
				comment : 'the changes to be applied',
				json : true,
				type : 'change_wrapRay'
			},
			seq :
			{
				comment : 'sequence number',
				json : true,
				type : 'integer'
			},
			spaceRef :
			{
				comment : 'reference to space to alter',
				json : true,
				type : 'fabric_spaceRef'
			},
			user :
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
