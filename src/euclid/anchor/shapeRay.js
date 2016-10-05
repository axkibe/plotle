/*
| A ray of anchored, geometric shapes.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_shapeRay',
		ray : require( './typemap-shape' )
	};
}


var
	euclid_shapeRay,
	euclid_anchor_border,
	euclid_anchor_shapeRay;


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

prototype = euclid_anchor_shapeRay.prototype;


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
| Computes to an unanchored shapeRay for a tenter.
*/
prototype.compute =
	function(
		tenter
	)
{
	var
		r,
		ray,
		rZ;

/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	ray = [ ];

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		ray[ r ] = this.get( r ).compute( tenter );
	}

	return(
		euclid_shapeRay.create(
			'ray:init', ray
		)
	);
};


})( );
