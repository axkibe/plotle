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
'use strict';


tim.define( module, 'gruga_iconRemove', ( def, gruga_iconRemove ) => {


const gleam_border = require( '../gleam/border' );

const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );

const gleam_point = require( '../gleam/point' );

const gleam_shape = require( '../gleam/shape' );

const gleam_shape_line = require( '../gleam/shape/line' );

const gleam_shape_start = require( '../gleam/shape/start' );


def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.rgb( 255, 0, 0 ),
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


def.staticLazy.shape =
	function( )
{
	const pc = gleam_point.zero;

	const pnw = pc.add( -6, -6 );

	const pse = pc.add(  6,  6 );

	const pne = pc.add( pse.x, pnw.y );

	const psw = pc.add( pnw.x, pse.y );

	// arm with and height
	const aw = 2;
	const ah = 2;

	// center point width/height
	const cw = 2;
	const ch = 2;

	return( gleam_shape.create(
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
	) );
};


} );

