/*
| A wrapped changed list to be applied on a dynamic.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'change_dynamic',
		attributes :
		{
			changeWrapList :
			{
				comment : 'the changes',
				json : true,
				type : [ 'undefined', 'change_wrapList' ]
			},
			refDynamic :
			{
				comment : 'the dynamic to be changed',
				json : true,
				type : [ 'ref_space', 'ref_userSpacesList' ]
			},
			seq :
			{
				comment : 'sequence the update starts at',
				json : true,
				type : [ 'undefined', 'integer' ]
			}
		},
		json : true
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
