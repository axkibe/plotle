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
				type : [ 'undefined', 'euclid_point' ]
			},
			toPoint :
			{
				comment : 'point the rectangle goes to',
				type : [ 'undefined', 'euclid_point' ]
			}
		}
	};
}


var
	action_select,
	euclid_anchor_rect,
	euclid_rect,
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
		iPnw,
		iPse,
		iZone,
		tZone,
		tPnw,
		tPse;

	tZone = this.vZone;

	if( !tZone ) return false;

	item = root.getPath( path );

	tPnw = tZone.pnw;

	tPse = tZone.pse;

	iZone = item.vZone;

	iPnw = iZone.pnw;

	iPse = iZone.pse;

	return(
		iPnw.x >= tPnw.x
		&& iPnw.y >= tPnw.y
		&& iPse.x <= tPse.x
		&& iPse.y <= tPse.y
	);
};


/*
| FIXME recompute startPoint/toPoint where they
| are gathered
*/
jion.lazyValue(
	prototype,
	'aZone',
	function( )
{
	var
		rect;

	if( !this.startPoint ) return;

	rect =
		euclid_rect.createArbitrary(
			this.startPoint,
			this.toPoint
		);

	return(
		euclid_anchor_rect.create(
			'pnw', rect.pnw.apnw,
			'pse', rect.pse.apnw
		)
	);
}
);


// FIXME remove
jion.lazyValue(
	prototype,
	'vZone',
	function( )
{
	return(
		this.startPoint
		&& euclid_rect.createArbitrary(
			this.startPoint,
			this.toPoint
		)
	);
}
);



} )( );
