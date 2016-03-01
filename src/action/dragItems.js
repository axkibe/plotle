/*
| The user is dragging an item.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'action_itemDrag',
		attributes :
		{
			startPoint :
			{
				comment : 'mouse down point on drag creation',
				type : 'euclid_point'
			},
			itemPath:
			{
				comment : 'drag the item to this pnw',
				type : [ 'undefined', 'jion$path' ]
			},
			toPnw:
			{
				comment : 'drag the item to this pnw',
				type : [ 'undefined', 'euclid_point' ]
			}
		}
	};
}


var
	action_itemDrag;


/*
| Capsule
*/
( function( ) {
'use strict';


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
	return this.itemPath.equals( path );
};


} )( );
