/*
| A reference to a moment of a dynamic.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'ref_moment',
		attributes :
		{
			dynRef :
			{
				comment : 'the dynamic referenced',
				json : true,
				type : [ 'ref_space', 'ref_userSpaceList' ]
			},
			seq :
			{
				comment : 'sequence number the dynamic is at',
				json : true,
				type : 'integer'
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
