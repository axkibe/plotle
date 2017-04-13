/*
| The user is selecting stuff via a rectangle.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'action_select',
		attributes :
		{
			itemPath :
			{
				comment : 'if selecting ranges, item to path',
				type : [ 'undefined', 'jion$path' ]
			},
			startPoint :
			{
				comment : 'point at start of operation',
				type : [ 'undefined', 'gleam_point' ]
			},
			toPoint :
			{
				comment : 'point the rectangle goes to',
				type : [ 'undefined', 'gleam_point' ]
			}
		}
	};
}


var
	action_select,
	gleam_rect,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	prototype;


if( NODE )
{
	action_select = require( 'jion' ).this( module, 'source' );

	return;
}


prototype = action_select.prototype;


/*
| Returns true if an entity with path is affected by this action.
*/
prototype.affects =
	function(
		path
	)
{
	var
		item,
		iPos,
		iZone,
		tPos,
		tZone;

	tZone = this.zone;

	if( !tZone ) return false;

	item = root.getPath( path );

	tPos = tZone.pos;

	iZone = item.zone;

	iPos = iZone.pos;

	return(
		iPos.x >= tPos.x
		&& iPos.y >= tPos.y
		&& iPos.x + iZone.width <= tPos.x + tZone.width
		&& iPos.y + iZone.height <= tPos.y + tZone.height
	);
};


jion.lazyValue(
	prototype,
	'zone',
	function( )
{
	return(
		this.startPoint
		&& gleam_rect.createArbitrary(
			this.startPoint,
			this.toPoint
		)
	);
}
);



} )( );
