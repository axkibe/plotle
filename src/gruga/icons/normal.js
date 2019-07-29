/*
| The "normal" icon.
|
|
|     A
|     **
|     ***
|     ****
|     *****
|     ******
|     *******
|     **F**C*B
|     G   **
|          **
|           ED
|
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


const gleam_border = tim.require( '../../gleam/border' );
const gleam_color = tim.require( '../../gleam/color' );
const gleam_facet = tim.require( '../../gleam/facet' );
const gleam_point = tim.require( '../../gleam/point' );
const gleam_shape = tim.require( '../../gleam/shape' );
const gleam_shape_line = tim.require( '../../gleam/shape/line' );
const gleam_shape_start = tim.require( '../../gleam/shape/start' );


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
	const ap = gleam_point.createXY( -4, -9 );

	return( gleam_shape.create(
		'list:init',
		[
			gleam_shape_start.create( 'p', ap ), // A
			gleam_shape_line.create( 'p', ap.add(  11,  10 ) ), // B
			gleam_shape_line.create( 'p', ap.add(   6,  11 ) ), // C
			gleam_shape_line.create( 'p', ap.add(   9,  17 ) ), // D
			gleam_shape_line.create( 'p', ap.add(   7,  18 ) ), // E
			gleam_shape_line.create( 'p', ap.add(   4,  12 ) ), // F
			gleam_shape_line.create( 'p', ap.add(   0,  15 ) ), // G
			gleam_shape_line.create( 'close', true )
		],
		'pc', gleam_point.zero
	) );
};


} );

