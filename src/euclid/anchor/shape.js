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
| Computes to an unanchored shape for a frame/view.
*/
prototype.compute =
	function(
		frame,
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
		ray[ r ] = this.get( r ).compute( frame, view );
	}

	return(
		euclid_shape.create(
			'pc', this.pc.compute( frame, view ),
			'ray:init', ray
		)
	);
};


})( );
