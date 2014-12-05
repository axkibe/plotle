/*
| The "normal" icon.
*/


var
	icons_normal,
	euclid_point,
	euclid_shape;


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
		id :
			'icons_normal',
		singleton :
			true,
		equals :
			'primitive',
		init :
			[ ]
	};
}


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
icons_normal.prototype._init =
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
			'hull',
				[
					'start', ap,                // A
					'line', ap.add(  11,  10 ), // B
					'line', ap.add(   6,  11 ), // C
					'line', ap.add(   9,  17 ), // D
					'line', ap.add(   7,  18 ), // E
					'line', ap.add(   4,  12 ), // F
					'line', ap.add(   0,  15 ), // G
					'line', 'close'
				],
			'pc',
				ap.add( 5, 9 )
		);
};


/*
| Draws the moveto button in a display.
*/
icons_normal.prototype.draw =
	function(
		display,
		style,
		view
	)
{
	display.paint( style, this._arrow, view );
};


} )( );
