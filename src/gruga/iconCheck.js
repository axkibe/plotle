/*
| The "check" icon.
|
|                C
|              .*'
|             .*'
|            .*'
|    A.     .*'
|    '*.   .*'
|     '**D**'
|      '***'
|       'B'
*/
'use strict';


tim.define( module, 'gruga_iconCheck', ( def, gruga_iconCheck ) => {


const gleam_color = require( '../gleam/color' );

const gleam_facet = require( '../gleam/facet' );

const gleam_point = require( '../gleam/point' );

const gleam_shape = require( '../gleam/shape' );

const gleam_shape_line = require( '../gleam/shape/line' );

const gleam_shape_start = require( '../gleam/shape/start' );




def.staticLazy.facet = ( ) => gleam_facet.create( 'fill', gleam_color.black );


def.staticLazy.shape =
	function( )
{
	const pc = gleam_point.xy( -2, 0 );

	return(
		gleam_shape.create(
			'list:init',
			[
				gleam_shape_start.p( pc.add( -5, -3  ) ), // A
				gleam_shape_line.p(  pc.add(  2,  5  ) ), // B
				gleam_shape_line.p(  pc.add( 14, -12 ) ), // C
				gleam_shape_line.p(  pc.add(  2, -1  ) ), // D
				gleam_shape_line.close( )                 // A
			],
			'pc', pc
		)
	);
};

} );

