/*
| The user is dragging an item.
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
		id : 'action_itemDrag',
		attributes :
		{
			origin :
			{
				comment : 'the item being dragged',
				type : require( '../typemaps/fabricItems' )
			},
			start :
			{
				comment : 'mouse down point on drag creation',
				type : 'euclid_point'
			},
			transItem :
			{
				comment : 'the transient item while it is dragged',
				type : require( '../typemaps/fabricItems' )
			}
		}
	};
}


} )( );
