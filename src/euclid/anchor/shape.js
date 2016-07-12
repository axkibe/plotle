/*
| A generic anchored, geometric shape.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_shape',
		attributes :
		{
			pc :
			{
				comment : 'center point',
				type : 'euclid_anchor_point'
			}
		},
		ray : require( '../../typemaps/anchorShapeSection' )
	};
}


var
	euclid_anchor_border,
	euclid_anchor_shape,
	euclid_shape;


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

prototype = euclid_anchor_shape.prototype;


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
| Computes to an unanchored shape for a area/view.
|
| FIXME area should be part of view.
| FIXME cache last view (including other anchor shapes)
*/
prototype.compute =
	function(
		area,
		view
	)
{
	var
		r,
		ray,
		rZ;

	ray = [ ];

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		ray[ r ] = this.get( r ).compute( area, view );
	}

	return(
		euclid_shape.create(
			'pc', this.pc.compute( area, view ),
			'ray:init', ray
		)
	);
};


})( );
