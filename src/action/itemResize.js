/*
| The user is resizing an item.
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
	return{
		id : 'action_itemResize',
		attributes :
		{
			align :
			{
				comment : 'alignment ( compass ) of the resize action',
				type : 'string'
			},
			transItem :
			{
				comment : 'the transient item while it is dragged',
				type : require( '../typemaps/visualItems' )
			},
			origin :
			{
				comment : 'the item being resized',
				type : require( '../typemaps/visualItems' )
			},
			start :
			{
				comment : 'mouseDown point on drag creation',
				type : 'euclid_point'
			}
		}
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


} )( );
