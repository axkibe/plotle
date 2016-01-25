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
	euclid_anchor_point,
	euclid_anchor_shape,
	euclid_anchor_shape_start,
	euclid_anchor_shape_line,
	euclid_border,
	gleam_color,
	euclid_facet;


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

pc = euclid_anchor_point.c;

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
	euclid_facet.create(
		'fill', gleam_color.rgb( 255, 0, 0 ),
		'border',
			euclid_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


gruga_iconRemove.shape =
	euclid_anchor_shape.create(
		'ray:init',
		[
			euclid_anchor_shape_start.create(
				'p', pnw                  // A
			),
			euclid_anchor_shape_line.create(
				'p', pnw.add(  aw,   0 )  // B
			),
			euclid_anchor_shape_line.create(
				'p', pc.add(    0, -ch )  // C
			),
			euclid_anchor_shape_line.create(
				'p', pne.add( -aw,   0 )  // D
			),
			euclid_anchor_shape_line.create(
				'p', pne                  // E
			),
			euclid_anchor_shape_line.create(
				'p', pne.add(   0,  ah )  // F
			),
			euclid_anchor_shape_line.create(
				'p', pc.add(   cw,   0 )  // G
			),
			euclid_anchor_shape_line.create(
				'p', pse.add(   0, -ah )  // H
			),
			euclid_anchor_shape_line.create(
				'p', pse                  // I
			),
			euclid_anchor_shape_line.create(
				'p', pse.add( -aw,   0 )  // J
			),
			euclid_anchor_shape_line.create(
				'p', pc.add(    0,  ch )  // K
			),
			euclid_anchor_shape_line.create(
				'p', psw.add(  aw,   0 )  // L
			),
			euclid_anchor_shape_line.create(
				'p', psw                  // M
			),
			euclid_anchor_shape_line.create(
				'p', psw.add(   0, -ah )  // N
			),
			euclid_anchor_shape_line.create(
				'p', pc.add(  -cw,   0 )  // O
			),
			euclid_anchor_shape_line.create(
				'p', pnw.add(   0,  ah )  // P
			),
			euclid_anchor_shape_line.create(
				'close', true             // A
			)
		],
		'pc', pc
	);


if( FREEZE ) Object.freeze( gruga_iconRemove );


} )( );
