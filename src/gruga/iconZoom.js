/*
| The zoom icon.
|
|       .----.
|     .'      '.
|    .          .
|    '          '
|    '          '
|    '         '
|     '.     .'
|     /  /'''
|    /  /
|   /  /
|   '.'
|
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_point = tim.require( '../gleam/point' );

const gleam_shape_line = tim.require( '../gleam/shape/line' );

const gleam_shape_round = tim.require( '../gleam/shape/round' );

const gleam_shape_start = tim.require( '../gleam/shape/start' );

const gleam_border = tim.require( '../gleam/border' );

const gleam_color = tim.require( '../gleam/color' );

const gleam_facet = tim.require( '../gleam/facet' );

const gleam_shape = tim.require( '../gleam/shape' );

const gleam_shapeList = tim.require( '../gleam/shapeList' );


def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.black,
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);



def.staticLazy.shape =
	function ( )
{
	const c = gleam_point.createXY( 2, -3 );

	return( gleam_shapeList.create(
		'list:init',
		[
			gleam_shape.create(
				'list:init',
				[
					gleam_shape_start.createP(    c.add( -12.0, 12 ) ),
					gleam_shape_line.createP(     c.add(  -7.5,  6 ) ),
					gleam_shape_round.createP(    c.add(  -9.0,  0 ) ),
					gleam_shape_round.createP(    c.add(   0.0, -9 ) ),
					gleam_shape_round.createP(    c.add(   9.0,  0 ) ),
					gleam_shape_round.createP(    c.add(   0.0,  9 ) ),
					gleam_shape_round.createP(    c.add(  -5.0,  8 ) ),
					gleam_shape_line.createP(     c.add(  -9.0, 13 ) ),
					gleam_shape_round.close
				],
				'pc', c,
				'nogrid', true
			),
			gleam_shape.create(
				'list:init',
				[
					gleam_shape_start.createP(    c.add( -8.5,  0.0 ) ),
					gleam_shape_round.createPCcw( c.add(  0.0,  8.5 ) ),
					gleam_shape_round.createPCcw( c.add(  8.5,  0.0 ) ),
					gleam_shape_round.createPCcw( c.add(  0.0, -8.5 ) ),
					gleam_shape_round.closeCcw
				],
				'pc', c,
				'nogrid', true
			)
		]
	) );
};


} );

