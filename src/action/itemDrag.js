/*
| The user is dragging an item.
*/


var
	action_itemDrag;


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
				type : require( '../typemaps/visualItems' )
			},
			start :
			{
				comment : 'mouse down point on drag creation',
				type : 'euclid_point'
			},
			transItem :
			{
				comment : 'the transient item while it is dragged',
				type : require( '../typemaps/visualItems' )
			}
		}
	};
}


var
	prototype;


if( NODE )
{
	action_itemDrag = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_itemDrag.prototype;


/*
| Returns true if an entity with path is affected by this action.
*/
prototype.affects =
	function(
		path
	)
{
	return this.origin.path.equals( path );
};


} )( );
