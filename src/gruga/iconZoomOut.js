/*
| The zoom out icon.
|
|
|   **********
|   **********
|
*/
'use strict';


tim.define( module, ( def ) => {


const gleam_point = require( '../gleam/point' );

const gleam_shape_line = require( '../gleam/shape/line' );

const gleam_shape_start = require( '../gleam/shape/start' );

const gleam_border = require( '../gleam/border' );

const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );

const gleam_shape = require( '../gleam/shape' );


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
	const c = gleam_point.zero;

	return( gleam_shape.create(
		'list:init',
		[
			gleam_shape_start.p( c.add( -7, -1 ) ),
			gleam_shape_line.p(  c.add(  7, -1 ) ),
			gleam_shape_line.p(  c.add(  7,  1 ) ),
			gleam_shape_line.p(  c.add( -7,  1 ) ),
			gleam_shape_line.close
		],
		'pc', c
	) );
};


} );

