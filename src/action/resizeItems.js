/*
| The user is resizing an item.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'action_resizeItems',
		attributes :
		{
			itemPaths:
			{
				comment : 'the paths of the items to drag',
				type : [ 'undefined', 'jion$pathRay' ]
			},
			startPoint :
			{
				comment : 'mouseDown point on drag creation',
				type : 'euclid_point'
			},
			pBase :
			{
				comment : 'base the resize to this point',
				type : [ 'undefined', 'euclid_point' ]
			},
			proportional :
			{
				comment : 'if true resize proportinal',
				// scaleX must be === scaleY
				type : [ 'undefined', 'boolean' ]
			},
			resizeDir :
			{
				comment : 'resize to this direction',
				type : [ 'undefined', 'string' ]
			},
			scaleX :
			{
				comment : 'scale x by this factor',
				type : [ 'undefined', 'number' ]
			},
			scaleY :
			{
				comment : 'scale y by this factor',
				type : [ 'undefined', 'number' ]
			},
			startZones :
			{
				comment : 'the zones as the resize started',
				type : [ 'undefined', 'euclid_rectGroup' ]
			}
		}
	};
}


var
	action_resizeItems;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	action_resizeItems = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_resizeItems.prototype;


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
