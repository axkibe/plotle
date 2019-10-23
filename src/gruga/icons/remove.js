/*
| The "remove" icon.
|
|  A**B   D**E
|  P***   ***F
|    ***C***
|     O***G
|    ***K***
|  N***   ***H
|  M**L   J**I
|
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;

const angle = tim.require( '../../gleam/angle/root' );
const gleam_border = tim.require( '../../gleam/border' );
const gleam_color = tim.require( '../../gleam/color' );
const gleam_facet = tim.require( '../../gleam/facet' );
const gleam_point = tim.require( '../../gleam/point' );
const gleam_shape = tim.require( '../../gleam/shape' );
const gleam_shape_line = tim.require( '../../gleam/shape/line' );
const gleam_shape_start = tim.require( '../../gleam/shape/start' );


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
			gleam_shape_start.createPFun( pnw,                angle.nw ), // A
			gleam_shape_line.createPFun( pnw.add(  aw,   0 ), angle.ne ), // B
			gleam_shape_line.createPFun( pc.add(    0, -ch ), angle.n  ), // C
			gleam_shape_line.createPFun( pne.add( -aw,   0 ), angle.nw ), // D
			gleam_shape_line.createPFun( pne,                 angle.ne ), // E
			gleam_shape_line.createPFun( pne.add(   0,  ah ), angle.se ), // F
			gleam_shape_line.createPFun( pc.add(   cw,   0 ), angle.e  ), // G
			gleam_shape_line.createPFun( pse.add(   0, -ah ), angle.ne ), // H
			gleam_shape_line.createPFun( pse,                 angle.se ), // I
			gleam_shape_line.createPFun( pse.add( -aw,   0 ), angle.sw ), // J
			gleam_shape_line.createPFun( pc.add(    0,  ch ), angle.s  ), // K
			gleam_shape_line.createPFun( psw.add(  aw,   0 ), angle.se ), // L
			gleam_shape_line.createPFun( psw,                 angle.sw ), // M
			gleam_shape_line.createPFun( psw.add(   0, -ah ), angle.nw ), // N
			gleam_shape_line.createPFun( pc.add(  -cw,   0 ), angle.w  ), // O
			gleam_shape_line.createPFun( pnw.add(   0,  ah ), angle.sw ), // P
			gleam_shape_line.close                                        // A
		],
		'pc', pc
	) );
};


} );

