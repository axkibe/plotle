/*
| A line section of an anchored shape.
|
| Used by anchor_shape.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_shape_line',
		attributes :
		{
			p :
			{
				comment : 'connect to',
				type : [ 'undefined', 'euclid_anchor_point' ]
			},
			close :
			{
				comment : 'true if this closes the shape',
				type : [ 'undefined', 'boolean' ]
			},
			fly :
			{
				comment : 'true if this does not draw a border',
				type : [ 'undefined', 'boolean' ]
			}
		}
	};
}


var
	euclid_shape_line,
	euclid_anchor_shape_line;


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

prototype = euclid_anchor_shape_line.prototype;


/*
| Anchors to an unanchored a tenter.
*/
prototype.compute =
	function(
		tenter
	)
{
	return(
		euclid_shape_line.create(
			'p', this.p && this.p.compute( tenter ),
			'close', this.close,
			'fly', this.fly
		)
	);
};


} )( );

