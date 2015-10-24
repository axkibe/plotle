/*
| A "check" icon.
| used on the backbox
*/


var
	euclid_shape,
	euclid_shape_line,
	euclid_shape_start,
	icon_check;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'icon_check',
		attributes :
		{
			border :
			{
				comment : 'border',
				type : [ 'undefined', 'euclid_border' ]
			},
			fill :
			{
				comment : 'fill',
				type : 'euclid_color'
			},
			pc :
			{
				comment : 'center of the check',
				type : 'euclid_point'
			}
		},
		init : [ ]
	};
}


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = icon_check.prototype;


/*
| Sketches the normal button's icon.
*/
prototype._init =
	function( )
{
	var
		pc;

	pc = this.pc;

	this._check =
		euclid_shape.create(
			'ray:init',
			[
				euclid_shape_start.create( 'p', pc.add( -5,  -3 ) ),
				euclid_shape_line.create( 'p', pc.add(  2,   5 ) ),
				euclid_shape_line.create( 'p', pc.add( 14, -12 ) ),
				euclid_shape_line.create( 'p', pc.add(  2,  -1 ) ),
				euclid_shape_line.create( 'close', true )
			],
			'pc', pc
		);
};


/*
| Draws the check button on a display.
*/
prototype.draw =
	function(
		display
	)
{
	display.paint( this, this._check );
};


} )( );
