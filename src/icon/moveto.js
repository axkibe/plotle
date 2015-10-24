/*
| The "moveto" icon.
*/


var
	euclid_point,
	euclid_rect,
	euclid_shape,
	euclid_shape_start,
	euclid_shape_line,
	icon_moveto;


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
		id : 'icon_moveto',
		attributes :
		{
			// FIXME make it a facet
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

prototype = icon_moveto.prototype;


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
prototype._init =
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
					euclid_shape_start.create( 'p', ap ), // A
					euclid_shape_line.create( 'p', ap.add(  6,  8 ) ), // B
					euclid_shape_line.create( 'p', ap.add(  2,  8 ) ), // C
					euclid_shape_line.create( 'p', ap.add(  2, 14 ) ), // D
					euclid_shape_line.create( 'p', ap.add( -2, 14 ) ), // E
					euclid_shape_line.create( 'p', ap.add( -2,  8 ) ), // F,
					euclid_shape_line.create( 'p', ap.add( -6,  8 ) ), // G,
					euclid_shape_line.create( 'close', true )
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
prototype.draw =
	function(
		display
	)
{
	display.paint( this, this._arrow );

	display.paint( this, this._base1 );

	display.paint( this, this._base2 );
};


} )( );
