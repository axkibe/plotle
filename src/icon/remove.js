/*
| Sketches of the icons on the discs.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'icon_remove',
		attributes :
		{
			facet :
			{
				comment : 'the icon facet',
				type : 'euclid_facet'
			}
		},
		init : [ ]
	};
}


var
	icon_remove,
	euclid_point,
	euclid_shape,
	euclid_shape_line,
	euclid_shape_start,
	math_half;


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
		euclid_shape_start.create( 'p', pnw ),                // A
		euclid_shape_line.create( 'p', pnw.add(  aw,   0 ) ), // B
		euclid_shape_line.create( 'p', pc.add(    0, -ch ) ), // C
		euclid_shape_line.create( 'p', pne.add( -aw,   0 ) ), // D
		euclid_shape_line.create( 'p', pne ),                 // E
		euclid_shape_line.create( 'p', pne.add(   0,  ah ) ), // F
		euclid_shape_line.create( 'p', pc.add(   cw,   0 ) ), // G
		euclid_shape_line.create( 'p', pse.add(   0, -ah ) ), // H
		euclid_shape_line.create( 'p', pse ),                 // I
		euclid_shape_line.create( 'p', pse.add( -aw,   0 ) ), // J
		euclid_shape_line.create( 'p', pc.add(    0,  ch ) ), // K
		euclid_shape_line.create( 'p', psw.add(  aw,   0 ) ), // L
		euclid_shape_line.create( 'p', psw ),                 // M
		euclid_shape_line.create( 'p', psw.add(   0, -ah ) ), // N
		euclid_shape_line.create( 'p', pc.add(  -cw,   0 ) ), // O
		euclid_shape_line.create( 'p', pnw.add(   0,  ah ) ), // P
		euclid_shape_line.create( 'close', true )             // A
		];

	this._x = euclid_shape.create( 'ray:init', sections, 'pc', pc );
};


/*
| Displays the moveto button.
*/
prototype.draw =
	function(
		display
	)
{
	display.paint( this.facet, this._x );
};


} )( );
