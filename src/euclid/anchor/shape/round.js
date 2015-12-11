/*
| A round section of an anchored shape.
|
| Used by anchor shape.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_shape_round',
		attributes :
		{
			p :
			{
				comment : 'connect to',
				type : [ 'undefined', 'euclid_anchor_point' ]
			},
			rotation :
			{
				comment : '"clockwise" or "anticlockwise"',
				type : 'string'
			},
			close :
			{
				comment : 'true if this closes the shape',
				type : [ 'undefined', 'boolean' ]
			}
		}
	};
}


var
	euclid_shape_round,
	euclid_anchor_shape_round;


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

prototype = euclid_anchor_shape_round.prototype;


/*
| Computes to an unanchored round for a area/view.
*/
prototype.compute =
	function(
		area,
		view
	)
{
	return(
		euclid_shape_round.create(
			'p', this.p && this.p.compute( area, view ),
			'rotation', this.rotation,
			'close', this.close
		)
	);
};


} )( );
