/*
| The "moveto" icon.
*/


var
	euclid_point,
	euclid_rect,
	euclid_shape,
	icon_moveto,
	shapeSection_start,
	shapeSection_line;


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
		id : 'icon_moveto',
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
icon_moveto.prototype._init =
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
			'ray:init',
				[
					shapeSection_start.create( 'p', ap ), // A
					shapeSection_line.create( 'p', ap.add(  6,  8 ) ), // B
					shapeSection_line.create( 'p', ap.add(  2,  8 ) ), // C
					shapeSection_line.create( 'p', ap.add(  2, 14 ) ), // D
					shapeSection_line.create( 'p', ap.add( -2, 14 ) ), // E
					shapeSection_line.create( 'p', ap.add( -2,  8 ) ), // F,
					shapeSection_line.create( 'p', ap.add( -6,  8 ) ), // G,
					shapeSection_line.create( 'close', true )
				],
			'pc', ap.add( 0, 7 )
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
icon_moveto.prototype.draw =
	function(
		display,
		view
	)
{
	display.paint( this.fill, this.border, this._arrow, view );

	display.paint( this.fill, this.border, this._base1, view );

	display.paint( this.fill, this.border, this._base2, view );
};


} )( );
