/*
| The "normal" icon.
*/


var
	icon_normal,
	euclid_point,
	euclid_shape,
	euclid_shape_start,
	euclid_shape_line;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition
*/
if( JION )
{
	return {
		id : 'icon_normal',
		attributes :
		{
			border :
				{
					comment : 'border',
					type : 'euclid_border'
				},
			fill :
				{
					comment : 'fill',
					type : 'euclid_color'
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

prototype = icon_normal.prototype;


/*
| Sketches the normal button's icon.
|
|
|     A
|     **
|     ***
|     ****
|     *****
|     ******
|     *******
|     **F**C*B
|     G   **
|          **
|           ED
*/
prototype._init =
	function( )
{
	var
		ap;

	ap =
		euclid_point.create(
			'x', 18,
			'y', 12
		);

	this._arrow =
		euclid_shape.create(
			'ray:init',
				[
				euclid_shape_start.create( 'p', ap ), // A
				euclid_shape_line.create( 'p', ap.add(  11,  10 ) ), // B
				euclid_shape_line.create( 'p', ap.add(   6,  11 ) ), // C
				euclid_shape_line.create( 'p', ap.add(   9,  17 ) ), // D
				euclid_shape_line.create( 'p', ap.add(   7,  18 ) ), // E
				euclid_shape_line.create( 'p', ap.add(   4,  12 ) ), // F
				euclid_shape_line.create( 'p', ap.add(   0,  15 ) ), // G
				euclid_shape_line.create( 'close', true )
				],
			'pc',
				ap.add( 5, 9 )
		);
};


/*
| Draws the moveto button in a display.
*/
prototype.draw =
	function(
		display,
		view
	)
{
	display.paint( this.fill, this.border, this._arrow, view );
};


} )( );
