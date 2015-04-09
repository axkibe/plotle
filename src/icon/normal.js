/*
| The "normal" icon.
*/


var
	icon_normal,
	euclid_point,
	euclid_shape,
	shapeSection_start,
	shapeSection_line;


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
				shapeSection_start.create( 'p', ap ), // A
				shapeSection_line.create( 'p', ap.add(  11,  10 ) ), // B
				shapeSection_line.create( 'p', ap.add(   6,  11 ) ), // C
				shapeSection_line.create( 'p', ap.add(   9,  17 ) ), // D
				shapeSection_line.create( 'p', ap.add(   7,  18 ) ), // E
				shapeSection_line.create( 'p', ap.add(   4,  12 ) ), // F
				shapeSection_line.create( 'p', ap.add(   0,  15 ) ), // G
				shapeSection_line.create( 'close', true )
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
