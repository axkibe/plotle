/*
| Sketches of the icons on the discs.
*/

var
	icon_remove,
	euclid_point,
	euclid_shape,
	math_half,
	shapeSection_line,
	shapeSection_start;


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
		id : 'icon_remove',
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

prototype = icon_remove.prototype;


/*
|  Initializer.
|
|
| NW**B   D**E
|  P***   ***F
|    ***C***
|     O***G
|    ***K***
|  N***   ***H
|  M**L   J**SE
|
*/
prototype._init =
	function( )
{
	var
		ah,
		aw,
		ch,
		cw,
		pnw,
		pne,
		pse,
		psw,
		pc,
		sections;

	pnw = euclid_point.create( 'x', 17, 'y', 16 );

	pse = euclid_point.create( 'x', 28, 'y', 27 );

	pne = euclid_point.create( 'x', pse.x, 'y', pnw.y );

	psw = euclid_point.create( 'x', pnw.x, 'y', pse.y );

	pc =
		euclid_point.create(
			'x', math_half( pnw.x + pse.x ),
			'y', math_half( pnw.y + pse.y )
		);

	// arm with and height
	aw = 2;
	ah = 2;

	// center point width/height
	cw = 2;
	ch = 2;

	sections =
		[
		shapeSection_start.create( 'p', pnw ),                // A
		shapeSection_line.create( 'p', pnw.add(  aw,   0 ) ), // B
		shapeSection_line.create( 'p', pc.add(    0, -ch ) ), // C
		shapeSection_line.create( 'p', pne.add( -aw,   0 ) ), // D
		shapeSection_line.create( 'p', pne ),                 // E
		shapeSection_line.create( 'p', pne.add(   0,  ah ) ), // F
		shapeSection_line.create( 'p', pc.add(   cw,   0 ) ), // G
		shapeSection_line.create( 'p', pse.add(   0, -ah ) ), // H
		shapeSection_line.create( 'p', pse ),                 // I
		shapeSection_line.create( 'p', pse.add( -aw,   0 ) ), // J
		shapeSection_line.create( 'p', pc.add(    0,  ch ) ), // K
		shapeSection_line.create( 'p', psw.add(  aw,   0 ) ), // L
		shapeSection_line.create( 'p', psw ),                 // M
		shapeSection_line.create( 'p', psw.add(   0, -ah ) ), // N
		shapeSection_line.create( 'p', pc.add(  -cw,   0 ) ), // O
		shapeSection_line.create( 'p', pnw.add(   0,  ah ) ), // P
		shapeSection_line.create( 'close', true )             // A
		];

	this._x = euclid_shape.create( 'ray:init', sections, 'pc', pc );
};


/*
| Displays the moveto button.
*/
prototype.draw =
	function(
		display,
		view
	)
{
	display.paint( this.fill, this.border, this._x, view );
};


} )( );
