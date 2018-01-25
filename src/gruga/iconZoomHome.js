/*
| The zoom home icon.
|
|
|
|  ###    **
|  ###  ******
|  ###*** ** ****
|  ##** ****** ****
| *** ********** ***
|** ************** **
|   **************
|   **************
|   *******   ****
|   *******   ****
|   *******   ****
|   *******   ****
|   *******   ****
*/
'use strict';


tim.define( module, 'gruga_iconZoomHome', ( def, gruga_iconZoomHome ) => {


const gleam_point = require( '../gleam/point' );

const gleam_shape_line = require( '../gleam/shape/line' );

const gleam_shape_start = require( '../gleam/shape/start' );

const gleam_border = require( '../gleam/border' );

const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );

const gleam_shape = require( '../gleam/shape' );

const gleam_shapeList = require( '../gleam/shapeList' );


def.staticLazy.facet = ( ) =>
	gleam_facet.create(
		'fill', gleam_color.black,
		'border',
			gleam_border.create(
				'color', gleam_color.rgb( 128, 0, 0 )
			)
	);


def.staticLazy.shape =
	function( )
{
	const c = gleam_point.xy( 0, 2 );

	return( gleam_shapeList.create(
		'list:init',
		[
			gleam_shape.create(
				'list:init',
				[
					gleam_shape_start.p( c.add( -6,  4 ) ),
					gleam_shape_line.p( c.add(  -6, -2 ) ),
					gleam_shape_line.p( c.add(   0, -9 ) ),
					gleam_shape_line.p( c.add(   6, -2 ) ),
					gleam_shape_line.p( c.add(   6,  4 ) ),

					gleam_shape_line.p( c.add(   2,  4 ) ),
					gleam_shape_line.p( c.add(   2, -4 ) ),
					gleam_shape_line.p( c.add(  -2, -4 ) ),
					gleam_shape_line.p( c.add(  -2,  4 ) ),

					gleam_shape_line.close
				],
				'pc', c,
				'nogrid', true
			),
			gleam_shape.create(
				'list:init',
				[
					gleam_shape_start.p( c.add(  -8,  -3 ) ),
					gleam_shape_line.p( c.add(  -10,  -3 ) ),

					gleam_shape_line.p( c.add(   -7,  -7 ) ),
					gleam_shape_line.p( c.add(   -7, -13 ) ),
					gleam_shape_line.p( c.add(   -4, -13 ) ),
					gleam_shape_line.p( c.add(   -4,  -9 ) ),

					gleam_shape_line.p( c.add(    0, -12 ) ),
					gleam_shape_line.p( c.add(    8,  -3 ) ),
					gleam_shape_line.p( c.add(   10,  -3 ) ),
					gleam_shape_line.p( c.add(    0, -14 ) ),
					gleam_shape_line.close
				],
				'pc', c,
				'nogrid', true
			)
		]
	) );
};


} );

