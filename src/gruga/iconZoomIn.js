/*
| The zoom in icon.
|
|
|       **
|       **
|   **********
|   **********
|       **
|       **
|
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_point = tim.require( '../gleam/point' );

const gleam_shape_line = tim.require( '../gleam/shape/line' );

const gleam_shape_start = tim.require( '../gleam/shape/start' );

const gleam_border = tim.require( '../gleam/border' );

const gleam_color = tim.require( '../gleam/color' );

const gleam_facet = tim.require( '../gleam/facet' );

const gleam_shape = tim.require( '../gleam/shape' );


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
	const c = gleam_point.zero;

	return( gleam_shape.create(
		'list:init',
		[
			gleam_shape_start.createP( c.add( -1, -7 ) ),
			gleam_shape_line.createP(  c.add(  1, -7 ) ),
			gleam_shape_line.createP(  c.add(  1, -1 ) ),
			gleam_shape_line.createP(  c.add(  7, -1 ) ),
			gleam_shape_line.createP(  c.add(  7,  1 ) ),
			gleam_shape_line.createP(  c.add(  1,  1 ) ),
			gleam_shape_line.createP(  c.add(  1,  7 ) ),
			gleam_shape_line.createP(  c.add( -1,  7 ) ),
			gleam_shape_line.createP(  c.add( -1,  1 ) ),
			gleam_shape_line.createP(  c.add( -7,  1 ) ),
			gleam_shape_line.createP(  c.add( -7, -1 ) ),
			gleam_shape_line.createP(  c.add( -1, -1 ) ),
			gleam_shape_line.close
		],
		'pc', c
	) );
};


} );

