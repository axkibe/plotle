/*
| The "remove" icon.
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


var
	gruga_iconRemove,
	gleam_border,
	gleam_color,
	gleam_facet,
	gleam_point,
	gleam_shape,
	gleam_shape_line,
	gleam_shape_start;


/*
| Capsule
*/
( function( ) {
'use strict';


var
	ah,
	aw,
	ch,
	cw,
	pc,
	pne,
	pnw,
	pse,
	psw;

pc = gleam_point.zero;

pnw = pc.add( -6, -6 );

pse = pc.add(  6,  6 );

pne = pc.add( pse.x, pnw.y );

psw = pc.add( pnw.x, pse.y );


// arm with and height
aw = 2;
ah = 2;

// center point width/height
cw = 2;
ch = 2;


gruga_iconRemove = { };


gruga_iconRemove.facet =
	gleam_facet.create(
		'fill', gleam_color.rgb( 255, 0, 0 ),
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


gruga_iconRemove.shape =
	gleam_shape.create(
		'list:init',
		[
			gleam_shape_start.create(
				'p', pnw                  // A
			),
			gleam_shape_line.create(
				'p', pnw.add(  aw,   0 )  // B
			),
			gleam_shape_line.create(
				'p', pc.add(    0, -ch )  // C
			),
			gleam_shape_line.create(
				'p', pne.add( -aw,   0 )  // D
			),
			gleam_shape_line.create(
				'p', pne                  // E
			),
			gleam_shape_line.create(
				'p', pne.add(   0,  ah )  // F
			),
			gleam_shape_line.create(
				'p', pc.add(   cw,   0 )  // G
			),
			gleam_shape_line.create(
				'p', pse.add(   0, -ah )  // H
			),
			gleam_shape_line.create(
				'p', pse                  // I
			),
			gleam_shape_line.create(
				'p', pse.add( -aw,   0 )  // J
			),
			gleam_shape_line.create(
				'p', pc.add(    0,  ch )  // K
			),
			gleam_shape_line.create(
				'p', psw.add(  aw,   0 )  // L
			),
			gleam_shape_line.create(
				'p', psw                  // M
			),
			gleam_shape_line.create(
				'p', psw.add(   0, -ah )  // N
			),
			gleam_shape_line.create(
				'p', pc.add(  -cw,   0 )  // O
			),
			gleam_shape_line.create(
				'p', pnw.add(   0,  ah )  // P
			),
			gleam_shape_line.create(
				'close', true             // A
			)
		],
		'pc', pc
	);


if( FREEZE ) Object.freeze( gruga_iconRemove );


} )( );
