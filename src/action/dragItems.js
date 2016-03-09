/*
| The user is dragging an item.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'action_dragItems',
		attributes :
		{
			moveBy :
			{
				comment : 'drag the item to this pnw',
				type : [ 'undefined', 'euclid_point' ]
			},
			itemPaths :
			{
				comment : 'the paths of the items to drag',
				type : [ 'undefined', 'jion$pathRay' ]
			},
			startPoint :
			{
				comment : 'mouse down point on drag creation',
				type : 'euclid_point'
			}
		}
	};
}


var
	action_dragItems;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	action_dragItems = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_dragItems.prototype;


/*
| Returns true if an entity with path is affected by this action.
*/
prototype.affects =
	function(
		path
	)
{
	var
		a,
		pa,
		paths,
		pLen;

	paths = this.itemPaths;

	for( a = 0, pLen = paths.length; a < pLen; a++ )
	{
		pa = paths.get( a );

		if( pa.equals( path ) ) return true;
	}

	return false;
};


/*
| This is a hand action.
*/
prototype.isHand = true;


} )( );
