/*
| A rectangle (or a areae)
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_rect',
		attributes :
		{
			pnw :
			{
				comment : 'point in north-west',
				type : require( './typemap-points.js' )
			},
			pse :
			{
				comment : 'point in south-east',
				type : require( './typemap-points.js' )
			}
		}
	};
}


var
	euclid_anchor_border,
	euclid_anchor_point,
	euclid_anchor_rect,
	euclid_rect;

/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = euclid_anchor_rect.prototype;


/*
| Returns an euclid_anchor_border for this
| anchored shape.
*/
prototype.border =
	function(
		d
	)
{
	return(
		euclid_anchor_border.create(
			'distance', d,
			'shape', this
		)
	);
};


/*
| Computes to an unanchored rect for a area/view:
*/
prototype.compute =
	function(
		area,
		view
	)
{
	return(
		euclid_rect.create(
			'pnw', this.pnw.compute( area, view ),
			'pse', this.pse.compute( area, view )
		)
	);
};


/*
| Rect filling the full area.
*/
euclid_anchor_rect.full =
	euclid_anchor_rect.create(
		'pnw', euclid_anchor_point.nw,
		'pse', euclid_anchor_point.seMin1
	);


})( );
