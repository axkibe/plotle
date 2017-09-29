/*
| Start section of an anchored shape.
|
| Used by shape.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_shape_start',
		attributes :
		{
			p :
			{
				comment : 'start here',
				type : [ 'euclid_anchor_point' ]
			}
		}
	};
}


var
	euclid_shape_start,
	euclid_anchor_shape_start;


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

prototype = euclid_anchor_shape_start.prototype;


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
		euclid_shape_start.create(
			'p', this.p.compute( area, view )
		)
	);
};



} )( );

