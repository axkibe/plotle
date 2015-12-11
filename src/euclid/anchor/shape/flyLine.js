/*
| An invisible line section of an anchored shape.
|
| Makes a fill but not an border.
|
| Used by anchor_shape.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'euclid_anchor_shape_flyLine',
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
			}
		}
	};
}


var
	euclid_shape_flyLine,
	euclid_anchor_shape_flyLine;


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

prototype = euclid_anchor_shape_flyLine.prototype;


/*
| Computes to an unanchored flyLine for a area/view.
*/
prototype.compute =
	function(
		area,
		view
	)
{
	return(
		euclid_shape_flyLine.create(
			'p', this.p && this.p.compute( area, view ),
			'close', this.close
		)
	);
};


} )( );
