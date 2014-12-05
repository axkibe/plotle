/*
| The "moveto" icon.
*/


var
	euclid_point,
	euclid_rect,
	euclid_shape,
	icons_moveto;


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
	return {
		id :
			'icons_moveto',
		singleton :
			true,
		equals :
			'primitive',
		init :
			[ ]
	};
}


/*
| The moveto button's icon.
|
|        A (ap)
|       ***
|      *****
|     *******
|    G*F***C*B
|      *****
|      *****
|      *****
|      E***D
|
|      H***I
|      K***J
*/
icons_moveto.prototype._init =
	function( )
{
	var ap;

	ap =
		euclid_point.create(
			'x', 22,
			'y', 11
		);

	this._arrow =
		euclid_shape.create(
			'hull',
				[
					'start', ap,              // A
					'line', ap.add(  6,  8 ), // B
					'line', ap.add(  2,  8 ), // C
					'line', ap.add(  2, 14 ), // D
					'line', ap.add( -2, 14 ), // E
					'line', ap.add( -2,  8 ), // F,
					'line', ap.add( -6,  8 ), // G,
					'line', 'close'
				],
			'pc',
				ap.add( 0, 7 )
		);

	this._base1 =
		euclid_rect.create(
			'pnw', ap.add( -2, 16 ),
			'pse', ap.add( +2, 17 )
		);

	this._base2 =
		euclid_rect.create(
			'pnw', ap.add( -2, 19 ),
			'pse', ap.add( +2, 20 )
		);

};


/*
| Draws the moveto button in a display.
*/
icons_moveto.prototype.draw =
	function(
		display,
		style,
		view
	)
{
	display.paint( style, this._arrow, view );

	display.paint( style, this._base1, view );

	display.paint( style, this._base2, view );
};


} )( );
